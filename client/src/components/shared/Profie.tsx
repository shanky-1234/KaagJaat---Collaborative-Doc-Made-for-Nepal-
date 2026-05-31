import { Avatar,AvatarImage } from "#components/ui/avatar"
import { ChevronDown } from "lucide-react"

function Profile() {
  return (
    <>
    <Avatar className="cursor-pointer hover:border-2 hover:border-primary relative">
            <AvatarImage src='https://github.com/shadcn.png' sizes="" className="hover:border-2 border-primary"/>
        </Avatar>
    <div className="p-3 bg-white absolute -bottom-12 shadow-md min-w-[200px] border-neutral-200 border-2 rounded-xl">
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
    </div>
    </>
  )
}

export default Profile