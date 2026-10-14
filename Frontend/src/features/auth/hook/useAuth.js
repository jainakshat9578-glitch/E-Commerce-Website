import { setLoading,setUser,seteError,clearUser } from "../state/auth.slice";
import { register, login, getMe } from "../service/auth.api";
import { useDispatch } from "react-redux";

export const useAuth = () =>{
    const dispatch = useDispatch()

    async function handleRegister({email,password,contact,fullname,isSeller = false}){

         const data = await register({email,contact,password,fullname,isSeller})

         dispatch(setUser(data.user))
         return data.user
    }

    async function handleLogin({email,password}){

        const data = await login({email,password})
        dispatch(setUser(data.user))
        return data.user
    }

    async function handleGetMe(){
        try{
        dispatch(setLoading(true))
        const data = await getMe()
        dispatch(setUser(data.user))
        }catch(err){
        console.log("handleGetMe error:", err)
        }finally{
        dispatch(setLoading(false))
        }
    }

     function handleLogout() {
        dispatch(clearUser());
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout
    };
    
}