import { Settings, User, type IconNode, type LucideIcon } from 'lucide-react'
import React, { useState } from 'react'
import Button from './Button'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '#hooks/reduxHooks'
import { userAuthService } from '@/services/userAuth'
import { setLoading, setLogout, setToken, setUserData } from '@/redux/AuthSlice'

    type DropdownOption = {
        label:string,
        link:string,
        icon:LucideIcon
    }
function DropdownProfile() {

    const [error,setError] = useState<string>('')
    const {userData} = useAppSelector(state=>state.auth)

    const dispatch = useAppDispatch()

    const options:DropdownOption[] = [{
        label:'Profile',
        link:'',
        icon:User
    },{
        label:'Settings',
        link:'',
        icon:Settings
    }]

    const handleLogout = async()=>{
        dispatch(setLoading(true))
        try{
        const response = await userAuthService.userLogout()
        if (response.success){
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            localStorage.removeItem("isAuthenticated")
            dispatch(setLogout())

        }
    }
    catch(error){
        console.error(error)
        if (error instanceof Error)
            setError(error.message)
    }
    finally{
        (dispatch(setLoading(false)))
    }
    }

  return (
    <div className="p-3 bg-white absolute -bottom-50 -left-50 shadow-md min-w-[200px] border-neutral-200 border-2 rounded-xl">
        <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src="https://github.com/shadcn.png" className="w-full h-full object-contain"/>
            </div>
            <div className="flex flex-col">
            <p className="font-bold font-secondary text-[16px] text-supporting">{userData?.fullname}</p>
            <span className="text-neutral-two text-xs">{userData?.email}</span>
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
            <Button className='w-full text-sm bg-transparent border-1 border-primary rounded-xl text-primary' onClick={handleLogout}>
                Log Out
            </Button>
        </div>
    </div>
  )
}

export default DropdownProfile