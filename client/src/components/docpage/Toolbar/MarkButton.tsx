import Button from "#components/shared/Button";
import React from "react";
import { Editor,} from "slate";
import { useSlate } from "slate-react";

type MarkButtonType = {
    mark: string;
    children: React.ReactNode;
    className?: string;
    shortcut?:string
    onMouseDown?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
};

export const toggleMark = (editor: Editor, mark: string): void => {
        const isActive =
            (Editor.marks(editor) as Record<string, any>)?.[mark] === true;
        isActive
            ? Editor.removeMark(editor, mark)
            : Editor.addMark(editor, mark, true);
    }; 

function MarkButton({
    mark,
    children,
    className,
    shortcut,
    onMouseDown,
    ...props
}: MarkButtonType) {
    const editor = useSlate();

    const isActive = (Editor.marks(editor) as Record<string, boolean>)?.[mark] === true;

    

    const handleToggle = (e: any): void => {
        e.preventDefault();
        toggleMark(editor, mark);
    };

    

    return (
        <Button
            className={`${className} ${isActive && "bg-primary text-white"}`}
            {...props}
            onMouseDown={handleToggle}
        >
            {children}
        </Button>
    );
}

export default MarkButton;
