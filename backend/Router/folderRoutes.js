const express = require('express')
const verifyToken = require('../Middleware/authMiddleware')
const { createFolder, getFolders, getFolderDocuments, getSingleFolder, renameFolder } = require('../Controller/folderController')
const router = express.Router()

router.post('/createFolder',verifyToken,createFolder)
router.get('/getFolder/:spaceId',verifyToken,getFolders)
router.get('/info/:folderId',verifyToken,getSingleFolder)
router.get('/:folderId/documents',verifyToken,getFolderDocuments)
router.patch('/:folderId/rename',verifyToken,renameFolder)

module.exports = router