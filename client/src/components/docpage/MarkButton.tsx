import Button from "#components/shared/Button";
import type { CustomElements } from "@/types/slate";
import React, { useCallback } from "react";
import { Editor, Transforms,Element } from "slate";
import { useSlate } from "slate-react";

type MarkButtonType = {
    mark: string;
    children: React.ReactNode;
    className?: string;
    onMouseDown?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
};

function MarkButton({
    mark,
    children,
    className,
    onMouseDown,
    ...props
}: MarkButtonType) {
    const editor = useSlate();

    const isActive =
        (Editor.marks(editor) as Record<string, boolean>)?.[mark] === true;
    const toggleMark = (editor: Editor, mark: string): void => {
        const isActive =
            (Editor.marks(editor) as Record<string, any>)?.[mark] === true;
        isActive
            ? Editor.removeMark(editor, mark)
            : Editor.addMark(editor, mark, true);
    };

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
