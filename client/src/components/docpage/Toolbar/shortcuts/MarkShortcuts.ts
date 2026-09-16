import React from "react";
import { Editor } from "slate";
import { toggleMark } from "../MarkButton";

function MarkShortcuts(
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  mark: string,
  shortcut: string,
  requireShift = false
): boolean {
    // console.log("SHORTCUT EVENT:", event.key, event.ctrlKey);
  if (!event.ctrlKey || event.key.toLowerCase() !== shortcut || event.shiftKey !== requireShift) {
    return false;
  }

  event.preventDefault();
  toggleMark(editor,mark)
  return true
}

export default MarkShortcuts;
