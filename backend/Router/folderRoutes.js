const express = require('express')
const verifyToken = require('../Middleware/authMiddleware')
const { createFolder, getFolders, getFolderDocuments, getSingleFolder, renameFolder, deleteFolder, getTrashFolders, restoreFolder, deleteFolderPermanently } = require('../Controller/folderController')
const router = express.Router()

router.post('/createFolder',verifyToken,createFolder)
router.get('/getFolder/:spaceId',verifyToken,getFolders)
router.get('/info/:folderId',verifyToken,getSingleFolder)
router.get('/:folderId/documents',verifyToken,getFolderDocuments)
router.patch('/:folderId/rename',verifyToken,renameFolder)
router.delete('/:folderId',verifyToken,deleteFolder)
router.get('/trash',verifyToken,getTrashFolders)
router.put('/restore/:folderId',verifyToken,restoreFolder)
router.delete('/permanentDelete/:folderId',verifyToken,deleteFolderPermanently)

module.exports = router