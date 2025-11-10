import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";
import { cloudinary } from "../config/cloudinary.js";

// add food items

const addFood = async (req, res) => {
  // Cloudinary automatically uploads and returns URL
  let image_url = req.file.path; // Full Cloudinary URL
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_url,
  });
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      await food.save();
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// remove food item
const removeFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (userData && userData.role === "admin") {
      const food = await foodModel.findById(req.body.id);
      
      // Delete image from Cloudinary if it's a Cloudinary URL
      if (food.image && food.image.includes('cloudinary.com')) {
        const publicId = food.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food Removed" });
    } else {
      res.json({ success: false, message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// toggle food availability status
const toggleFoodStatus = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }
    
    // Toggle available status (default true if not set)
    const newStatus = !(food.available ?? true);
    food.available = newStatus;
    await food.save();
    
    res.json({ 
      success: true, 
      message: `Food ${newStatus ? 'enabled' : 'disabled'}`,
      available: newStatus
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error toggling status" });
  }
};

// update food item
const updateFood = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData || userData.role !== "admin") {
      return res.json({ success: false, message: "You are not admin" });
    }

    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Update fields
    if (req.body.name) food.name = req.body.name;
    if (req.body.description) food.description = req.body.description;
    if (req.body.price) food.price = req.body.price;
    if (req.body.category) food.category = req.body.category;
    
    // Update image if new one provided
    if (req.file) {
      // Delete old image from Cloudinary
      if (food.image && food.image.includes('cloudinary.com')) {
        const publicId = food.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      food.image = req.file.path; // New Cloudinary URL
    }

    await food.save();
    res.json({ success: true, message: "Food Updated", data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating food" });
  }
};

export { addFood, listFood, removeFood, toggleFoodStatus, updateFood };
