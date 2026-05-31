import {Route, Routes} from 'react-router'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import DocPage from './pages/docpage/DocPage'
import DocPageLayout from './layouts/DocPageLayout'

function App() {

  return (
   <Routes>
      <Route element={<DashboardLayout/>}>
          <Route path='/' element={<DashboardHome/>}/>
      </Route>
      <Route element={<DocPageLayout/>}>
          <Route path='/doc' element={<DocPage/>}/>
      </Route>
   </Routes>
  )
}

export default App
