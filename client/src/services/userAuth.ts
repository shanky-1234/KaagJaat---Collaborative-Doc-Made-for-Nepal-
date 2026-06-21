import axios from "axios"
import api from "./api/api"

type RegisterData = {
    fullname:string,
    email:string,
    password:string,
    dob:string,
    purpose?:string,
    gender:string
}

type LoginData = {
    email:string,
    password:string
}

export const userAuthService = {
    userLogin: async (data:LoginData):Promise<LoginResponse> =>{
        try {
            const response = await api.post('/auth/login',data)
            return response.data
        } catch (error) {
            console.error(error)
             if(axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message)
            }
            throw error
        }
    },
    userRegister:async(registerData:RegisterData):Promise<RegisterResponse> =>{
        try {
            const response = await api.post('/auth/register',registerData)
        return response.data
        } catch (error) {
            console.error(error)
            throw error
        }
    },
    userLogout:async():Promise<DefaultResponse>=>{
        try {
            const response = await api.get('/auth/logout')
            return response.data
        } catch (error) {
            console.error(error)
            if(axios.isAxiosError(error)){
                throw new Error(error?.response?.data.message)
            }
            throw error
        }
    }
}