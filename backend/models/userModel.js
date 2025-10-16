import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default:"user" },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

// Use mongoose.models to avoid OverwriteModelError when module is reloaded
const userModel = mongoose.models['user'] || mongoose.model("user", userSchema);
export default userModel;
