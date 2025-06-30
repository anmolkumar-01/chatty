import  dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import {connectDB} from './lib/db.js'
import cors from 'cors'
import { app, server} from './lib/socket.js'

dotenv.config()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173',
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