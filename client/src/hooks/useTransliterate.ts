import { getNepaliSuggestions } from "@/services/transliterator";
import { getCurrentWord } from "@/utils/transliterate/getCurrentWord";
import { useCallback, useRef, useState } from "react";
import { Editor, Transforms, type BaseEditor, type Descendant } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";

type TranslitEditor = Editor & BaseEditor & ReactEditor & HistoryEditor;

const DEVANAGARI_DIGITS: Record<string, string> = {
  "0": "०",
  "1": "१",
  "2": "२",
  "3": "३",
  "4": "४",
  "5": "५",
  "6": "६",
  "7": "७",
  "8": "८",
  "9": "९",
};

const DEVANAGARI_SYMBOLS: Record<string, string> = {
  ".": "।",
  ",": ",",
  ":": ":",
  ";": ";",
  "?": "?",
  "!": "!",
  "+": "+",
  "-": "-",
  "/": "/",
  "=": "=",
  "(": "(",
  ")": ")",
  "[": "[",
  "]": "]",
  "{": "{",
  "}": "}",
  "@": "@",
  "#": "#",
  "$": "$",
  "%": "%",
  "&": "&",
  "*": "*",
  "_": "_",
  "<": "<",
  ">": ">",
  "|": "|",
  "~": "~",
  "`": "`",
  "\\": "\\",
};

function getMappedSuggestions(word: string): string[] {
  if (!word) {
    return [];
  }

  if (/^[0-9]+$/.test(word)) {
    return [Array.from(word, (char) => DEVANAGARI_DIGITS[char] ?? char).join("")];
  }

  if (/^[0-9\p{P}\p{S}]+$/u.test(word)) {
    return [
      Array.from(word, (char) => DEVANAGARI_SYMBOLS[char] ?? char).join(""),
    ];
  }

  return [];
}

export function useTransliterate(editor: TranslitEditor) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const debounceTimer = useRef<number | null>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!suggestions.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        const activeSuggestion = suggestions[activeIndex] ?? suggestions[0];
        if (activeSuggestion) {
          selectSuggestion(activeSuggestion, true);
        }
      }
    },
    [activeIndex, suggestions]
  );

  const handleChange = useCallback(
    (_value: Descendant[]) => {
      const result = getCurrentWord(editor);

      if (!result) {
        setSuggestions([]);
        setActiveIndex(0);
        return;
      }

      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = window.setTimeout(async () => {
        const mappedSuggestions = getMappedSuggestions(result.word);

        if (mappedSuggestions.length) {
          setSuggestions(mappedSuggestions);
          setActiveIndex(0);
          return;
        }

        const suggestion = await getNepaliSuggestions(result.word);
        setSuggestions(suggestion);
        setActiveIndex(0);
      }, 150);
    },
    [editor]
  );

  const selectSuggestion = useCallback(
    (suggestion: string, addSpaceAfter = false) => {
      const result = getCurrentWord(editor);
      if (!editor.selection || !result) {
        return;
      }

      const { path, wordStart, wordEnd } = result;

      Transforms.select(editor, {
        anchor: { path, offset: wordStart },
        focus: { path, offset: wordEnd },
      });

      Transforms.insertText(editor, suggestion);

      if (addSpaceAfter) {
        Transforms.insertText(editor, " ");
      }

      setSuggestions([]);
      setActiveIndex(0);
    },
    [editor]
  );

  return {
    suggestions,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    handleChange,
    selectSuggestion,
  };
}