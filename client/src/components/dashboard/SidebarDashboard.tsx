import { Sidebar,SidebarContent,SidebarFooter,SidebarGroup,SidebarGroupLabel,SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar'

import { ClockIcon, Home, MenuIcon, Paperclip, Plus, Trash2, UserPlusIcon, type LucideIcon } from 'lucide-react'
import  Button  from '../shared/Button'
import { useLocation } from 'react-router'
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger } from '#components/ui/popover'
import { Avatar, AvatarFallback } from '#components/ui/avatar'
import SpacePickerFooter from './SpacePickerFooter'
import { useEffect, useState } from 'react'
import FolderSidebarManager from './FolderSidebarManager'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '#components/ui/dialog'
import { Input } from '#components/ui/input'
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
      title:"Trash",
      position:4,
      url:'/trash',
      icon:Trash2
    },
  ]

function SidebarDashboard() {
  const [open,setOpen] = useState<boolean>(false)
  const location = useLocation()
  const {state} = useSidebar()
  console.log(state)


  return (
    <>
    <Sidebar className='border-none pt-2 mx-2 top-20 h-[calc(100vh-5rem)] bg-background md:bg-white' collapsible='icon'>
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
                  <span className='group-data-[collapsible=icon]:hidden'>New Document</span>
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
                      <SidebarMenuButton asChild className={`flex ${location.pathname === items.url ? 'bg-primary text-white hover:bg-primary hover:text-white' :'hover:bg-neutral-100 hover:text-black'} `} >
                            <a href={items.url} title={items.title}>
                              <Icon color={`${location.pathname === items.url ? '#fff' : '#BA4800'}`} className='hover:text-black' size={20}/>
                              <span className='group-data-[collapsible=icon]:hidden'>{items.title}</span>
                            </a>
                      </SidebarMenuButton>
                      </SidebarMenuItem>
                )})}
              </SidebarMenu>
            </SidebarGroup>
             <SidebarGroup>
              <SidebarGroupLabel>
                <div className='flex gap-2 flex-row justify-between w-full items-center'>
                     <span className='tracking-[10%] text-[#4B4B4B]'>FOLDERS</span>
                     <Button onClick={()=>setOpen(true)}><Plus size={16}/></Button>
                </div>
              </SidebarGroupLabel>
              <SidebarMenu className='gap-2'>
                 <FolderSidebarManager open={open} setOpen={setOpen}/>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
       <SidebarFooter>
      <SpacePickerFooter/>
</SidebarFooter>
    </Sidebar>
    </>
  )
}

export default SidebarDashboard