import { Button } from '#components/ui/button'
import { insertPageBreak } from '@/utils/pageBreak'
import { StickyNotePlus } from 'lucide-react'
import React from 'react'
import type { Editor } from 'slate'

interface PageBreakButtonProps {
    editor:Editor
}

function PageBreakButton({editor}:PageBreakButtonProps) {

  const handlePageBreak = () =>{
    insertPageBreak(editor)
  }
  return (
    <Button className='cursor-pointer' onClick={handlePageBreak}>
        <StickyNotePlus/>
    </Button>
  )
}

export default PageBreakButton