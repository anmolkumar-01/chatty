import  dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import {connectDB} from './lib/db.js'
import cors from 'cors'
import { app, server} from './lib/socket.js'

dotenv.config()

// for production
import path from 'path'
const __dirname = path.resolve()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'https://chatty-frontend-fq81.onrender.com',
  credentials: true,
}))

import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'



app.use("/api/auth", authRoutes)
app.use("/api/messages",messageRoutes)

server.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port " + (process.env.PORT || 5000));
  connectDB();
})