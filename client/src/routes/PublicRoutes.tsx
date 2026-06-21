import { useAppSelector } from '#hooks/reduxHooks'
import React from 'react'
import { Navigate, Outlet } from 'react-router'

function PublicRoutes() {
  const {isAuthenticated,userData, jwtToken} = useAppSelector(state=>state.auth)
    if (isAuthenticated && userData && jwtToken) {
        return <Navigate to='/' replace/>
    } 
    return (
    
    <>
    <Outlet/>
    </>
  )
}

export default PublicRoutes