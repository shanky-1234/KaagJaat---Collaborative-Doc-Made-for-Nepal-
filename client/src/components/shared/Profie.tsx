import { Avatar,AvatarFallback,AvatarImage } from "#components/ui/avatar"
import { ChevronDown, Settings, User } from "lucide-react"
import DropdownProfile from "./DropdownProfile"
import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "#hooks/reduxHooks"

function Profile() {
    const [display,setDisplay] = useState<boolean>(false)
    const profileRef = useRef<HTMLDivElement>(null)

    const {userData} = useAppSelector(state=>state.auth)

    useEffect(()=>{
      const handleClicks = (e:MouseEvent)=>{
        if(!profileRef.current?.contains(e.target as Node)){
          setDisplay(false)
        }
      }
       document.addEventListener("mousedown",handleClicks)
       return ()=>{
        document.removeEventListener("mousedown", handleClicks)
       }
    },[])

    const getInitial = (userName:string | undefined) =>{
      if (!userName) return "??"

    const parts = userName.trim().split(" ")
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  
  // Takes the first letter of the first name and the first letter of the last name
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    }
  return (
    <div ref={profileRef} className="relative " >
    <Avatar   onClick={():void=>setDisplay(prev=>!prev)} className="cursor-pointer hover:border-primary transition-all border-0! outline-none! ring-0! duration-300">
            <AvatarFallback className="bg-primary text-white outline-none! ring-0! border-0!">
              {
                getInitial(userData?.fullname)
              }
            </AvatarFallback>
        </Avatar>
        { 
        display &&
    <DropdownProfile/>
        }
    </div>
  )
}

export default Profile