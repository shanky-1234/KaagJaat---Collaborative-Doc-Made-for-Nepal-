import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomText = {
    text:string,
    bold?:string,
    italic?:string,
    underline?:string,
    strikethrough?:string,
    color?:string,
    highlights?:string,
    fontSize?:number,
    fontFamily?:string,
    lineHeight?:number
}

type CustomElements = {
    type:'paragraph' | 'heading-one' | 'heading-two' | 'heading-three' | 'text',
    align?:'left' | 'right' | 'center' | 'justify',
    lineHeight?: number,
    children:CustomText[]
}

declare module 'slate'{
     interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElements
    Text: CustomText
  }
}
