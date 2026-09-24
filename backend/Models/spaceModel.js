const mongoose = require('mongoose')

const SpaceSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,'Space Name is Required'],
        maxLength:[150,'Space title can only have 150 characters']
    },
    ownerUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    isPersonal:{
        type:Boolean,
        required:false
    }
},{timestamps:true})

module.exports = mongoose.model("space",SpaceSchema)