import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#components/ui/select'
import React from 'react'
import { Editor, Element, Transforms } from 'slate'
import { useSlate } from 'slate-react'

const activeTextStyle = [
    {
        label:"Paragraph",
        value:"paragraph"
    },{
        label:"Heading 1",
        value:"heading-one"
    },{
        label:"Heading 2",
        value:"heading-two"
    },{
        label:"Heading 3",
        value:"heading-three"
    },{
        label:"Normal Text",
        value:"text"
    }
    ] as const

type TextStyle = (typeof activeTextStyle)[number]['value']

function TextStylePicker() {
    const editor = useSlate()

    const [activeStyle] = Editor.nodes(editor,{
        match: (node) => 
            Element.isElement(node) && Editor.isBlock(editor,node)
    })

    const activeType = activeStyle && Element.isElement(activeStyle[0]) ? 
    activeStyle[0].type : 'text'
  
    const handleStyleChange = (type:TextStyle)=>{
        Editor.removeMark(editor,"fontSize")

        Transforms.setNodes(editor,{type,},{
            match: (node)=>{
                return Element.isElement(node) && Editor.isBlock(editor,node)
            }
        })
    }

    const activeLabel = activeTextStyle.find((style) => style.value === activeType)?.label ??
    "Normal Text"
  return (
    <Select value={activeType} onValueChange={handleStyleChange}>
         <SelectTrigger
  className="
    w-full min-w-24 max-w-28
    border
    border-neutral-400
    focus:border-neutral-400!
    focus-visible:border-neutral-400!
    focus-visible:ring-0
    data-[state=open]:border-neutral-400!
  "
>
                <SelectValue>
                    {activeLabel}
                </SelectValue>
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
        "
      >
        {activeTextStyle.map((style) => (
          <SelectItem
            key={style.value}
            value={style.value}
          >
            {style.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default TextStylePicker