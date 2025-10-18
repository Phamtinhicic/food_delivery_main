import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

// placing user order for frontend (supports COD and Stripe)
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
  try {
    const { paymentMethod } = req.body; // 'cod' or 'stripe'
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
      paymentMethod: paymentMethod || "cod",
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Dev mode: simulate successful online payment without external provider
    if (process.env.DEV_PAYMENT === "true" && paymentMethod === "stripe") {
      await orderModel.findByIdAndUpdate(newOrder._id, { payment: true });
      const successUrl = `${frontend_url}/verify?success=true&orderId=${newOrder._id}`;
      return res.json({ success: true, session_url: successUrl });
    }

    if (!paymentMethod || paymentMethod === "cod") {
      // Cash on Delivery: mark payment=false, return success
      return res.json({ success: true, message: "Order placed with Cash on Delivery", orderId: newOrder._id });
    }

    // Stripe flow
    if (paymentMethod === "stripe") {
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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        // include session_id placeholder so Stripe will replace it with the real id on redirect
        success_url: `${frontend_url}/verify?orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        metadata: { orderId: newOrder._id.toString() },
      });

      // save stripe session id to order for later verification
      newOrder.stripeSessionId = session.id;
      await newOrder.save();

    return res.json({ success: true, session_url: session.url });
    }

    return res.status(400).json({ success: false, message: "Invalid payment method" });
  } catch (error) {
    console.error("placeOrder error:", error);
    res.status(500).json({ success: false, message: "Payment Error", details: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel and restaurant
const listOrders = async (req, res) => {
  try {
    const userData = await userModel.findById(req.body.userId);
    if (userData && (userData.role === "admin" || userData.role === "restaurant")) {
      const orders = await orderModel.find({});
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
    const userData = await userModel.findById(req.body.userId);
    if (userData && (userData.role === "admin" || userData.role === "restaurant")) {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
        status: req.body.status,
      });
      res.json({ success: true, message: "Status Updated Successfully" });
    } else {
      res.json({ success: false, message: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };

// Capture Stripe checkout session: verify session id and mark order as paid
const captureStripeSession = async (req, res) => {
  const { orderId, sessionId } = req.body;
  if (!sessionId || !orderId) return res.status(400).json({ success: false, message: "Missing parameters" });
  try {
    if (!stripe) return res.status(500).json({ success: false, message: "Stripe not configured" });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session && session.payment_status === "paid") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: "Payment verified" });
    }
    return res.status(400).json({ success: false, message: "Payment not completed" });
  } catch (err) {
    console.error("captureStripeSession error:", err);
    return res.status(500).json({ success: false, message: "Error", details: err.message });
  }
};

export { captureStripeSession };
