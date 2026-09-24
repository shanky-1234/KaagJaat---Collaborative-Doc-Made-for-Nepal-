import { useAppSelector } from '#hooks/reduxHooks'
import React from 'react'
import { Navigate, Outlet } from 'react-router'

function PublicRoutes() {
  const {isAuthenticated,jwtToken} = useAppSelector(state=>state.auth)
    if (isAuthenticated && jwtToken) {
        return <Navigate to='/' replace/>
    } 
    return (
    
    <>
    <Outlet/>
    </>
  )
}

export default PublicRoutes