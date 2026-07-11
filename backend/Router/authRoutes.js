const express = require('express')
const { RegisterUser, loginUsers, logoutUsers } = require('../Controller/authController')
const verifyToken = require('../Middleware/authMiddleware')

const router = express.Router()

router.post('/register',RegisterUser)
router.post('/login',loginUsers)
router.get('/verify',verifyToken,(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Verification Of Token Successful"
    })
})
router.get('/logout',logoutUsers)

module.exports = router