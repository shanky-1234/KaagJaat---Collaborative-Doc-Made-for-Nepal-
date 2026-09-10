import { Avatar,AvatarImage } from "#components/ui/avatar"
import { ChevronDown, Settings, User } from "lucide-react"
import DropdownProfile from "./DropdownProfile"
import { useEffect, useRef, useState } from "react"

function Profile() {
    const [display,setDisplay] = useState<boolean>(false)
    const profileRef = useRef<HTMLDivElement>(null)

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
  return (
    <div ref={profileRef} className="relative ">
    <Avatar onClick={():void=>setDisplay(prev=>!prev)} className="cursor-pointer hover:border-2 hover:border-primary transition-all duration-300">
            <AvatarImage src='https://github.com/shadcn.png' sizes="" className="hover:border-2 border-primary"/>
        </Avatar>
        { 
        display &&
    <DropdownProfile/>
        }
    </div>
  )
}

export default Profile