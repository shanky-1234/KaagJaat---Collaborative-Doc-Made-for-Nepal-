const express = require('express')
const verifyToken = require('../Middleware/authMiddleware')
const {createDocuments,getDocument, getSingleDocument, updateDocument, deleteDocument, moveDocument, getTrashDocument} = require('../Controller/documentController')

const app = express.Router()

app.post('/createNewDocument',verifyToken,createDocuments)
app.get('/getDocuments',verifyToken,getDocument)
app.get('/documents/:id',verifyToken,getSingleDocument)
app.patch('/updateDocuments/:id',verifyToken,updateDocument)
app.patch('/:documentId/move',verifyToken,moveDocument)
app.delete('/deleteDocuments/:id',verifyToken,deleteDocument)
app.get('/trash',verifyToken,getTrashDocument)

module.exports = app