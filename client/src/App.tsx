import {Route, Routes} from 'react-router'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import DocPage from './pages/docpage/DocPage'
import DocPageLayout from './layouts/DocPageLayout'
import LoginPage from './pages/authPage/LoginPage'
import ProtectedRoutes from './routes/ProtectedRoutes'
import PublicRoutes from './routes/PublicRoutes'
import RegisterPage from './pages/authPage/RegisterPage'

function App() {

  return (
   <Routes>
      <Route element={<ProtectedRoutes/>}>
      <Route element={<DashboardLayout/>}>
          <Route path='/' element={<DashboardHome/>}/>
      </Route>
      <Route element={<DocPageLayout/>}>
          <Route path='/doc' element={<DocPage/>}/>
      </Route>
      </Route>
      <Route element={<PublicRoutes/>}>
            <Route path='/auth/login' element={<LoginPage/>}/>
            <Route path='/auth/createAccount' element={<RegisterPage/>}/>
      </Route>
   </Routes>
  )
}

export default App
