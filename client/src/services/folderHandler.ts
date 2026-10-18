import axios from "axios"
import api from "./api/api"
import type { apiFolderResponse, folderActionResponse, folderDataProps, getDocumentsFolder, getFolderResponse, getSingleFolderResponse } from "@/types/folder"

export const folderService = {
    createFolder:async(data:folderDataProps):Promise<apiFolderResponse>=>{
        try {
            const response = await api.post('folder/createFolder',data)
            return response.data
        } catch (error) {
              console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message, {cause:error})
            }
            throw error
        }
    },
    getFolder:async(spaceId:string | undefined):Promise<getFolderResponse>=>{
        try {
            const respone = await api.get(`folder/getFolder/${spaceId}`)
            return respone.data
        } catch (error) {
              console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message, {cause:error})
            }
            throw error
        }
    },
    getDocumentFolder:async(folderId:string | undefined):Promise<getDocumentsFolder>=>{
        try {
            const respone = await api.get(`folder/${folderId}/documents`)
            return respone.data
        } catch (error) {
              console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message, {cause:error})
            }
            throw error
        }
    },
    getSingleFolder:async(folderId:string | undefined):Promise<getSingleFolderResponse> =>{
        try {
             const respone = await api.get(`folder/info/${folderId}`)
            return respone.data
        } catch (error) {
                console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message, {cause:error})
            }
            throw error
        }
    },
    renameFolder:async({name,folderId} : {name:string, folderId:string | undefined}) =>{
        try {
             const respone = await api.patch(`folder/${folderId}/rename`,{name})
            return respone.data
        } catch (error) {
                console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message, {cause:error})
            }
            throw error
        }
    },
    deleteFolder:async(folderId:string):Promise<folderActionResponse>=>{
        try {
            const response = await api.delete(`folder/${folderId}`)
            return response.data
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message, {cause:error})
            }
            throw error
        }
    },
    getTrashFolders:async(spaceId:string):Promise<getFolderResponse>=>{
        try {
            const response = await api.get('folder/trash',{params:{spaceId}})
            return response.data
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message, {cause:error})
            }
            throw error
        }
    },
    restoreFolder:async(folderId:string):Promise<folderActionResponse>=>{
        try {
            const response = await api.put(`folder/restore/${folderId}`)
            return response.data
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message, {cause:error})
            }
            throw error
        }
    },
    deleteFolderPermanently:async(folderId:string):Promise<folderActionResponse>=>{
        try {
            const response = await api.delete(`folder/permanentDelete/${folderId}`)
            return response.data
        } catch (error) {
            console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message, {cause:error})
            }
            throw error
        }
    }
}
