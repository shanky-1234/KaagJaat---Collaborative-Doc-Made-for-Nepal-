import { createSlice } from "@reduxjs/toolkit";


type authType = {
    userData:LoginResponseData | null ,
    jwtToken:string | null,
    isLoading:boolean,
    isAuthenticated:boolean
}

const userData = JSON.parse(localStorage.getItem("user") ?? "null")
const token = localStorage.getItem("token")
const isAuthenticated = localStorage.getItem("isAuthenticated")

const initialState:authType = {
    userData:userData ,
    jwtToken:token || null,
    isLoading:false,
    isAuthenticated:Boolean(isAuthenticated)
}
export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload
            state.isAuthenticated = true
        },
        setToken:(state,action)=>{
            state.jwtToken = action.payload
        },
        setLoading:(state,action) =>{
            state.isLoading = action.payload 
        },
        setLogout:(state)=>{
            state.isAuthenticated = false
            state.userData = null
            state.jwtToken = null
        }
    }
})

export const {setUserData, setToken, setLoading,setLogout} = authSlice.actions
export default authSlice.reducer