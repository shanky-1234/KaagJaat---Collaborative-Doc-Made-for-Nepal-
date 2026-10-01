import axios from "axios"
import api from "./api/api"
import type { createSpaceProps, spaceDataProps, spaceResponseProps } from "@/types/spaceResponse"

export const spaceService = {
    getSpace: async():Promise<spaceResponseProps> =>{
        try {
            const response = await api.get('space/getSpace')
            console.log(response.data)
            return response.data
        }catch (error) {
             console.error(error)
            if (axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message)
            }
            throw error
        }
    },
    createSpace:async(spaceData:any):Promise<createSpaceProps> =>{
        try {
            const response = await api.post('space/create',spaceData)
            console.log(response.data)
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