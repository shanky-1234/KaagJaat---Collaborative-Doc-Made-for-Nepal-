import { Avatar,AvatarImage } from "#components/ui/avatar"
import { ChevronDown, Settings, User } from "lucide-react"
import DropdownProfile from "./DropdownProfile"
import { useState } from "react"

function Profile() {
    const [display,setDisplay] = useState<boolean>(false)
  return (
    <div className="relative ">
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