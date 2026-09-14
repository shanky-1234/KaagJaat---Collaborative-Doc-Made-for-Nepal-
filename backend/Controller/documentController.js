const documentModel = require("../Models/documentModel")
const userModel = require("../Models/userModel")

const createDocuments = async (req,res) =>{
    try {
        const newDocument = await documentModel.create({
            ownerUser:req.user.id,
            name:"New Document"
        })

        await newDocument.populate('ownerUser','_id fullname email')
        return res.status(200).json({
            success:true,
            message:"Document Successfully Created",
            newDocument
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error
        })
    }
}

const getDocument = async (req,res)=>{
    try {
        const userId = req.user.id

        if(!userId) { 
            return res.status(403).json({
                success:false,
                message:"Unauthorized"
            })
        }

        const document =await documentModel.find({ownerUser:userId}).populate('ownerUser','_id fullname email')

        return res.status(200).json({
            success:true,
            message:"Document Successfully Retrieved",
           allDocument:document
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:'Internal Server Error'
        })
    }
}

const getSingleDocument = async (req,res)=>{
    try{
    const {id} = req.params
    const userId = req.user.id

    if(!id){
        return res.status(404).json({
            success:false,
            message:"No ID provided"
        })
    }

    if(!userId){
        return res.status(403).json({
            success:false,
            message:"Not Authorized"
        })
    }

    

    const singleDocument = await documentModel.findOne({_id:id,ownerUser:userId}).populate('ownerUser','_id fullname email')

    if(!singleDocument){
        return res.status(404).json({
            success:false,
            message:"Document Not Found!"
        })
    }

    return res.status(200).json({
        success:true,
        message:"Single Document Retrieved",
        singleDocument
    })
}
catch(error){
    console.error(error)
    return res.status(500).json({
        success:false,
        message:'Internal Server Error'
    })
}
}

const updateDocument = async (req,res)=>{
    try{
    const userId = req.user.id
    const documentId = req.params.id  

    if (!documentId) {
        return res.status(404).json({
            success:false,
            message:"Document Not Found"
        })
    }

    if(!userId){
        return res.status(403).json({
            success:false,
            message:"Permission Denied"
        })
    }



    const {name,description,content,settings} = req.body

    const updatedData = {}

    if (name !== undefined){
        updatedData.name = name || "Untitled Document"
    }

    if (content !== undefined){
        updatedData.content = content 
    }

    if (description !== undefined){
        updatedData.description = description || "Write Your Description of your document"
    }

    if (settings !== undefined){
        updatedData.settings = settings
    }

    const updatedDocument = await documentModel.findOneAndUpdate({_id:documentId,ownerUser:userId},{
        $set:updatedData
    },{
        new:true,
        runValidators:true
    }).populate('ownerUser','_id fullname email')

    if(!updatedDocument){
        return res.status(401).json({
            success:false,
            message:"Update Document Failed"
        })
    }

    return res.status(200).json({
        success:true,
        message:"Document Successfully Updated",
        values:updatedData,
        updatedDocument
    })  
    }catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const deleteDocument = async (req,res) =>{
    try{
    const userId = req.user.id
    const docId = req.params.id

    if(!docId) {
        return res.status(404).json({
            success:false,
            message:"Document Not Found"
        })
    }

    const deleteDocument = await documentModel.findByIdAndDelete({_id:docId,ownerUser:userId})

    if(!deleteDocument){
        return res.status(403).json({
            success:false,
            message:'you dont have the permission or the document doesnt match'
        })
    }

    return res.status(200).json({
        success:true,
        message:"Document Deleted Successfully!",
        deletedData:deleteDocument
    })
}
catch (error){
    return res.status(404).json({
            success:false,
            message:"Document Not Found"
        })
}
}

module.exports = {createDocuments,getDocument,getSingleDocument,updateDocument,deleteDocument}