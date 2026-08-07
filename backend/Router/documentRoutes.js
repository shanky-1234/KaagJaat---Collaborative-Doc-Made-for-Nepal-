const express = require('express')
const verifyToken = require('../Middleware/authMiddleware')
const {createDocuments,getDocument, getSingleDocument, updateDocument, deleteDocument} = require('../Controller/documentController')

const app = express.Router()

app.post('/createNewDocument',verifyToken,createDocuments)
app.get('/getDocuments',verifyToken,getDocument)
app.get('/documents/:id',verifyToken,getSingleDocument)
app.patch('/updateDocuments/:id',verifyToken,updateDocument)
app.delete('/deleteDocuments/:id',verifyToken,deleteDocument)
module.exports = app