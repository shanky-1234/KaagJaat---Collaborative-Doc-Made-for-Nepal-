import { useCallback } from "react";
import type { Editor } from "slate";
import MarkShortcuts  from "./MarkShortcuts";

const MARK_SHORTCUTS = {
   bold: { key: "b", shift: false },
  italic: { key: "i", shift: false },
  underline: { key: "u", shift: false },
  strikethrough: { key: "x", shift: true },
} as const;

export function useMarkShortcuts(editor: Editor) {
  return useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      for (const [mark, shortcut] of Object.entries(MARK_SHORTCUTS)) {
        if (MarkShortcuts(event, editor, mark, shortcut.key,shortcut.shift)) {
          return true;
        }
      }

      return false;
    },
    [editor]
  );
}