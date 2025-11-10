import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Make user admin (TEMPORARY ENDPOINT - remove after use)
const makeAdmin = async (req, res) => {
  const { email, secret } = req.body;
  
  // Simple security: require a secret key
  if (secret !== process.env.ADMIN_SETUP_SECRET) {
    return res.json({ success: false, message: "Unauthorized" });
  }
  
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    
    user.role = "admin";
    await user.save();
    res.json({ success: true, message: `${email} is now admin` });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch =await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const role=user.role;
    const token = createToken(user._id);
    res.json({ success: true, token,role });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Create token

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// register user

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // checking user is already exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    // hashing user password

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const role=user.role;
    const token = createToken(user._id);
    res.json({ success: true, token, role});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// create user by admin (admin-only)
const createUserByAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // only admin can create users here (we expect auth middleware to set req.body.userId)
    const adminUser = await userModel.findById(req.body.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.json({ success: false, message: 'You are not admin' });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: 'User already exists' });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter valid email' });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Please enter strong password' });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      role: role || 'user',
    });

    await newUser.save();
    res.json({ success: true, message: 'User created' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

// list all users (admin-only)
const listAllUsers = async (req, res) => {
  try {
    const adminUser = await userModel.findById(req.body.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.json({ success: false, message: 'You are not admin' });
    }
    const users = await userModel.find({}).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

// delete user (admin-only)
const deleteUserByAdmin = async (req, res) => {
  try {
    const adminUser = await userModel.findById(req.body.userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.json({ success: false, message: 'You are not admin' });
    }
    const { id } = req.body;
    await userModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

export { loginUser, registerUser, createUserByAdmin, listAllUsers, deleteUserByAdmin, makeAdmin };
