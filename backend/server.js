import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

//middlewares
// We still use express.json for most routes, but Stripe requires the raw body for webhook signature verification.
// The webhook route below will use bodyParser.raw({type: 'application/json'})
app.use(express.json());

// CORS configuration - allow frontend domains
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://frontend-production-0b96.up.railway.app',
    'https://admin-production-642b.up.railway.app',
    'https://restaurant-production-7d80.up.railway.app',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    process.env.RESTAURANT_URL
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// DB connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// webhook endpoint removed (previously used for Stripe). If you add webhooks in future,
// mount the raw body parser and handler here.

// Health check endpoints for Railway and monitoring
app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is healthy" });
});

// Only start server if not in test environment  
// Tests will import the app directly without starting the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server Started on port: ${port}`);
  });
}

// Export app for testing
export default app;