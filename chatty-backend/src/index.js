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
  origin: 'http://localhost:5173',
  credentials: true,
}))

import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'



app.use("/api/auth", authRoutes)
app.use("/api/messages",messageRoutes)

// for production
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname,"../chatty-frontend/dist")))

  app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "../chatty-frontend", "dist", "index.html"))
  })
}

server.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port " + (process.env.PORT || 5000));
  connectDB();
})