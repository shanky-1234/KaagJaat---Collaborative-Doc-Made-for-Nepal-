const express = require('express')
const { RegisterUser, loginUsers } = require('../Controller/authController')

const router = express.Router()

router.post('/register',RegisterUser)
router.post('/login',loginUsers)

module.exports = router