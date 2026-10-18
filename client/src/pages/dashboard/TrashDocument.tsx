import { documentHandler } from '@/services/documentHandler'
import DocumentCard from '#components/dashboardCards/DocumentCard'
import type { DocumentResponse } from '@/types/documentResponse'
import { useEffect, useState } from 'react'
import { UseHandleDocuments } from '#hooks/useHandleDocuments'
import { Bounce, ToastContainer } from 'react-toastify'
import FolderCard from '#components/dashboardCards/FolderCard'
import { folderService } from '@/services/folderHandler'
import type { folderResponseProps } from '@/types/folder'
import { toast } from 'react-toastify'

function TrashIllustration() {
  return (
    <svg viewBox="0 0 160 140" className="h-28 w-32 shrink-0" aria-hidden="true">
      <ellipse cx="80" cy="128" rx="48" ry="7" fill="#000" opacity="0.15" />
      <rect x="44" y="40" width="72" height="84" rx="10" fill="#fff" opacity="0.95" />
      <rect x="56" y="54" width="8" height="58" rx="4" fill="#A3A3A3" />
      <rect x="76" y="54" width="8" height="58" rx="4" fill="#A3A3A3" />
      <rect x="96" y="54" width="8" height="58" rx="4" fill="#A3A3A3" />
      <g transform="rotate(-14 80 34)">
        <rect x="34" y="26" width="92" height="12" rx="6" fill="#E5E5E5" />
        <rect x="68" y="16" width="24" height="12" rx="5" fill="#E5E5E5" />
      </g>
      <rect x="112" y="6" width="26" height="32" rx="3" fill="#fff" transform="rotate(14 125 22)" />
      <rect x="117" y="14" width="14" height="2.5" rx="1.25" fill="#A3A3A3" transform="rotate(14 125 22)" />
      <rect x="117" y="20" width="10" height="2.5" rx="1.25" fill="#A3A3A3" transform="rotate(14 125 22)" />
    </svg>
  )
}

function TrashDocument() {
    const [trashDocuments,setTrashDocuments] = useState<DocumentResponse[]>([])
    const [trashFolders,setTrashFolders] = useState<folderResponseProps[]>([])
    const {handleRestoreDocument,handlePermanentDelete,currentSpace} = UseHandleDocuments()
    const getTrashDocument = async ()=>{
      if (!currentSpace?._id) {
    return;
  }
        try {
            const response = await documentHandler.getTrashDocument(currentSpace?._id)
            if (response.success){
                setTrashDocuments(response.trashDocument)
            }
            const folderResponse = await folderService.getTrashFolders(currentSpace._id)
            if (folderResponse.success) {
                setTrashFolders(folderResponse.folders)
            }
        } catch (error) {
            console.error(error)
            toast.error(`${error}`)
        }
    }

    useEffect(()=>{
       if (currentSpace?._id) {
    getTrashDocument();
  }
    },[currentSpace?._id])
  return (
    <main className='mt-8 mx-8'>
      <ToastContainer
      position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}/>
    <section>
       <div className={`px-4 py-6 bg-neutral-500 flex-row items-center rounded-xl md:flex justify-between`}>
        <div>
        <h1 className={`font-secondary text-white`}>Items in Trash</h1>
        </div>
        <TrashIllustration />
        </div>
    </section>

    <section className='mt-8'>
      {trashDocuments.length ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {trashDocuments.map((document) => (
            <DocumentCard
              key={document._id}
              variant='trash'
              title={document.name}
              content={document.content}
              author={document.ownerUser.fullname}
              date={document.updatedAt}
              restoreDocument={(e:any)=>
                handleRestoreDocument(e,document._id,()=>{
                  setTrashDocuments((prev)=> prev.filter((doc) => doc._id !== document._id))
                })
              }
              onPermanentDelete={()=>
                handlePermanentDelete(document._id,()=>{
                  setTrashDocuments((prev)=> prev.filter((doc) => doc._id !== document._id))
                })
              }
            />
          ))}
        </div>
      ) : (
        <p className='text-center text-neutral-500'>No documents in trash</p>
      )}
    </section>

    <section className='mt-10'>
      <h2 className='mb-4 text-xl'>Folders in Trash</h2>
      {trashFolders.length ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {trashFolders.map((folder) => (
            <FolderCard
              key={folder._id}
              variant="trash"
              title={folder.name}
              date={folder.updatedAt}
              onRestore={async()=>{
                try {
                  const response = await folderService.restoreFolder(folder._id)
                  if (response.success) {
                    toast.success("Folder Restored")
                    setTrashFolders((prev)=>prev.filter((item)=>item._id !== folder._id))
                  }
                } catch (error) {
                  console.error(error)
                  toast.error(`${error}`)
                }
              }}
              onPermanentDelete={async()=>{
                try {
                  const response = await folderService.deleteFolderPermanently(folder._id)
                  if (response.success) {
                    toast.success("Folder Deleted Permanently")
                    setTrashFolders((prev)=>prev.filter((item)=>item._id !== folder._id))
                  }
                } catch (error) {
                  console.error(error)
                  toast.error(`${error}`)
                }
              }}
            />
          ))}
        </div>
      ) : (
        <p className='text-center text-neutral-500'>No folders in trash</p>
      )}
    </section>

    </main>
  )
}

export default TrashDocument
