import express from "express";
import { loginUser, registerUser, createUserByAdmin, listAllUsers, deleteUserByAdmin } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
// admin creates users (protected)
userRouter.post("/create-by-admin", authMiddleware, createUserByAdmin);
// admin list users
userRouter.get("/all", authMiddleware, listAllUsers);
// admin delete user
userRouter.post("/delete", authMiddleware, deleteUserByAdmin);

export default userRouter;
