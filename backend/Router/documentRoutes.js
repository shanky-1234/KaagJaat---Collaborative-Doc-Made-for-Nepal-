const express = require('express')
const verifyToken = require('../Middleware/authMiddleware')
const {uploadImage}= require('../Controller/imageController')
const upload = require('../Middleware/uploadMiddleware')
const {createDocuments,getDocument, getSingleDocument, updateDocument, deleteDocument, moveDocument, getTrashDocument, restoreDocument} = require('../Controller/documentController')

const app = express.Router()

app.post('/createNewDocument',verifyToken,createDocuments)
app.get('/getDocuments',verifyToken,getDocument)
app.get('/documents/:id',verifyToken,getSingleDocument)
app.patch('/updateDocuments/:id',verifyToken,updateDocument)
app.patch('/:documentId/move',verifyToken,moveDocument)
app.delete('/deleteDocuments/:id',verifyToken,deleteDocument)
app.put('/restoreDocuments/:docId',verifyToken,restoreDocument)
app.get('/trash',verifyToken,getTrashDocument)
app.post('/uploadImage',verifyToken,upload.single('image'),uploadImage)
// app.delete('/permanentDelete/:docId',verifyToken,deletePermanently)

module.exports = app