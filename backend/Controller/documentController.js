const documentModel = require("../Models/documentModel")
const userModel = require("../Models/userModel")

const createDocuments = async (req,res) =>{
    try {
        const newDocument = await documentModel.create({
            ownerUser:req.user.id,
            name:"New Document"
        })
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

        const document =await documentModel.find({ownerUser:userId}).populate('ownerUser')

        return res.status(200).json({
            success:true,
            message:"Document Successfully Retrieved",
           document
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

    

    const singleDocument = await documentModel.findOne({_id:id,ownerUser:userId}).populate('ownerUser')

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



    const {name,description,content} = req.body

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

    const updatedDocument = await documentModel.findOneAndUpdate({_id:documentId,ownerUser:userId},{
        $set:updatedData
    },{
        new:true,
        runValidators:true
    }).populate('ownerUser')

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

module.exports = {createDocuments,getDocument,getSingleDocument,updateDocument}