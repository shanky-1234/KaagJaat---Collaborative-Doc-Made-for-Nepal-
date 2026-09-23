import { Editor, Element } from "slate";

export const getCurrentListStyle = (editor: Editor) => {
  const [listEntry] = Editor.nodes(editor, {
    match: (node) =>
      Element.isElement(node) &&
      (node.type === "bulleted-list" ||
        node.type === "numbered-list"),
  });

  if (!listEntry) {
    return "none";
  }

  const [list] = listEntry;

  if (Element.isElement(list) && list.type === 'numbered-list'){
    return 'numbered'
  }

  return (list as Element & { listStyle?: string }).listStyle ?? "disc";
};