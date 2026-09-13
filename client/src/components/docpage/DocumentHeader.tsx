import { Button } from "#components/ui/button"
import { useState } from "react"

interface DocumentHeaderProps {
    title?:string,
    onTitleChange?:(title:string)=>void
    updateDocument:()=>Promise<void>
}

function DocumentHeader({title,onTitleChange,updateDocument}:DocumentHeaderProps) {

  return (
     <section className='w-full'>
           
            <Button onClick={updateDocument}>Try</Button>
        </section>
  )
}

export default DocumentHeader