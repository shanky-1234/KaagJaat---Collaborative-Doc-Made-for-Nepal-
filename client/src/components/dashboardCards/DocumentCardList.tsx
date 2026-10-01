import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '#components/ui/alert-dialog'
import { Avatar,AvatarFallback, AvatarGroup, AvatarImage } from '#components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '#components/ui/dropdown-menu'
import { formatDateandTime } from '@/utils/dateandtime/formatDateandTime'
import { Clock, EllipsisVertical, FileText, Folder, FolderSymlink, Pencil, Trash } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import type { Descendant } from 'slate'
import type { folderResponseProps } from '@/types/folder'

type DocumentCardListProps = {
  title:string,
  author:string,
  content:Descendant[],
  date:string,
  onClick?:()=>void | boolean | Promise<void>,
  onClickDelete?:(e: React.MouseEvent<HTMLDivElement>) => void,
  folder?:folderResponseProps,
  folders?:folderResponseProps[],
  onMoveToFolder?:(folderId:string | null) => void | Promise<void>
}

function DocumentCardList({title,author,date,onClick,onClickDelete,folder,folders,onMoveToFolder}:DocumentCardListProps) {
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
    <div className='relative z-0 w-full rounded-xl group cursor-pointer border border-[#D1D1D1] flex items-center justify-between gap-4 px-4 py-3 hover:bg-neutral-100 transition duration-200' onClick={onClick}>
        <div className='flex items-center gap-3 min-w-0 flex-1'>
          <div className='bg-gray-200 rounded-lg p-2 shrink-0'>
            <FileText size={20} className='text-neutral-600'/>
          </div>
          <div className='min-w-0'>
            <h5 className='truncate'>{title}</h5>
            {folder && (
              <div className='flex items-center gap-1 text-neutral-500'>
                <Folder size={12}/>
                <span className='truncate text-xs'>{folder.name}</span>
              </div>
            )}
          </div>
        </div>
        <div className='flex items-center gap-1 shrink-0'>
          <Clock color='#BA4800' size={12}/>
          <span className='text-primary text-xs whitespace-nowrap'>Edited {formatDateandTime(date)}</span>
        </div>
        <AvatarGroup className='shrink-0'>
          <Avatar >
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
      <AvatarFallback>LR</AvatarFallback>
      </Avatar>
        </AvatarGroup>
        <DropdownMenu>
            <DropdownMenuTrigger>
               <EllipsisVertical size={20} className='hover:bg-neutral-200 rounded-full shrink-0' onClick={(e)=>{
          e.stopPropagation()
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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className='flex items-center gap-2'>
                  <FolderSymlink size={14}/>
                  <span>Move to</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className='border border-neutral-300 bg-white ring-0 outline-0'>
                    {folders?.map((targetFolder) => (
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
                    ))}
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
            </DropdownMenuContent>
        </DropdownMenu>
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

export default DocumentCardList
