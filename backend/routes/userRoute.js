import express from "express";
import { loginUser, registerUser, createUserByAdmin, listAllUsers, deleteUserByAdmin, makeAdmin } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
// TEMPORARY: Make user admin (remove after initial setup)
userRouter.post("/make-admin", makeAdmin);
// admin creates users (protected)
userRouter.post("/create-by-admin", authMiddleware, createUserByAdmin);
// admin list users
userRouter.get("/all", authMiddleware, listAllUsers);
// admin delete user
userRouter.post("/delete", authMiddleware, deleteUserByAdmin);

export default userRouter;
