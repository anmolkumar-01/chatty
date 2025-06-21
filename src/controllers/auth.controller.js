import {ApiError} from   "../utils/apiError.js";
import {ApiResponse} from "../utils/apiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const signup = asyncHandler(async (req, res) => {

    const {email, fullName, password} = req.body;

    if (!email || !fullName || !password) {
        throw new ApiError(400, "Email, full name, and password are required");
    }

    res.status(201).json(new ApiResponse("User created successfully"));
});

export const login = (req, res) => {
    res.send("Login route");
}

export const logout = (req, res) => {
    res.send("Logout route");
}
