import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomText = {
    text:string,
    bold?:string,
    italic?:string,
    underline?:string,
    strikethrough?:string
}

type CustomElements = {
    type:'paragraph' | 'heading-one' | 'heading-two' | 'heading-three',
    children:CustomText[]
}

declare module 'slate'{
     interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElements
    Text: CustomText
  }
}
