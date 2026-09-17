import { Transforms, type Editor } from "slate";

export const insertPageBreak = (editor:Editor) =>{
    Transforms.insertNodes(editor,{
        type:'page-break',
        children:[{text:''}]
    } as any)
    Transforms.move(editor)
}