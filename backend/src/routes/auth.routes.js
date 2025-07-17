import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import express from "express";


const router=express.Router();

router.post("/register",authController.registerUser)

router.post("/login", authController.loginUser);

router.post("/logout",verifyJWT ,authController.logoutUser);

router.post("/refresh", authController.refreshAccessToken)


export default router;

