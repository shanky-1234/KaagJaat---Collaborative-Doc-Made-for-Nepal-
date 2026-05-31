
import { Outlet } from "react-router"
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import SidebarDashboard from "#components/dashboard/SidebarDashboard"
import HeaderDashboard from "#components/dashboard/HeaderDashboard"

type DashboardLayputProp={
    children : React.ReactNode
}

function DashboardLayout() {
  return (
    <SidebarProvider className="bg-background flex-col">
      <div className="w-full fixed px-7 bg-white">
      <HeaderDashboard/>
      </div>
      <div className="flex pt-14 w-full">
       <SidebarDashboard/>
        <main className="flex-1 bg-background w-full h-screen ">
          
            <Outlet/>
        </main>
      </div>
    </SidebarProvider>
    
  )
}

export default DashboardLayout