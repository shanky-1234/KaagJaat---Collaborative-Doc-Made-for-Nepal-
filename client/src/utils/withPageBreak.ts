import { Editor, Node, Path, Transforms, Element as SlateElement, Element, Range } from "slate";

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

  const { deleteBackward } = editor;

editor.deleteBackward = (unit) => {
  const { selection } = editor;

  if (!selection || !Range.isCollapsed(selection)) {
    deleteBackward(unit);
    return;
  }

  const [listItemEntry] = Editor.nodes(editor, {
    match: (node) =>
      Element.isElement(node) && node.type === "list-item",
  });

  if (listItemEntry) {
    const [, listItemPath] = listItemEntry;

    const text = Editor.string(editor, listItemPath);

    if (text === "") {
      Transforms.setNodes(
        editor,
        { type: "paragraph" },
        { at: listItemPath }
      );

      Transforms.unwrapNodes(editor, {
        at: listItemPath,
        match: (node) =>
          Element.isElement(node) &&
          (node.type === "bulleted-list" || node.type === "numbered-list"),
        split: true,
      });

      return;
    }
  }

  deleteBackward(unit);
};

  return editor;
}