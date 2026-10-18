const cloudinary = require('../config/cloudinary')
const {Readable} = require('stream')

const uploadImage = async(req,res)=>{
    try {
        if (!req.files){
            return res.status(400).json({
                success:false,
                message:"No Image File Not Provided"
            })
        }

        const result = await new Promise((resolve,reject)=>{
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder:'kaagjaat/images',
                    resource_type:'image'
                },
                (error,uploadedImage) =>{
                    if(error){
                        reject(error)
                    }
                    else{
                        resolve(uploadedImage)
                    }
                }
            )

            Readable.from(req.file.buffer).pipe(stream)
        })


        return res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error('Image upload failed:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Failed to upload image',
        });
    }
}

module.exports = uploadImage