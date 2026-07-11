const jwt = require("jsonwebtoken")

const verifyToken = async (req,res,next) =>{
    try {
        const header = req.headers["authorization"]

        if (!header || !header.startsWith("Bearer ")){
            return res.status(401).json({
                success:false,
                message:"Token Not Detected"
            })
        }

        const token = header.split(" ")[1]

        jwt.verify(token,process.env.JWT_TOKEN, (err,decoded)=>{
            if (err){
                return res.status(403).json({
                    success:false,
                    message:"Token Not Valid"
                })
            }

            req.user = decoded
            next()
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:'Internal Server Error',
            error
        })
    }
}

module.exports = verifyToken