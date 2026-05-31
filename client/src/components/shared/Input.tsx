import { Icon, type LucideIcon } from 'lucide-react'
import React from 'react'


type InputProps = {props?:React.InputHTMLAttributes<HTMLElement>,
    className?:string,
    placeholder:string,
    icon:LucideIcon
}
function Input({props,className,placeholder,icon}:InputProps) {
    const Icon = icon
  return (
    <div className='relative'>
    <Icon className='absolute top-3 left-3' size={12} color='#BFBFBF'/>
    <input {...props} placeholder={placeholder} className={`${className} px-8 py-2 text-supporting border-2 border-neutral-one rounded-full text-sm max-w-100 w-100`}/>
    </div>
  )
}

export default Input