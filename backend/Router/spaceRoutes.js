const express = require('express')
const verifyToken = require('../Middleware/authMiddleware')
const { createSpace, getSpace } = require('../Controller/spaceController')

const router = express.Router()

router.post('/create',verifyToken,createSpace)
router.get('/getSpace',verifyToken,getSpace)

module.exports = router