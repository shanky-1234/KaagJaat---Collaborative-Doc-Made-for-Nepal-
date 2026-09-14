import { useCallback } from "react";
import type { Editor } from "slate";
import AlignShortcuts from "./AlignmentShortcuts";

const MARK_SHORTCUTS = {
   left: { key: "l", shift: true },
  right: { key: "r", shift: true },
  center: { key: "e", shift: true },
  justify: { key: "j", shift: true },
} as const;

export function useAlignmentShortcuts(editor: Editor) {
  return useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      for (const [align, shortcut] of Object.entries(MARK_SHORTCUTS)) {
        if (AlignShortcuts(event, editor, align as 'left' | 'right' | 'center' | 'justify', shortcut.key,shortcut.shift)) {
          return true;
        }
      }

      return false;
    },
    [editor]
  );
}