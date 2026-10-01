import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '#components/ui/alert-dialog'
import { Avatar,AvatarFallback, AvatarGroup, AvatarImage } from '#components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '#components/ui/dropdown-menu'
import { formatDateandTime } from '@/utils/dateandtime/formatDateandTime'
import { Calendar, Clock, RotateCcw, Delete, DeleteIcon, EllipsisVertical, Folder, FolderSymlink, Pencil, Trash, User } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import type { Descendant } from 'slate'
import DocumentThumbnail from './DocumentThumbnail'
import type { folderResponseProps } from '@/types/folder'
import { documentHandler } from '@/services/documentHandler'
import { toast } from 'react-toastify'

type DocumentCardProps = {
  title:string,
  author:string,
  content:Descendant[],
  date:string,
  onClick?:()=>void | boolean | Promise<void>,
  onClickDelete?:(e: React.MouseEvent<HTMLDivElement>) => void,
  folder?:folderResponseProps,
  folders?:folderResponseProps[],
  onMoveToFolder?:(folderId:string | null) => void | Promise<void>,
  variant?:'default' | 'trash',
  onRestore?:() => void | Promise<void>,
  onPermanentDelete?:() => void | Promise<void>,

}


function DocumentCard({title,author,content,date,onClick,onClickDelete,folder,folders,onMoveToFolder,variant='default',onRestore,onPermanentDelete}:DocumentCardProps) {
  const isTrash = variant === 'trash'
  const [showOption,setShowOption] = useState<boolean>(false)
  const [loading,setLoading] = useState<boolean>(false)

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
    <div className=' relative z-0 max-w-[300px] rounded-xl overflow-shown w-full h-full group cursor-pointer hover:bg-neutral-100 duration-200 transition-all border border-[#D1D1D1]' onClick={onClick}>
        <div className='bg-gray-200 px-8 pt-8 h-auto overflow-hidden'>
          <div className='bg-white rounded-xl overflow-hidden p-4 max-h-56 h-56 group-hover:rotate-2 transition duration-300'>
            <DocumentThumbnail content={content} />
          </div>
        </div>
        <div className='p-3 '>
          <div className='flex justify-between items-center overflow-hidden '>
          <h5 className=' mb-2'>{title}</h5>
          <DropdownMenu>
              <DropdownMenuTrigger onClick={(e)=>e.stopPropagation()}>
                 <EllipsisVertical size={20} className='hover:bg-neutral-200 rounded-full  ' onClick={(e)=>{
            e.stopPropagation()
          }}/>
              </DropdownMenuTrigger>
              <DropdownMenuContent onClick={(e)=>e.stopPropagation()} className='bg-white border-1 border-neutral-300 ring-0! outline-0!'>
                {isTrash ? (
                  <>
                    <DropdownMenuItem className='ring-0 outline-0 border-0 cursor-pointer' onClick={(e) => {
                      e.stopPropagation()
                      void onRestore?.()
                    }}>
                      <div className='flex items-center gap-2'>
                        <RotateCcw size={14}/>
                        <span>Restore</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='ring-0 outline-0 border-0 cursor-pointer hover:bg-neutral-400' onClick={(e) => {
                      e.stopPropagation()
                      setShowOption(true)
                    }}>
                      <div className='flex items-center gap-2'>
                        <Trash size={14}/>
                        <span>Delete Permanently</span>
                      </div>
                    </DropdownMenuItem>
                  </>
                ) : (
                <>
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
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className='flex items-center gap-2'  onClick={(e) => e.stopPropagation()}>
                      <FolderSymlink size={14}/>
                      <span>Move to</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className='bg-white border-1 border-neutral-300 ring-0! outline-0!'>
                    {
                      folders?.map((targetFolder)=> (
                        <DropdownMenuItem 
                          key={targetFolder._id}
                          disabled={folder?._id === targetFolder._id}
                          onSelect={(event) => {
                            event.stopPropagation()
                            void onMoveToFolder?.(targetFolder._id)
                          }}
                        >
                          <Folder size={14}/>
                          {targetFolder.name}
                        </DropdownMenuItem>
                      ))
                    }
                    {!folders?.length && (
                      <DropdownMenuItem disabled>No folders available</DropdownMenuItem>
                    )}
                    {folder && (
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.stopPropagation()
                          void onMoveToFolder?.(null)
                        }}
                      >
                        Remove from folder
                      </DropdownMenuItem>
                    )}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                </>
                )}
              </DropdownMenuContent>
          </DropdownMenu>
         
          </div>
          {
          folder &&
          <div className='flex items-center gap-2 mb-2'>
            <Folder size={14}/>
            <span className='text-sm'>{folder?.name}</span>
          </div>
}
          <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-1'>
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
          <div className='flex gap-1'>
            <Clock color='#BA4800' size={12}/>
            <span className='text-primary text-xs'>Edited {formatDateandTime(date)}</span>
          </div>
          </div>
        </div>
    </div>
    <AlertDialog open={showOption} onOpenChange={setShowOption}>
      <AlertDialogContent className='bg-white ring-0 border border-neutral-200'>
          <AlertDialogHeader>
            <AlertDialogTitle className='font-primary text-primary'>
              {isTrash ? 'Delete Permanently' : 'Move to Trash'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isTrash
                ? 'This document will be deleted permanently and cannot be restored.'
                : 'The item will move to the trash. It will remain for 30days and will be deleted permanently automatically. You can still restore this document by going to the trash'}
            </AlertDialogDescription>
          </AlertDialogHeader>
            <AlertDialogFooter className='bg-neutral-100 border-0'>
          <AlertDialogCancel className='bg-primary text-white cursor-pointer'>Cancel</AlertDialogCancel>
          <AlertDialogAction className='cursor-pointer' onClick={(e) => {
    e.stopPropagation()
    if (isTrash) {
      void onPermanentDelete?.()
    } else {
      onClickDelete?.(e as any)
    }
  }}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default DocumentCard
