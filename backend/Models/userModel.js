const mongoose = require("mongoose")

const UserModel = new mongoose.Schema({
    fullname:{
        type:String,
        required:[true,"Name is Required"],
        maxlength:[150,"Name Shouldn't Cross More than 80 Character"]
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        trim:true,
        lowercase:true,
        unique:true,
        match:[ /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    "Please enter a valid email address"]
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
        minlength:[8,"Minimium 8 characters"]
    },
    gender:{
        type:String,
        required:[true,"Gender is Required"],
        enum:['male','female','others']
    },
    dob:{
        type:Date,
        required:[true,"DOB is Required"]
    },
    purpose:{
        type:String,
        enum:['Personal Works','Nepali Note AI','Government Works'],
        default:'Personal Works'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    documents:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"documents"
    }
},{timestamps:true})

module.exports = mongoose.model("users",UserModel)