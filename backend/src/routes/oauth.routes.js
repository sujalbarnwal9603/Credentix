import { Router } from "express";
import oauthController from "../controllers/oauth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

/**
 * @route GET /oauth2/authorize
 * @desc Initiate OAuth2 flow
 */

router.get("/authorize", verifyJWT, oauthController.handleAuthorize);

/**
 * @route POST /oauth2/token
 * @desc Exchange code for token
 */

router.post("/token", oauthController.handleToken);

/**
 * @route GET /oauth2/userinfo
 * @desc Get user profile from access token
 */

router.get("/userinfo", oauthController.handleUserInfo);


router.post("/introspect", oauthController.handleIntrospect);


export default router;