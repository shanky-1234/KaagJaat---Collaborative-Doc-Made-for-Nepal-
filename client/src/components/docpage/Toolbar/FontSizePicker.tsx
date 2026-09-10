import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Editor, Element } from 'slate'
import { useSlate } from 'slate-react'

const HEADING_SIZES = {
  "heading-one": 48,
  "heading-two": 30,
  "heading-three": 20,
}

function FontSizePicker() {
  const editor = useSlate()
  const [size, setSize] = useState<number>(16)
  const [inputValue, setInputValue] = useState('16')

  const getCurrentBlockType = (editor: Editor)=>{

    if(!editor.selection){
      return undefined
    }

    const [match] = Editor.nodes(editor,{
      at:editor.selection,
        match:(node): node is Element => Element.isElement(node)
    })
    return match?.[0]?.type
  }

  const getCurrentFontSize = (editor: Editor): number => {
    const marks = Editor.marks(editor)

    if (typeof marks?.fontSize === 'number') {
      return marks.fontSize
    }

    const blockType = getCurrentBlockType(editor)
    if (blockType && blockType in HEADING_SIZES) {
      return HEADING_SIZES[blockType as keyof typeof HEADING_SIZES]
    }

    return 16
  }

  useEffect(() => {
    const currentSize = getCurrentFontSize(editor)
    setSize(currentSize)
    setInputValue(String(currentSize))
  }, [editor, editor.children, editor.selection])

  const applySize = (value: number) => {
    const nextSize = Math.min(200, Math.max(8, value))
    setSize(nextSize)
    setInputValue(String(nextSize))
    if (editor.selection) {
      Editor.addMark(editor, 'fontSize', nextSize)
    }
  }

  const handleFontSizeBlur = () => {
    const value = Number(inputValue)
    applySize(Number.isNaN(value) ? size : value)
  }

  const increaseSize = () => applySize(size + 1)
  const decreaseSize = () => applySize(size - 1)

  const preventFocusSteal = (e: React.MouseEvent) => e.preventDefault()

  return (
    <div>
        <div className='w-fit flex items-center'>
            <div>
                <Button type='button' onMouseDown={preventFocusSteal} onClick={decreaseSize}><MinusIcon size={12} /></Button>
            </div>
            <div className='w-fit border border-neutral-400 rounded-xl '>
                <Input value={inputValue} type='number' className='border-0 w-fit no-spinners px-0 text-center ' onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
            }} min={8} max={200} onChange={(e) => setInputValue(e.target.value)} onBlur={handleFontSizeBlur}/>
            </div>  
            <div>
                <Button type='button' onMouseDown={preventFocusSteal} onClick={increaseSize}><PlusIcon size={12} /></Button>
            </div>
        </div>
    </div>
  )
}

export default FontSizePicker