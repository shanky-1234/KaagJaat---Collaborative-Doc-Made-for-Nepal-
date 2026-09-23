import { Editor, Element, Transforms } from "slate";

interface ToggleListProps {
    editor:Editor 
    listType:'bulleted-list' | 'numbered-list'
    listStyle?:"disc" | "square" | "circle" | "none" | "numbered"
}

export const toggleList = ({editor,listType,listStyle}:ToggleListProps)=>{
    if (listStyle === "none" as any){
        Transforms.unwrapNodes(editor,
            {
                 match: (node) =>
        Element.isElement(node) &&
        (node.type === "bulleted-list" ||
          node.type === "numbered-list"),
      split: true,
            }
        )

        Transforms.setNodes(editor,{
            type:'paragraph'},
            {
                match:(node)=> Element.isElement(node) && node.type === "list-item"
            }
        )
        return
    }

    const nextListStyle = listStyle ?? (listType === 'numbered-list' ? 'numbered' : 'disc');

    const [existingList] = Editor.nodes(editor,{
        match:(node) =>{
             return Element.isElement(node) &&
            (node.type === 'bulleted-list' || node.type === 'numbered-list')
        }
    })

     if (existingList) {
    const [, listPath] = existingList;

    Transforms.setNodes(
    editor,
    {
      type: listType,
      listStyle: nextListStyle,
    },
    {
      at: listPath,
    }
  );

    return;
  }

    Transforms.setNodes(
        editor,
        {type:'list-item'},
        {
            match:(node)=>{
               return Element.isElement(node) && node?.type === 'paragraph'
            }
        })

    Transforms.wrapNodes(editor,
        {type:listType,
            listStyle: nextListStyle,
            children:[]
        },
        {match:(node)=>{
            return Element.isElement(node) && node?.type === 'list-item'
        }}
    )
}