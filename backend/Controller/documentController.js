const documentModel = require("../Models/documentModel")
const folderModel = require("../Models/folderModel")
const spaceModel = require("../Models/spaceModel")
const userModel = require("../Models/userModel")
const mongoose = require("mongoose")

const createDocuments = async (req,res) =>{
    try {

        const {spaceId} = req.body
        const space = await spaceModel.findOne({
            _id:spaceId,
            ownerUser:req.user.id, })

            if (!space) {
            return res.status(404).json({
                success: false,
                message: "Personal Space not found"
            })
        }
          const newDocument = await documentModel.create({
            ownerUser:req.user.id,
            name:"New Document",
            space:space._id
        }
    )
        await newDocument.populate('ownerUser','_id fullname email')
        return res.status(200).json({
            success:true,
            message:"Document Successfully Created",
            newDocument,
            space
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
        const {spaceId} = req.query

         if (!spaceId) {
            return res.status(400).json({
                success: false,
                message: "Space ID is required"
            })
        }

        if(!userId) { 
            return res.status(403).json({
                success:false,
                message:"Unauthorized"
            })
        }

        const document =await documentModel.find({ownerUser:userId,space:spaceId,isTrash:{$ne:true}}).populate('ownerUser','_id fullname email').populate('folder')

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

    if (!documentId || !mongoose.isValidObjectId(documentId)) {
        return res.status(400).json({
            success:false,
            message:"A valid document ID is required"
        })
    }

    if(!userId){
        return res.status(403).json({
            success:false,
            message:"Permission Denied"
        })
    }



    const {name,description,content,settings} = req.body || {}

    const updatedData = {}

    if (name !== undefined){
        updatedData.name = typeof name === "string" && name.trim()
            ? name.trim()
            : "Untitled Document"
    }

    if (content !== undefined){
        if (!Array.isArray(content)) {
            return res.status(400).json({
                success:false,
                message:"Document content must be an array"
            })
        }
        updatedData.content = content 
    }

    if (description !== undefined){
        updatedData.description = description || "Write Your Description of your document"
    }

    if (settings !== undefined){
        if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
            return res.status(400).json({
                success:false,
                message:"Document settings must be an object"
            })
        }

        if (settings.pageSize !== undefined) {
            updatedData["settings.pageSize"] = settings.pageSize
        }
        if (settings.orientation !== undefined) {
            updatedData["settings.orientation"] = settings.orientation
        }
        if (settings.margin !== undefined) {
            if (!settings.margin || typeof settings.margin !== "object" || Array.isArray(settings.margin)) {
                return res.status(400).json({
                    success:false,
                    message:"Document margins must be an object"
                })
            }

            for (const side of ["top", "right", "bottom", "left"]) {
                if (settings.margin[side] !== undefined) {
                    const margin = Number(settings.margin[side])
                    if (!Number.isFinite(margin) || margin < 0) {
                        return res.status(400).json({
                            success:false,
                            message:`Margin ${side} must be a non-negative number`
                        })
                    }
                    updatedData[`settings.margin.${side}`] = margin
                }
            }
        }
    }

    if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({
            success:false,
            message:"No valid document fields were provided"
        })
    }

    const updatedDocument = await documentModel.findOneAndUpdate({_id:documentId,ownerUser:userId},{
        $set:updatedData
    },{
        new:true,
        runValidators:true
    }).populate('ownerUser','_id fullname email').populate('folder','_id name')

    if(!updatedDocument){
        return res.status(404).json({
            success:false,
            message:"Document not found or you do not have permission to update it"
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

        const isValidationError = error instanceof mongoose.Error.ValidationError
            || error instanceof mongoose.Error.CastError

        return res.status(isValidationError ? 400 : 500).json({
            success:false,
            message:isValidationError ? error.message : "Internal Server Error"
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

    const deleteDocument = await documentModel.findOne({_id:docId,ownerUser:userId})

    if(!deleteDocument){
        return res.status(403).json({
            success:false,
            message:'you dont have the permission or the document doesnt match'
        })
    }

    deleteDocument.isTrash = true
    deleteDocument.trashDate = new Date()
    deleteDocument.folder = null

    await deleteDocument.save()

    return res.status(200).json({
        success:true,
        message:"Document Deleted Successfully!",
        deletedData:deleteDocument
    })
}
catch (error){
        console.error(error)

    return res.status(500).json({
        success:false,
        message: error.message
    })
}
}

const moveDocument =   async (req,res) =>{
    try {
        const {documentId} = req.params
        const userId = req.user.id
        const {folderId} = req.body

        const document = await documentModel.findOne({
            _id:documentId,
            ownerUser:userId
        })


    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

     if (folderId === null) {
      document.folder = null;
      await document.save();

      return res.status(200).json({
        success: true,
        message: "Document moved successfully",
        document,
      });
    }

    const folder = await folderModel.findOne({
      _id: folderId,
      ownerUser: req.user.id,
      space: document.space,
    });

    if (!folder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found in this space",
      });
    }

    document.folder = folder._id
    await document.save()

       return res.status(200).json({
      success: true,
      message: "Document moved successfully",
      document,
    });

    } catch (error) {
        return res.status(500).json({
      success: false,
      message: "Failed to move document",
      error: error.message,
    });
    }
}

const getTrashDocument = async (req,res) =>{
    try {
        const userId = req.user.id

        const trashDocument =  await documentModel.find({ownerUser:userId,isTrash:true}).populate('ownerUser','_id fullname email').populate('folder')
          return res.status(200).json({
            success: true,
            message: "Trash Documents Retrieved",
            trashDocument
        })

    } catch (error) {
     console.error(error)
      return res.status(500).json({
      success: false,
      message: "Failed to move document",
      error: error.message,
    });
    }
}
module.exports = {createDocuments,getDocument,getSingleDocument,updateDocument,deleteDocument,moveDocument,getTrashDocument}
