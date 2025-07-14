import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";


const router=Router();

router.post("/register",authController.register)

router.post("/login", authController.login);

router.post("/logout",verifyJWT ,authController.logout);

router.post("/refresh", authController.refreshAccessToken)


export default router;

