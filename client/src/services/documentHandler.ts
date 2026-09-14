import axios from "axios"
import api from "./api/api"
import type { allDocumentResponse, createDocumentResponse, deleteDocumentResponse, singleDocumentResponse, upadateDocumentResponse } from "@/types/documentResponse"
import type { Descendant } from "slate"
import type { DocumentSettingType } from "@/types/documentSetting"

type updateValue = {
    name?:string,
    description?:string,
    content?:Descendant[],
    settings?:DocumentSettingType
}


export const documentHandler = {
    createDocument:async():Promise<createDocumentResponse>=>{
        try {
           const response = await api.post('document/createNewDocument')
           return response.data
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message)
            }
            throw error
        }
    },
    getSingleDocument:async(id:string):Promise<singleDocumentResponse>=>{
        try {
            const response = await api.get(`document/documents/${id}`)
            return response.data
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message)
            }
            throw error
        }
    },
    getAllDocuments:async():Promise<allDocumentResponse>=>{
        try {
            const response = await api.get('document/getDocuments')
            return response.data
        } catch (error) {
             console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message)
            }
            throw error
        }
    },
    updateDocument:async(id:string,update:updateValue):Promise<upadateDocumentResponse>=>{
        try {
            const response = await api.patch(`document/updateDocuments/${id}`,update)
            return response.data
        } catch (error) {
                  console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message)
            }
            throw error
        }       
    },
    deleteDocument:async(id:string):Promise<deleteDocumentResponse>=>{
        try {
            const response = await api.delete(`document/deleteDocuments/${id}`)
            return response.data
        } catch (error) {
             console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message)
            }
            throw error
        }
    }
}