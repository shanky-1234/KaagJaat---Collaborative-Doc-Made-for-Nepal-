import { Button } from '#components/ui/button';
import { Redo, Undo } from 'lucide-react';
import React, { useState } from 'react'
import { History, HistoryEditor, withHistory } from 'slate-history'



function UndoRedoButton({editor}:{editor:HistoryEditor}) {
  const undoTask = (e:React.MouseEvent | React.KeyboardEvent)=>{
    e.preventDefault()
    HistoryEditor.undo(editor)
  }
   const redoTask = (e:React.MouseEvent | React.KeyboardEvent)=>{
    e.preventDefault()
    HistoryEditor.redo(editor)
  }
  return (
    <div className='flex'>
        <Button className='cursor-pointer' onMouseDown={undoTask}>
            <Undo/>
        </Button>
        <Button className='cursor-pointer' onMouseDown={redoTask}>
            <Redo/>
        </Button>
    </div>
  )
}

export default UndoRedoButton