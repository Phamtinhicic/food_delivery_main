import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/FoodDelivery";
const SALT_ROUNDS = Number(process.env.SALT) || 10;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AdminPass123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

const run = async () => {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB for seeding");

    const exists = await userModel.findOne({ email: ADMIN_EMAIL });
    if (exists) {
      console.log("Admin already exists:", ADMIN_EMAIL);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, salt);

    const admin = new userModel({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hashed, role: "admin" });
    await admin.save();
    console.log("Admin created:", ADMIN_EMAIL);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

run();
