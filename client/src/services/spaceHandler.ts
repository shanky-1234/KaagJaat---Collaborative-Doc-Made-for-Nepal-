import axios from "axios"
import api from "./api/api"
import type { spaceResponseProps } from "@/types/spaceResponse"

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
    }
}