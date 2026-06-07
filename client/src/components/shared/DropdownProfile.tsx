import { Settings, User, type IconNode, type LucideIcon } from 'lucide-react'
import React from 'react'
import Button from './Button'
function DropdownProfile() {
    type DropdownOption = {
        label:string,
        link:string,
        icon:LucideIcon
    }
    const options:DropdownOption[] = [{
        label:'Profile',
        link:'',
        icon:User
    },{
        label:'Settings',
        link:'',
        icon:Settings
    }]

  return (
    <div className="p-3 bg-white absolute -bottom-50 -left-50 shadow-md min-w-[200px] border-neutral-200 border-2 rounded-xl">
        <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="https://github.com/shadcn.png" className="w-full h-full object-contain"/>
            </div>
            <div className="flex flex-col">
            <p className="font-bold font-secondary text-[16px] text-supporting">Shashank Tuladhar</p>
            <span className="text-neutral-two text-xs">tuladharshashank11@gmail.com</span>
            </div>
        </div>
        <hr className="mt-2 border-neutral-one"/>
        <div className="mt-2">
            {
                options.map(option=>{
                    const Icon = option.icon
                    return(
                        <div className="flex p-2 gap-2 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
                            <Icon size={20}/>
                            <span className="text-supporting text-sm">{option.label}</span>
                        </div>
                    )
                })
            }
        </div>
        <div className='mt-2'>
            <Button className='w-full text-sm bg-transparent border-1 border-primary rounded-xl text-primary'>
                Log Out
            </Button>
        </div>
    </div>
  )
}

export default DropdownProfile