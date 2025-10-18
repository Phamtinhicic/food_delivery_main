import express from "express";
import authMiddleware from "../middleware/auth.js";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder, captureStripeSession, cancelOrder, confirmDelivery } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
// test endpoint: create order without calling Stripe (useful for local debugging)
orderRouter.post("/place-test",authMiddleware, async (req, res) => {
	try {
		const newOrder = new (await import("../models/orderModel.js")).default({
			userId: req.body.userId,
			items: req.body.items,
			amount: req.body.amount,
			address: req.body.address,
		});
		await newOrder.save();
		await (await import("../models/userModel.js")).default.findByIdAndUpdate(req.body.userId, { cartData: {} });
		res.json({ success: true, message: "Order saved (test)" });
	} catch (error) {
		console.error("place-test error:", error);
		res.status(500).json({ success: false, message: "Error" });
	}
});
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/capture", captureStripeSession);
orderRouter.post("/status",authMiddleware,updateStatus);
orderRouter.post("/cancel",authMiddleware,cancelOrder);
orderRouter.post("/confirm-delivery",authMiddleware,confirmDelivery);
orderRouter.post("/userorders",authMiddleware,userOrders);
orderRouter.get("/list",authMiddleware,listOrders);

export default orderRouter;