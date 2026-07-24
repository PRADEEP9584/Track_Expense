import express from 'express';
import {getCurrentUser, registerUser} from '../controllers/userController.js';

const userRouter=express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);


//protected Routes
userRouter.get("/me", authMiddleware, getCurrentUser);