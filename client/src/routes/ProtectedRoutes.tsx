import { useAppSelector } from '#hooks/reduxHooks'
import { Navigate, Outlet } from 'react-router'

function ProtectedRoutes() {
    const {isAuthenticated,jwtToken} = useAppSelector(state=>state.auth)
    if (!isAuthenticated && !jwtToken){
        return <Navigate to='/auth/login' replace/>
    }
  return (
    <>
        <Outlet/>
    </>
  )
}

export default ProtectedRoutes