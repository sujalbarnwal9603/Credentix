import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import jwt from 'jsonwebtoken';
import ApiResponse from "../utils/ApiResponse.js";
import { Client} from "../models/Client.model.js"

// In- memory store (use Redis in production)
const authCodeStore = new Map();

/**
 * @desc Handle OAuth2 authorization request (returns auth code)
 * @route GET /oauth2/authorize
 * @access Logged-in User
 */


const handleAuthorize= asyncHandler(async(req,res)=>{
    const {response_type, client_id, redirect_uri, scope, state} = req.query;

    if(!response_type || !client_id || !redirect_uri){
        throw new ApiError(400, "Missing required OAuth2 parameters");
    }

    if(response_type!=="code"){
        throw new ApiError(400, "unsupported response_type");
    }

    // Validate client_id and redirect_uri
    const client=await Client.findOne({client_id});

    if(!client){
        throw new ApiError(400, "Invalid client_id");
    }

    if(!client.redirect_uris.includes(redirect_uri)){
        throw new ApiError(400, "Invalid redirect_uri");
    }

    // ✅ Generate and store temporary auth code
    const code = Math.random().toString(36).substring(2,15);
    authCodeStore.set(code,{
        userId: req.user.id,
        client_id,
        scope,
    });


    // ✅ Redirect to client with code
    const redirectUrl= new URL(redirect_uri);
    redirectUrl.searchParams.set("code", code);
    if(state) redirectUrl.searchParams.set("state", state);

    return res.status(302).redirect(redirectUrl.toString());
})

/**
 * @desc Exchange auth code for access & refresh tokens
 * @route POST /oauth2/token
 * @access Public
 */

const handleToken = asyncHandler(async(req,res)=>{
    const {code, client_id, client_secret, redirecct_uri, grant_type}= req.body;

    if(!code || !client_id || !client_secret || !redirecct_uri || !grant_type){
        throw new ApiError(400, "Only 'authorization_code' grant type is supported");
    }
    
    if(grant_type!=="authorization_code"){
        throw new ApiError(400, "Only 'authorization_code' grant_type supported");
    }

    // ✅ Validate client_id and secret
    const client=await Client.findOne({client_id});
    if(!client){
        throw new ApiError(400, "Invalid client_id");
    }

    if(client.client_secret!==client_secret){
        throw new ApiError(400, "Invalid client_secret");
    }

    if(!client.redirect_uris.includes(redirecct_uri)){
        throw new ApiError(400, "Invalid redirect_uri");
    }

    // ✅ Validate and consume auth code
    const authData = authCodeStore.get(code);

    if(!authData || authData.client_id !== client_id){
        throw new ApiError(400, "Invalid or expired code");
    }

    const user =await User.findById(authData.userId);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const accessToken= user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // ✅ Consume the code (one-time use)
    authCodeStore.delete(code);

    return res
        .status(200)
        .json(new ApiResponse(200,{
            access_Token:accessToken,
            refresh_Token: refreshToken,
            token_type: "Bearer",
            expires_in: 15*60,
        }, "Tokens generated successfully"));

})

/**
 * @desc Return user info based on access token
 * @route GET /oauth2/userinfo
 * @access Public (with Bearer token)
 */

const handleUserInfo = asyncHandler(async(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        throw new ApiError(401, "Access token is required");
    }

    const decoded= jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user=await User.findById(decoded._id).select("-password -refreshToken");

    if(!user){
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200,{
            sub: user._id,
            email: user.email,
            fullName: user.fullName,
            tenant: user.tenant,
            role: user.role
        }, "User info fetched successfully"));
});

export default{ 
    handleAuthorize,
    handleToken,
    handleUserInfo
}