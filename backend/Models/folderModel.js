const mongoose = require('mongoose')

const FolderSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    ownerUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    space:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'space',
        required:true   
    },
    isTrash:{
        type:Boolean,
        default:false,
    },
    trashDate:{
        type:Date,
        default:null
    }
},{timestamps:true})

module.exports = mongoose.model('folders',FolderSchema)