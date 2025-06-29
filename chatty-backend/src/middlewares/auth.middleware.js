import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userSchema.js";

import jwt from "jsonwebtoken";

export const protectRoute = asyncHandler(async (req, res, next) => {

    try {
        const token = req.cookies?.jwt ;
            console.log("sent data", req.cookies);
    
            if (!token) {
                throw new ApiError(401, "Unauthorized Request: No Token Provided");
            }
    
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if (!decodedToken) {
                throw new ApiError(401, "Unauthorized Request: Invalid Token");
            }
    
            if (!decodedToken.userId) {
                throw new ApiError(401, "Unauthorized Request: Invalid Token Structure");
            }
    
            // Fetch user and proceed
            const user = await User.findById(decodedToken.userId).select("-password)")
            if (!user) {
                throw new ApiError(401, "Unauthorized Request: User Not Found");
            }
            req.user = user;
            next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(500).json({
            status: "error",
            message: error.message || "Internal Server Error"
        });
    }
})