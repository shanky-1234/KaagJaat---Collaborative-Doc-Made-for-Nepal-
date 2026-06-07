import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userData:null,
    jwtToken:null,
    isLoading:false,
    isAuthenticated:false
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
        }
    }
})

export const {setUserData, setToken, setLoading} = authSlice.actions
export default authSlice.reducer