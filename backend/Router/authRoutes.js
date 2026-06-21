const express = require('express')
const { RegisterUser, loginUsers, logoutUsers } = require('../Controller/authController')

const router = express.Router()

router.post('/register',RegisterUser)
router.post('/login',loginUsers)
router.get('/logout',logoutUsers)

module.exports = router