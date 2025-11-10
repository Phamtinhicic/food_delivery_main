import express from "express";
import { addFood, listFood, removeFood, toggleFoodStatus, updateFood } from "../controllers/foodController.js";
import { upload } from "../config/cloudinary.js";
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

// Using Cloudinary storage for images
foodRouter.post("/add",upload.single("image"),authMiddleware,addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",authMiddleware,removeFood);
foodRouter.put("/toggle-status/:id",toggleFoodStatus);
foodRouter.put("/update",upload.single("image"),authMiddleware,updateFood);

export default foodRouter;
