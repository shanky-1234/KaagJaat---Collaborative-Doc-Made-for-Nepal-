const spaceModel = require("../Models/spaceModel")

const createSpace = async(req,res) =>{
    try {
        const userId = req.user.id
        const {name , purpose, visibility} = req.body

        if (!name){
            return res.status(403).json({
                success:false,
                message:"Name is Required"
            })
        }

        const findSpaceById = await spaceModel.findOne({ownerUser:userId,name:name.trim()})

        if (findSpaceById){
            return res.status(401).json({
                success:false,
                message:"Same Name Workspace already exists choose different"
            })
        }
        const newSpace = await spaceModel.create({
            name:name,
            ownerUser:userId,
            isPersonal:true,
            purpose,
            visibility
        })

        return res.status(200).json({
            success:true,
            message:"New Space is Created!",
            newSpace
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

const getSpace = async (req,res) =>{
    try {
        const userId = req.user.id

        const space = await spaceModel.find({ownerUser:userId})

        return res.status(200).json({
            success:true,
            message:"Spaces Successfully Retrieved",
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

module.exports = {createSpace,getSpace}