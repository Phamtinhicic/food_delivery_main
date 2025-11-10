import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import userModel from "../models/userModel.js";

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/FoodDelivery";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@fooddelivery.com";

const run = async () => {
  try {
    await mongoose.connect(MONGO);
    console.log("Connected to MongoDB");

    const user = await userModel.findOne({ email: ADMIN_EMAIL });
    if (!user) {
      console.log("User not found:", ADMIN_EMAIL);
      process.exit(1);
    }

    if (user.role === "admin") {
      console.log("User is already admin:", ADMIN_EMAIL);
      process.exit(0);
    }

    user.role = "admin";
    await user.save();
    console.log("✅ User promoted to admin:", ADMIN_EMAIL);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

run();
