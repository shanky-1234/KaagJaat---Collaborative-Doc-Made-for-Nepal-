const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose")
require("dotenv").config()
const connectToDB = require('./config/database')

const authRoute = require('./Router/authRoutes')
const documentRoute = require('./Router/documentRoutes')
const transliterate = require('./Controller/transliteration')

connectToDB()

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())



app.use('/v1/api/auth',authRoute)
app.use('/v1/api/document',documentRoute)
app.use('/v1/api/transliterate',transliterate)

app.listen(process.env.PORT,()=>{
    
    console.log("Server Successfully Online ! on port",process.env.PORT)
})