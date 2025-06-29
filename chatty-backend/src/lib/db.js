import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "chat-app"
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to the database from db -> database.js: ', error);
    }
}