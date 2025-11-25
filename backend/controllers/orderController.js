import orderRepository from "../repositories/orderRepository.js";
import userRepository from "../repositories/userRepository.js";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

// placing user order for frontend (STRIPE ONLY - order created after payment)
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    // Only Stripe payment allowed
    if (!stripe) {
      console.error("Stripe not configured (STRIPE_SECRET_KEY missing)");
      return res.status(500).json({ success: false, message: "Payment provider not configured" });
    }

    const line_items = (req.body.items || []).map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity) || 1,
    }));

    // add delivery fee as separate line item
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    // Create Stripe session with order data in metadata (don't create order yet)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend_url}/verify?success=false`,
      metadata: {
        userId: req.body.userId,
        items: JSON.stringify(req.body.items),
        amount: req.body.amount.toString(),
        address: JSON.stringify(req.body.address),
      },
    });

    // Clear cart immediately (user committed to purchase)
    await userRepository.updateCart(req.body.userId, {});

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({ success: false, message: "Payment Error", details: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { session_id, success } = req.body;
  try {
    if (success === "true" && session_id) {
      // Retrieve Stripe session to get metadata
      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      if (session.payment_status === "paid") {
        // Create order ONLY after payment confirmed
        const orderData = {
          userId: session.metadata.userId,
          items: JSON.parse(session.metadata.items),
          amount: parseFloat(session.metadata.amount),
          address: JSON.parse(session.metadata.address),
          payment: true,
          paymentMethod: "stripe",
          stripeSessionId: session_id,
        };
        
        const newOrder = await orderRepository.create(orderData);
        
        return res.json({ success: true, message: "Payment verified, order created", orderId: newOrder._id });
      }
    }
    
    // Payment failed or cancelled
    return res.json({ success: false, message: "Payment not completed" });
  } catch (error) {
    console.error("verifyOrder error:", error);
    res.json({ success: false, message: "Error verifying payment" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderRepository.findByUserId(req.body.userId);
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel and restaurant
const listOrders = async (req, res) => {
  try {
    const userData = await userRepository.findById(req.userId || req.body.userId);
    if (userData && (userData.role === "admin" || userData.role === "restaurant")) {
      const orders = await orderRepository.findAll();
      res.json({ success: true, data: orders });
    } else {
      res.json({ success: false, message: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating status (admin and restaurant can update)
const updateStatus = async (req, res) => {
  try {
    const userData = await userRepository.findById(req.userId || req.body.userId);
    if (userData && (userData.role === "admin" || userData.role === "restaurant")) {
      await orderRepository.updateStatus(req.body.orderId, req.body.status);
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for cancelling order with reason (admin and restaurant can cancel)
const cancelOrder = async (req, res) => {
  try {
    const userData = await userRepository.findById(req.body.userId);
    if (userData && (userData.role === "admin" || userData.role === "restaurant")) {
      await orderRepository.update(req.body.orderId, {
        status: "Cancelled",
        cancelReason: req.body.reason || "No reason provided",
        cancelledAt: new Date(),
        cancelledBy: userData.role
      });
      res.json({ success: true, message: "Order Cancelled Successfully" });
    } else {
      res.json({ success: false, message: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for customer to confirm delivery (only for "Out for delivery" orders)
const confirmDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await orderRepository.findById(orderId);
    
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    // Check if order belongs to the user
    if (order.userId.toString() !== req.body.userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    
    // Check if order is in "Out for delivery" status
    if (order.status !== "Out for delivery") {
      return res.json({ success: false, message: "Order is not ready for confirmation" });
    }
    
    // Update to Delivered
    await orderRepository.update(orderId, {
      status: "Delivered",
      deliveredAt: new Date()
    });
    
    res.json({ success: true, message: "Order confirmed as delivered" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Capture Stripe checkout session: verify session id and mark order as paid
const captureStripeSession = async (req, res) => {
  const { orderId, sessionId } = req.body;
  if (!sessionId || !orderId) return res.status(400).json({ success: false, message: "Missing parameters" });
  try {
    if (!stripe) return res.status(500).json({ success: false, message: "Stripe not configured" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session && session.payment_status === "paid") {
      await orderRepository.updatePayment(orderId, true);
      return res.json({ success: true, message: "Payment verified" });
    }
    return res.status(400).json({ success: false, message: "Payment not completed" });
  } catch (err) {
    console.error("captureStripeSession error:", err);
    return res.status(500).json({ success: false, message: "Error", details: err.message });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, cancelOrder, confirmDelivery, captureStripeSession };
