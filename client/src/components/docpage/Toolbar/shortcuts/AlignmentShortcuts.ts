import React from "react";
import { Editor } from "slate";
import { handleAlignment } from "../AlignButton";

function AlignShortcuts(
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  align: 'left' | 'center' | 'right' | 'justify',
  shortcut: string,
  requireShift = false
): boolean {
    console.log("SHORTCUT EVENT:", event.key, event.ctrlKey);
  if (!event.ctrlKey || event.key.toLowerCase() !== shortcut || event.shiftKey !== requireShift) {
    return false;
  }

  event.preventDefault();
  handleAlignment({editor,align})
  return true
}

export default AlignShortcuts;
