import { Button } from '#components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '#components/ui/dialog'
import { Input } from '#components/ui/input'
import { UseHandleDocuments } from '#hooks/useHandleDocuments'
import { folderService } from '@/services/folderHandler'
import type { folderResponseProps } from '@/types/folder'
import { Folder } from 'lucide-react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

type FolderSidebarProps = {
    open:boolean,
    setOpen: Dispatch<SetStateAction<boolean>>;
}

function FolderSidebarManager({open,setOpen}:FolderSidebarProps) {
  const navigate = useNavigate()

  const {folderId} = useParams()
  console.log(folderId)
  const {currentSpace} = UseHandleDocuments()
  const [folderName,setFolderName] = useState<string>('')

  const [allFolders,setAllFolders] = useState<folderResponseProps[]>([])


  const createFolder = async () =>{
        try {
               const data = {
                name:folderName,
                spaceId:currentSpace?._id
            }
            const response = await folderService.createFolder(data)
            if (response.success){
                setFolderName('')
                getFolders()
                toast.success("Successfully Created Folder")
            }
        } catch (error) {
            console.error("An error Occured",error)
        }
  }

  const getFolders = async ()=>{
    if (!currentSpace?._id) return
    try {
         const response = await folderService.getFolder(currentSpace?._id)
         if (response.success){
            setAllFolders(response.folders)

         }
    } catch (error) {
          console.error("An error Occured",error)
    }
  }

  useEffect(()=>{
    getFolders()
  },[currentSpace])
  return (
    <>
    <div>
    <div className='flex flex-col gap-2'>
        {
            allFolders.map((folder)=>{
                return(
                    <div key={folder._id} title={folder.name} className={`flex items-center rounded-lg gap-2 px-2 py-2 cursor-pointer min-w-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${folderId === folder._id ? 'bg-primary text-white' : ''}`} onClick={()=>navigate(`/myFolder/${folder._id}`)} >
                        <Folder size={14} className='shrink-0'/>
                        <span className='text-sm truncate group-data-[collapsible=icon]:hidden'>{folder.name}</span>
                    </div>
                )
            })
        }
    </div>
    </div>
     <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border border-neutral-300 outline-0! ring-0! ">
          <div>
          <DialogHeader className="text-xl font-bold">  
                Create Folder
          </DialogHeader>
          <DialogDescription>
            Organize Your spaces better with folders
          </DialogDescription>
          </div>
          <div>
            <div className="flex flex-col gap-1">
                    <label htmlFor="spaceName">
                      Folder Name
                    </label>
              <Input
              id="spaceName" 
              placeholder="Eg. University Works" 
              className="placeholder:text-neutral-400 ring-0! border-neutral-500"
              value={folderName}
              onChange={(e)=>setFolderName(e.target.value)} />
          </div>
          </div>
      <DialogFooter className='border-0'>
        <div className='flex gap-2'>
        <DialogClose >
          <Button>
            Cancel
          </Button>
        </DialogClose>
        <Button className='bg-primary rounded-lg text-white' onClick={createFolder}>
          Create
        </Button>
        </div>
      </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default FolderSidebarManager
