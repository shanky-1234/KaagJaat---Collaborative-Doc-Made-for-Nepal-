import { Button } from '#components/ui/button'
import React from 'react'
import { Editor, Element, Transforms } from 'slate'

interface AlignButtonProps {
    editor:Editor
    align:"left" | "right" | "center" | "justify"
    children:React.ReactNode
}

function AlignButton({editor,align,children}:AlignButtonProps) {
    const handleAlignment = () =>{
        Transforms.setNodes(editor,
            {align},
            {
                match:(node)=>
                Element.isElement(node) && Editor.isBlock(editor,node),
            }
        )
    }
  return (
    <Button type='button' onMouseDown={(event) => {
        event.preventDefault()
        handleAlignment()
      }}>
        {children}
    </Button>
  )
}

export default AlignButton