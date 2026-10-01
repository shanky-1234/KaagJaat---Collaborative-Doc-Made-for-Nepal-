const mongoose = require("mongoose")
const documentModel = require("../Models/documentModel")
const folderModel = require("../Models/folderModel")
const spaceModel = require("../Models/spaceModel")

const createFolder = async(req,res) =>{
    try {
        const userId = req.user.id
        const {name,spaceId} = req.body

        if (!name) {
            return res.status(401).json({
                success:false,
                message:"Name is Required"
            })
        }

        if (!spaceId) {
            return res.status(401).json({
                success:false,
                message:"Space ID is not provided"
            })
        }

        const checkSpace = await spaceModel.findOne({
            _id:spaceId,
            ownerUser:userId
        })

        if (!checkSpace){
            return res.status(403).json({
                success:false,
                message:"You don't have permission here."
            })
        }

        const newFolder = await folderModel.create({
            name,
            ownerUser:userId,
            space:spaceId
        })

        return res.status(200).json({
            success:true,
            message:"You have successfully created the folder",
            newFolder
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

const getFolders = async (req,res) =>{
    try {
        const userId = req.user.id
        const {spaceId} = req.params

        if (!mongoose.Types.ObjectId.isValid(spaceId)) {
            return res.status(400).json({
                success:false,
                message:"Invalid space id"
            })
        }

        const folders = await folderModel.find({
      space: spaceId,
      ownerUser: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message:"Folder Successfully Retrieved",
      folders,
    });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

const getSingleFolder = async (req,res) =>{
    try {
        const userId = req.user.id
        const {folderId} = req.params

        if (!folderId) {
            return res.status(404).json({
                success:false,
                message:"Folder Not Found",
            })
        }

        const folder = await folderModel.findOne({
            ownerUser:userId,
            _id:folderId
        })

        return res.status(200).json({
            success:true,
            message:"Succesfully Got Folder Information",
            folder
        })
    } catch (error) {
              return res.status(500).json({
      success: false,
      message: "Failed to fetch folder documents",
      error: error.message,
    });    
    }
}

const getFolderDocuments = async(req,res) =>{
    try {
        const userId = req.user.id
        const {folderId} = req.params

        const folder = await folderModel.findOne({
            _id:folderId,
            ownerUser:userId
        })

        if (!folder){
            return res.status(404).json({
                success:false,
                message:"Folder Not Found"
            })
        }

        const document = await documentModel.find({
            ownerUser:userId,
            folder:folderId,
            space:folder.space
        }).sort({updatedAt:-1})

          return res.status(200).json({
      success: true,
      message:"Folder Successfully Retrieved",
      document,
    });
    } catch (error) {
       return res.status(500).json({
      success: false,
      message: "Failed to fetch folder documents",
      error: error.message,
    });    
    }
}

const renameFolder = async (req,res) =>{
    try {
        const userId = req.user.id
        const {folderId} = req.params
        const {name} = req.body

        if (!folderId) {
            return res.status(404).json({
                success:false,
                message:"Folder Id not present"
            })
        }

        const findFolder = await folderModel.findOne({
            ownerUser:userId,
            _id:folderId
        })

        if (!findFolder) {
            return res.status(403).json({
                success:false,
                message:"You Dont have permission"
            })
        }

        findFolder.name = findFolder.name
        
        if (name){
        findFolder.name = name
        await findFolder.save()
        }
        return res.status(200).json({
            success:true,
            message:"Successfully Folder Updated",
        })
    } catch (error) {
          return res.status(500).json({
      success: false,
      message: "Failed to fetch folder documents",
      error: error.message,
    });    
    }
}


module.exports = {createFolder,getFolders,getFolderDocuments,getSingleFolder,renameFolder}