import type { Editor } from "slate"

export const withImages = (editor: Editor) => {
    const { isVoid } = editor

    editor.isVoid = (element) => {
        return element.type === 'image' ? true : isVoid(element)
    }

    return editor
}