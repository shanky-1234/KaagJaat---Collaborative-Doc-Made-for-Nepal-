import { Avatar,AvatarFallback, AvatarGroup, AvatarImage } from '#components/ui/avatar'
import { Calendar, Delete, DeleteIcon, EllipsisVertical, Trash, User } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { Descendant } from 'slate'

type DocumentCardProps = {
  title:string,
  author:string,
  content:Descendant[],
  date:string,
  onClick?:()=>void,
  onClickDelete?:(e: React.MouseEvent<HTMLDivElement>) => void
}


function DocumentCard({title,author,content,date,onClick,onClickDelete}:DocumentCardProps) {
  const [showOption,setShowOption] = useState<Boolean>(false)

  const dropDownRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const handleClick = (event:MouseEvent) =>{
      if (dropDownRef.current && !dropDownRef.current.contains(event?.target as Node)){
        setShowOption(false)
      }
    }
    document.addEventListener('mousedown',handleClick)

    return ()=>{
      document.removeEventListener('mousedown',handleClick)
    }

  },[])
  return (
    <div className=' relative z-0 max-w-[300px] rounded-xl overflow-shown w-full h-full group cursor-pointer border border-[#D1D1D1]' onClick={onClick}>
        <div className='bg-gray-200 px-8 pt-8 h-auto overflow-hidden'>
          <div className='bg-white rounded-xl overflow-hidden p-4 max-h-56 h-56 group-hover:rotate-2 transition duration-300'>
              <p className='text-center'>शिक्षा सुधार योजना २०८१ हाम्रो शिक्षा प्रणालीमा गुणस्तर...</p>
          </div>
        </div>
        <div className='p-3 '>
          <div className='flex justify-between items-center overflow-hidden'>
          <h5 className=' mb-2'>{title}</h5>
          <EllipsisVertical size={20} className='hover:bg-neutral-200 rounded-full  ' onClick={(e)=>{
            e.stopPropagation()
            setShowOption(true)
          }}/>
          </div>
          <div className='flex justify-between items-center'>
          <div className='flex gap-1'>
            <Calendar color='#BA4800' size={12}/>
            <span className='text-primary text-xs'>{date}</span>
          </div>
          {/* <AvatarGroup>
            <Avatar >
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <AvatarFallback>LR</AvatarFallback>
        </Avatar>
          </AvatarGroup> */}
          </div>
        </div>
        {/* Dropdown Option */}
        { showOption &&
        <div ref={dropDownRef} className='absolute bottom-0 z-10 h-auto hover:bg-red-100  right-0 p-4 bg-white shadow-lg' >
          <div >
            <div className='flex gap-2 items-center ' onClick={(e)=>{
              e.stopPropagation()
              onClickDelete?.(e)
            }}>
              <Trash size={16}/>
              <span className='text-sm'>Delete</span>
            </div>
          </div>
        </div>
}
    </div>
  )
}

export default DocumentCard