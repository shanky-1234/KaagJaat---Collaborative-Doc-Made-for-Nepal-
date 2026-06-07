import { Sidebar,SidebarContent,SidebarGroup,SidebarGroupLabel,SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'

import { ClockIcon, Home, MenuIcon, Paperclip, Plus, UserPlusIcon, type LucideIcon } from 'lucide-react'
import  Button  from '../shared/Button'


function SidebarDashboard() {
  type menuItems =  {
    position:number,
    title:string,
    url:string,
    icon:LucideIcon
  }
  const sidebarMainMenu:menuItems[] = [
    {
      title:"Home",
      position:1,
      url:'/',
      icon:Home
    },
      {
      title:"My Documents",
      position:2,
      url:'/myDocs',
      icon:Paperclip
    },
      {
      title:"Shared With Me",
      position:3,
      url:'/sharedWithMe',
      icon:UserPlusIcon
    },
      {
      title:"Recents",
      position:4,
      url:'/recent',
      icon:ClockIcon
    },
  ]

  const {toggleSidebar,state} = useSidebar()
  console.log(state)
  return (
    <Sidebar className='border-none pt-2 px-7 top-20 h-[calc(100vh-3.2rem)] bg-background md:bg-white' collapsible='icon'>
        {/* <SidebarHeader>
          <div className='flex items-center gap-4'>
          
          <MenuIcon onClick={toggleSidebar} color='#343434' />
            
          <div className='w-40'>
              <img src={logo} alt="logo" className='w-full h-full object-contain'/>
            </div>
            </div>
            </SidebarHeader>   */}
          <SidebarContent className='mt-4'>
            <SidebarGroup>
               <Button className='bg-primary rounded text-white flex justify-center '>
                <div className='flex items-center gap-2'>
                  <span>New</span>
                  <Plus/>
                </div>
               </Button>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel className='tracking-[10%] text-[#4B4B4B]'>
                MENU
              </SidebarGroupLabel>
              <SidebarMenu className='gap-2' >
                  { 
                  sidebarMainMenu.map(items=>{
                    const Icon = items.icon
                    return(
                    <SidebarMenuItem key={items.position}>
                      <SidebarMenuButton className='flex' >
                            <Icon color='#BA4800'/>
                            <a href={items.url}>{items.title}</a>
                      </SidebarMenuButton>
                      </SidebarMenuItem>
                )})}
              </SidebarMenu>
            </SidebarGroup>
             <SidebarGroup>
              <SidebarGroupLabel className='tracking-[10%] text-[#4B4B4B]'>
                FOLDERS
              </SidebarGroupLabel>
              <SidebarMenu className='gap-2'>
                 
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
    </Sidebar>
  )
}

export default SidebarDashboard