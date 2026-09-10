import { Editor, Range, Text } from "slate";

export function getCurrentWord(editor: Editor) {
  const { selection } = editor;

  if (!selection || !Range.isCollapsed(selection)) {
    return null;
  }

  const [textEntry] = Editor.nodes(editor, {
    at: selection,
    match: (node) => {
      return (
        !Editor.isEditor(node) &&
        typeof node === "object" &&
        "text" in node &&
        typeof node.text === "string"
      );
    },
  });

  if (!textEntry) {
    return null;
  }

  const [textNode, path] = textEntry;

  if (!Text.isText(textNode)) {
    return null;
  }

  const text = textNode.text;

  const cursorOffset = selection.anchor.offset;

  // Text before the cursor
  const textBeforeCursor = text.slice(0, cursorOffset);

  // Get the characters after the last space
  const match = textBeforeCursor.match(/([^\s]+)$/);

  if (!match) {
    return null;
  }

  const word = match[1];

  return {
    word,
    textNode,
    path,
    wordStart: cursorOffset - word.length,
    wordEnd: cursorOffset,
  };
}