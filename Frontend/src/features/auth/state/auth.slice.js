import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        loading:true,
        error: null,
    },
    reducers:{
        setUser:(state,action)=>{
         state.user= action.payload
        },
        setLoading:(state,action)=>{
            state.loading= action.payload
        },
        seteError:(state,action)=>{
            state.error= action.payload
        },
        clearUser: (state) => {
             state.user = null;
             state.error = null;
        },
    }
})

export const {setLoading,setUser,seteError,clearUser} = authSlice.actions
export default authSlice.reducer