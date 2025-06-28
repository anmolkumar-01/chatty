import {ApiError} from   "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/userSchema.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// signup controller
export const signup = asyncHandler(async (req, res) => {

    const {email, fullName, password} = req.body;
    console.log("Data received in signup controller:", req.body);

    if (!email || !fullName || !password) {
        throw new ApiError(400, "Email, full name, and password are required");
    }
    if(password.length < 6) {
        throw new ApiError(400, "Password must be at least 6 characters long");
    }

    // check if user already exists
    const user = await User.findOne({email});
    if (user) {
        throw new ApiError(400, "User already exists with this email");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // crate new user
    const newuser = await User.create({
        email,
        fullName,
        password : hashedPassword,
    });

    if(!newuser) {
        throw new ApiError(500, "User creation failed");
    }

    // generate jwt token here
    generateToken(newuser._id,res);
    await newuser.save();

    res.status(201).json( new ApiResponse(201, newuser, "User created successfully"));
    

});

// login controller
export const login = asyncHandler(async (req,res) =>{

    const {email, password} = req.body;
    console.log("Data received in login controller:", req.body);
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    // check if user exists
    const user = await User.findOne({email})

    if (!user) {
        throw new ApiError(400, "Invalid credentials, user not found");
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid credentials, incorrect password");
    }
    // generate jwt token here
    generateToken(user._id, res);
    res.status(200).json(new ApiResponse(200, user, "User logged in successfully"));
})

// logout controller
export const logout = asyncHandler(async (req, res) => {

    // clear the cookie
    res.cookie("jwt","",{maxAge: 0});
    res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
})

// update profile-photo controller
export const updateProfile = asyncHandler(async (req, res) => {

    console.log("Data received in updateProfile controller:", req.files);

    if(!req.files || !req.files.profilePic) {
        throw new ApiError(400, "Profile picture is required");
    }

    // getting the local path of the uploaded file
    const picLocalPath = req.files.profilePic[0].path;
    if(!picLocalPath) {
        throw new ApiError(400, "Profile picture is required");
    }

    // upload the file to cloudinary - send a response with the uploaded file URL
    const uploadResponse = await cloudinary.uploader.upload(picLocalPath)
    if(!uploadResponse || !uploadResponse.url) {
        throw new ApiError(500, "Failed to upload profile picture");
    }

    // update the user profile picture in the database
    const userId = req.user._id;

    
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {profilePic: uploadResponse?.url || " "},
        {new: true}
    ).select("-password -refreshToken");

    res.status(200).json(new ApiResponse(200, updatedUser, "Profile picture updated successfully"));
})

// check if user is loggedIn/auth check or not
export const checkLoggedIn = asyncHandler(async (req, res) => {

    // only the authenticated user can access this route - req.user will be set by the auth middleware
    if(!req.user) {
        throw new ApiError(401, "User is not authenticated");
    }
    res.status(200).json(new ApiResponse(200, req.user, "User is authenticated"));
})