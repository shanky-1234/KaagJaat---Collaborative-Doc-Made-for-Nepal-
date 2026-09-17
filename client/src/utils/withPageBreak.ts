import { Editor, Node, Path, Transforms, Element as SlateElement } from "slate";

export const withPageBreak = (editor:Editor) =>{
    const {isVoid, normalizeNode} = editor
    editor.isVoid = (element)=>{
        return (element as any).type === "page-break" || isVoid(element)
    }

    editor.normalizeNode = (entry) =>{
        const [, path] = entry

       if (path.length === 0) {
      for (const [child, childPath] of Node.children(editor, path)) {
        const isPageBreak =
          SlateElement.isElement(child) && (child as any).type === "page-break";

        if (isPageBreak) {
          const nextPath = Path.next(childPath);
          const hasNext = Editor.hasPath(editor, nextPath);
          const nextNode = hasNext ? Node.get(editor, nextPath) : null;
          const nextIsMissingOrVoid =
            !hasNext ||
            (SlateElement.isElement(nextNode) && (nextNode as any).type === "page-break");

          if (nextIsMissingOrVoid) {
            Transforms.insertNodes(
              editor,
              { type: "paragraph", children: [{ text: "" }] } as any,
              { at: nextPath }
            );
            return; // re-run normalization from scratch after this fix
          }
        }
      }
    }

    normalizeNode(entry);
  };

  return editor;
}