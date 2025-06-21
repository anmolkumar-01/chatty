import  dotenv from 'dotenv'
import express from 'express'
import {connectDB} from './lib/db.js'

dotenv.config()


const app = express()

import authRoutes from './routes/auth.route.js'


app.use("/api/auth", authRoutes)

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port " + (process.env.PORT || 5000));
  connectDB();
})