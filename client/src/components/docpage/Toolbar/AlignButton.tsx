import { Button } from '#components/ui/button'
import React from 'react'
import { Editor, Element, Transforms } from 'slate'

interface AlignButtonProps {
    editor:Editor
    align:"left" | "right" | "center" | "justify"
    children?:React.ReactNode
}

export const handleAlignment = ({editor,align}:AlignButtonProps) =>{
        Transforms.setNodes(editor,
            {align},
            {
                match:(node)=>
                Element.isElement(node) && Editor.isBlock(editor,node),
            }
        )
    }

function AlignButton({editor,align,children}:AlignButtonProps) {
    
  return (
    <Button type='button' onMouseDown={(event) => {
        event.preventDefault()
        handleAlignment({editor,align})
      }}>
        {children}
    </Button>
  )
}

export default AlignButton