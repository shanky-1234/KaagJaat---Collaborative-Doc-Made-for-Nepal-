import { useAppSelector } from '#hooks/reduxHooks'
import { Navigate, Outlet } from 'react-router'

function ProtectedRoutes() {
    const {isAuthenticated} = useAppSelector(state=>state.auth)
    if (!isAuthenticated){
        return <Navigate to='/auth/login' replace/>
    }
  return (
    <>
        <Outlet/>
    </>
  )
}

export default ProtectedRoutes