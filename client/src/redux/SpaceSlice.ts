import type { spaceProps } from "@/types/spaceResponse";
import { createSlice } from "@reduxjs/toolkit";

interface SpaceState {
    currentSpace: spaceProps | null
}

const initialState:SpaceState = {
    currentSpace:null
}

const spaceSlice = createSlice({
    name:"space",
    initialState,
    reducers: {
        setCurrentSpace:(state,action) => {
            state.currentSpace = action.payload
        },
        clearCurrentSpace:(state) => {
            state.currentSpace = null
        }
    }
})

export const {setCurrentSpace,clearCurrentSpace} = spaceSlice.actions

export default spaceSlice.reducer