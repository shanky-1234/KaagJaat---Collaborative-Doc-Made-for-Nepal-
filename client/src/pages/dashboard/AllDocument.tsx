import SearchDocumentHeader from '#components/allDocuments/SearchDocumentHeader'
import DocumentCard from '#components/dashboardCards/DocumentCard'
import DocumentCardList from '#components/dashboardCards/DocumentCardList'
import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '#components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#components/ui/select'
import { UseHandleDocuments } from '#hooks/useHandleDocuments'
import { documentHandler } from '@/services/documentHandler'
import { folderService } from '@/services/folderHandler'
import type { folderResponseProps } from '@/types/folder'
import { Grid3X3, List, ListFilter, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

function AllDocument() {
  const [search,setSearch] = useState<string>('')
   const [sortBy, setSortby] = useState<string>("latest")
   const [viewType, setViewType] = useState<string>("grid")
   const [folders, setFolders] = useState<folderResponseProps[]>([])
  const { handleCreateDocument,
          getAllDocument,
          handleDocumentRouting,
          handleDocumentDelete,
          userDocuments,
        currentSpace} = UseHandleDocuments()
  
  useEffect(() => {
       if (!currentSpace?._id) return;
      getAllDocument();
      folderService.getFolder(currentSpace._id)
        .then((response) => {
          if (response.success) setFolders(response.folders)
        })
        .catch((error) => toast.error(error instanceof Error ? error.message : "Unable to load folders"))
      console.log(userDocuments);
    }, [currentSpace?._id]);

     const sortedDocuments = [...userDocuments].sort((a,b)=>{
      const dateA = new Date(a.updatedAt).getTime()
      const dateB = new Date(b.updatedAt).getTime()

      if (sortBy === "earliest") {
    return dateA - dateB;
  }

  return dateB - dateA;

  })

  const handleMoveToFolder = async (documentId:string, folderId:string | null) => {
    try {
      const response = await documentHandler.moveDocument(documentId, folderId)
      if (response.success) {
        await getAllDocument()
        toast.success(folderId ? "Document moved to folder" : "Document removed from folder")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to move document")
    }
  }

  

  return (
    <main className='mt-8 mx-8'>
       <section className="relative -z-20 rounded-3xl overflow-hidden mb-10">
         <SearchDocumentHeader/>
      </section>
      <section className='mb-8'>
        <div className='flex md:flex-row flex-col items-center gap-12'>
        <InputGroup className='focus-within:ring-0! focus-within:border-neutral-500! border-neutral-300! py-6'>
        <InputGroupInput id="spaceName" value={search} placeholder="Search Documents" className="placeholder:text-neutral-400 focus:ring-0! active:ring-0! focus:outline-0! active:outline-0! ring-0! border-neutral-500!" onChange={(e)=>setSearch(e.target.value)}/>
        <InputGroupAddon>
        <Search color='#737373'/>
      </InputGroupAddon>
       </InputGroup>
       <div className='flex flex-row gap-2'>
                  <Select value={sortBy} onValueChange={setSortby}>
            <SelectTrigger
              className="
                w-fit
                border
                bg-neutral-200
                border-0
                focus:border-neutral-400!
                focus-visible:border-neutral-400!
                focus-visible:ring-0
                data-[state=open]:border-neutral-400!
              "
            >
              <div className="flex gap-2 items-center p-2 rounded-xl">
              <ListFilter size={14}/>
              <SelectValue className='text-sm'/>
              </div>
            </SelectTrigger>
            <SelectContent
             position="popper"
        side="bottom"
        align="start"
        className="
          bg-white
          !border-neutral-400
          !ring-0
          !outline-none
        ">
              <SelectItem value="latest">
                By Latest Edited
              </SelectItem>
              <SelectItem value="earliest">
                By Earliest Edited
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex rounded-lg bg-neutral-100 p-1" aria-label="Document view">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Grid view"
              aria-pressed={viewType === "grid"}
              onClick={() => setViewType("grid")}
              className={`h-8 w-8 cursor-pointer ${viewType === "grid" ? "bg-white text-primary shadow-sm" : "text-neutral-500"}`}
            >
              <Grid3X3 size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="List view"
              aria-pressed={viewType === "list"}
              onClick={() => setViewType("list")}
              className={`h-8 w-8 cursor-pointer ${viewType === "list" ? "bg-white text-primary shadow-sm" : "text-neutral-500"}`}
            >
              <List size={16} />
            </Button>
          </div>
       </div>
       </div>
      </section>
      <section>
        {viewType === "list" ? (
          <div className="flex flex-col gap-3">
            {sortedDocuments.map((document) => {
              return (
                <DocumentCardList
                  key={document._id}
                  title={document.name}
                  content={document.content}
                  author={document.ownerUser.fullname}
                  date={document.updatedAt}
                  folder={document.folder}
                  folders={folders}
                  onMoveToFolder={(folderId) => handleMoveToFolder(document._id, folderId)}
                  onClick={() => handleDocumentRouting(document._id)}
                  onClickDelete={(e: any) =>
                    handleDocumentDelete(e, document._id)
                  }
                />
              );
            })}
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
            {sortedDocuments.map((document) => {
              return (
                <DocumentCard
                  key={document._id}
                  title={document.name}
                  content={document.content}
                  author={document.ownerUser.fullname}
                  date={document.updatedAt}
                  folder={document.folder}
                  folders={folders}
                  onMoveToFolder={(folderId) => handleMoveToFolder(document._id, folderId)}
                  onClick={() => handleDocumentRouting(document._id)}
                  onClickDelete={(e: any) =>
                    handleDocumentDelete(e, document._id)
                  }
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default AllDocument
