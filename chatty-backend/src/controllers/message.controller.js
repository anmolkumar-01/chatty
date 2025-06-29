import {ApiError} from   "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {Message} from "../models/messageSchema.js";
import {User} from "../models/userSchema.js";
import cloudinary from "../lib/cloudinary.js";

// 1. get all users for sidebar
export const getUsersForSidebar = asyncHandler(async (req, res) => {

    const loggedInUserId = req.user._id;

    // Find all users except the logged-in user
    const filterdUsers = await User.find({_id : 
        {$ne: loggedInUserId}
    }).select("-password");

    if (!filterdUsers || filterdUsers.length === 0) {
        throw new ApiError(404, "No users found");
    }

    res.status(200).json(new ApiResponse(200, filterdUsers ,"Users fetched successfully"));


})

// 2. get all messages between two users( my chat with the other person)
export const getMessages = asyncHandler(async (req, res) => {

    const {userId} = req.params;
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    const loggedInUserId = req.user._id;

    // findl all messages between the logged-in user and the specified user
    const messages = await Message.find({
        $or:[
            {sender : loggedInUserId, receiver: userId},
            {sender : userId, receiver: loggedInUserId}
        ]
    })

    if( !messages || messages.length === 0) {
        throw new ApiError(404, "No messages found between the users");
    }

    res.status(200).json(new ApiResponse(200, messages , "Messages fetched successfully"));


})

// 3. send a message
export const sendMessage = asyncHandler(async (req, res) => {

    // get text from the request body
    const {text} = req.body;
    if (!text) {
        throw new ApiError(400, "Message text is required");
    }

    // get the image from request files
    console.log("Data received in sendMessage controller:", req.files);
    if( !req.files || !req.files.image) {
        throw new ApiError(400, "Image is required");
    }

    const imageLocalPath = req.files.image[0].path;
    if (!imageLocalPath) {
        throw new ApiError(400, "Image is required");
    }

    // upload the image to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(imageLocalPath);
    if (!cloudinaryResponse || !cloudinaryResponse.url) {
        throw new ApiError(500, "Failed to upload image");
    }

    // get the receiverId and senderId
    const {receiverId} = req.params;
    if (!receiverId) {
        throw new ApiError(400, "Receiver ID is required");
    }
    const senderId = req.user._id;

    const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text: text,
        image: cloudinaryResponse.url,
        new: true // assuming you want to mark the message as new
    });

    if (!newMessage) {
        throw new ApiError(500, "Failed to send message");
    }


    // ----- todo: real-time message sending using => socket.io -----

    res.status(201).json(new ApiResponse(201, newMessage, "Message sent successfully"));

})
