import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const Protected = ({children, role = "buyer"}) => {

    const user = useSelector(state=> state.auth.user)
    const loading = useSelector(state=>state.auth.loading)

    console.log("Protected component - user:", user, "loading:", loading, "role:", role)

    if(loading){
        return <div>Loading....</div>
    }

    if(!user){
        console.log("No user, redirecting to /login")
        return <Navigate to="/login" />
    }

    if(user.role !== role){
        console.log("Role mismatch, user.role:", user.role, "expected:", role)
        return <Navigate to="/" />
    }

  return children
}

export default Protected
