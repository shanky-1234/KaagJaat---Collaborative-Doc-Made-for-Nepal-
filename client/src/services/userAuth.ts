import api from "./api/api"

type RegisterData = {
    fullname:string,
    email:string,
    password:string,
    dob:Date,
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
            throw error
        }
    },
    userRegister:async(registerData:RegisterData):Promise<RegisterResponse> =>{
        try {
            const response = await api.post('/auth/register',{registerData})
        return (await response).data
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}