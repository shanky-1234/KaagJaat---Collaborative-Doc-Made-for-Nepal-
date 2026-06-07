import React, { useCallback, useMemo, useState } from 'react'
import { createEditor, type Descendant,Editor  } from 'slate'
import { Slate, Editable, withReact, type RenderLeafProps, type RenderElementProps,  } from 'slate-react'
import {withHistory} from 'slate-history'
import Button from '#components/shared/Button'
import Toolbar from '#components/docpage/Toolbar'

function DocPage() {
    const initialValue = useMemo<Descendant[]>(()=>[
         {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
    ],[]) 
    const [editor] = useState(()=>withHistory(withReact(createEditor())))
    const [key,setKey] = useState<string>('')
    const [content,setContent] = useState<Descendant[]>(initialValue)

    const storeDoc = (value:Descendant[]):void=>{
        setContent(value)
    }

    const renderElement = useCallback((props:RenderElementProps)=>{
        switch(props.element.type){
            case 'heading-one' : 
                return <h1 {...props.attributes} className='text-5xl'>{props.children}</h1>
            case 'heading-two':
                return <h2 {...props.attributes} className='text-3xl'>{props.children}</h2>
          case 'heading-three':
                return <h3 className='text-xl' {...props.attributes}>{props.children}</h3>
            default:
                return <p {...props.attributes}>{props.children}</p>
}},[])


 
    const renderLeaf = useCallback((props:RenderLeafProps)=>{
        let {children} = props

    if (props.leaf.bold) children = <strong>{children}</strong>
    if (props.leaf.italic) children = <em>{children}</em>
    if (props.leaf.underline)     children = <u>{children}</u>
    if (props.leaf.strikethrough) children = <s>{children}</s>

        return <span {...props.attributes}>{children}</span>
    },[])
  return (
    <div className=' mx-auto rounded-xl h-full mt-8  border-neutral-300 w-[90%] md:w-1/2'> {/*Dynamic Margin, paddings*/}
        <section>
            <h4 className='text-2xl font-secondary font-medium text-primary'>My Document</h4>
        </section>
        <Slate editor={editor} initialValue={initialValue} onChange={storeDoc}>
           <Toolbar editor={editor}/>
            <div className='border-2 border-neutral-200 p-4 w-full h-[842px] max-h-[842px] rounded-xl mt-4'>
            <Editable renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={(event)=>setKey(event.key)} placeholder='Start Wirting' className='w-full focus:outline-0'/>
            </div>
            </Slate>
    </div>
  )
}

export default DocPage