import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/User.model.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized Request");
        }
        const decodedToken = jwt.verify(token, ProcessingInstruction.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            throw new ApiError(401, "Unauthorized Request");
        }
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Unauthorized Request");
        }
        req.user = user;
        next();


    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized Request");
    }
})
