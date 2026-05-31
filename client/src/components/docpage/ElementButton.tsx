import Button from "#components/shared/Button";
import type { CustomElements } from "@/types/slate";
import React, { useCallback } from "react";
import { Editor, Transforms,Element } from "slate";
import { useSlate } from "slate-react";

type ElementButtonType = {
    type: string;
    children?: React.ReactNode;
    className?: string;
    onMouseDown?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
};

function ElementButton({
    type,
    children,
    className,
    onMouseDown,
    ...props
}: ElementButtonType) {
    const editor = useSlate();
    const isElementActive = (editor:Editor,type:string):boolean=>{
        const [match] = Editor.nodes(editor,{
            match:n=>Element.isElement(n) && n.type === type,
        })
        return !!match
    }
   
        const isActive = isElementActive(editor,type)
        const toggleElement = (editor:Editor,type:string) =>{
            Transforms.setNodes(editor,
            {type:isActive ? 'paragraph' : type } as Partial<CustomElements>,
            {match: n=>Element.isElement(n) && Editor.isBlock(editor,n)}
        )
        }
        
    

    return (
        <Button
            className={`${className} ${isActive && "bg-primary text-white"}`}
            {...props}
            onMouseDown={(e:any)=>{
                e.preventDefault()
                toggleElement(editor,type)
            }}
        >
            {children}
        </Button>
    );
}

export default ElementButton;
