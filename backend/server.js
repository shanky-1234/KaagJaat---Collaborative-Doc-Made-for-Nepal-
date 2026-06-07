const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose")
require("dotenv").config()
const connectToDB = require('./config/database')

const authRoute = require('./Router/authRoutes')

connectToDB()

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())



app.use('/v1/api/auth',authRoute)

app.listen(process.env.PORT,()=>{
    
    console.log("Server Successfully Online ! on port",process.env.PORT)
})