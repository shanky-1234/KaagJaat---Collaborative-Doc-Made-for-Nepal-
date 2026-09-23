import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '#components/ui/alert-dialog'
import { Avatar,AvatarFallback, AvatarGroup, AvatarImage } from '#components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '#components/ui/dropdown-menu'
import { formatDateandTime } from '@/utils/dateandtime/formatDateandTime'
import { Calendar, Clock, Delete, DeleteIcon, EllipsisVertical, Pencil, Trash, User } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { Descendant } from 'slate'
import DocumentThumbnail from './DocumentThumbnail'

type DocumentCardProps = {
  title:string,
  author:string,
  content:Descendant[],
  date:string,
  onClick?:()=>void | boolean,
  onClickDelete?:(e: React.MouseEvent<HTMLDivElement>) => void
}


function DocumentCard({title,author,content,date,onClick,onClickDelete}:DocumentCardProps) {
  const [showOption,setShowOption] = useState<boolean>(false)

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
    <>
    <div className=' relative z-0 max-w-[300px] rounded-xl overflow-shown w-full h-full group cursor-pointer border border-[#D1D1D1]' onClick={onClick}>
        <div className='bg-gray-200 px-8 pt-8 h-auto overflow-hidden'>
          <div className='bg-white rounded-xl overflow-hidden p-4 max-h-56 h-56 group-hover:rotate-2 transition duration-300'>
            <DocumentThumbnail content={content} />
          </div>
        </div>
        <div className='p-3 '>
          <div className='flex justify-between items-center overflow-hidden '>
          <h5 className=' mb-2'>{title}</h5>
          <DropdownMenu>
              <DropdownMenuTrigger>
                 <EllipsisVertical size={20} className='hover:bg-neutral-200 rounded-full  ' onClick={(e)=>{
            e.stopPropagation()
            setShowOption(true)
          }}/>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-white border border-neutral-0 ring-0'>
                <DropdownMenuItem className='ring-0 outline-0 border-0 cursor-pointer'>
                  <div className='flex items-center gap-2'>
                  <Pencil size={14}/>
                  <span>Rename</span>
                </div>
                </DropdownMenuItem>
                      <DropdownMenuItem className='ring-0 outline-0 border-0 cursor-pointer hover:bg-neutral-400' onClick={(e) => {
                        e.stopPropagation()
                        setShowOption(true)
                      }}>
                  <div className='flex items-center gap-2'>
                  <Trash size={14}/>
                  <span>Delete</span>
                </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
         
          </div>
          <div className='flex flex-col gap-1'>
          <div className='flex gap-1'>
            <Clock color='#BA4800' size={12}/>
            <span className='text-primary text-xs'>Edited {formatDateandTime(date)}</span>
          </div>
          <AvatarGroup>
            <Avatar >
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <AvatarFallback>LR</AvatarFallback>
        </Avatar>
          </AvatarGroup>
          </div>
        </div>
    </div>
    <AlertDialog open={showOption} onOpenChange={setShowOption}>
      <AlertDialogContent className='bg-white ring-0 border border-neutral-200'>
          <AlertDialogHeader>
            <AlertDialogTitle className='font-primary text-primary'>
              Move to Trash
            </AlertDialogTitle>
            <AlertDialogDescription>
              The item will move to the trash. It will remain for 30days and will be deleted permanently automatically.
              You can still restore this document by going to the trash
            </AlertDialogDescription>
          </AlertDialogHeader>
            <AlertDialogFooter className='bg-neutral-100 border-0'>
          <AlertDialogCancel className='bg-primary text-white cursor-pointer'>Cancel</AlertDialogCancel>
          <AlertDialogAction className='cursor-pointer' onClick={(e) => {
    e.stopPropagation()
    onClickDelete?.(e as any)
  }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default DocumentCard
