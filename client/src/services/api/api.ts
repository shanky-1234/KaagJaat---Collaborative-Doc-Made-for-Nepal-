import { store } from '@/redux/store/store'
import axios from 'axios'

const api = axios.create({
        baseURL:import.meta.env.VITE_API_URL,
        headers:{
            "Content-Type":"application/json"
        },
        withCredentials:true
    })

    api.interceptors.request.use((config)=>{

        if (
        config.url === "auth/logout" ||
        config.url === "/refresh"
    ) {
        return config;
    }
        const token = store.getState().auth.jwtToken

        if (token){
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    })

export default api
