import LanguageSwitcher from "../dashboard/LanguageSwitcher";
import logo from "../../assets/logo-icon.svg";
import Profile from "#components/shared/Profie";
import { Button } from "#components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  CloudAlert,
  CloudCheck,
  CloudOff,
  CloudUpload,
  EllipsisVertical,
  Lock,
  LockIcon,
  MessageSquare,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { getNepaliSuggestions } from "@/services/transliterator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "#components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/ui/select";
import type {
  DocumentMargins,
  DocumentOrientation,
  PageSizes,
} from "@/types/documentSetting";
import { Input } from "#components/ui/input";

interface DocumentHeaderProps {
  title?: string | undefined;
  onTitleChange?: (title: string) => void;
  savingState?: string;
  orientation: string;
  setOrientation: (orientation: DocumentOrientation) => void;
  pageSize: PageSizes;
  setPageSize: (size: PageSizes) => void;
  documetMargin: DocumentMargins;
  setDocumentMargin: (margin: DocumentMargins) => void;
}

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
  $: "$",
  "%": "%",
  "&": "&",
  "*": "*",
  _: "_",
  "<": "<",
  ">": ">",
  "|": "|",
  "~": "~",
  "`": "`",
  "\\": "\\",
};

function getMappedSuggestions(word: string): string[] {
  if (!word) return [];

  if (/^[0-9]+$/.test(word)) {
    return [
      Array.from(word, (char) => DEVANAGARI_DIGITS[char] ?? char).join(""),
    ];
  }

  if (/^[0-9\p{P}\p{S}]+$/u.test(word)) {
    return [
      Array.from(word, (char) => DEVANAGARI_SYMBOLS[char] ?? char).join(""),
    ];
  }

  return [];
}

function HeaderDocPage({
  title,
  onTitleChange,
  savingState,
  orientation,
  setOrientation,
  pageSize,
  setPageSize,
  documetMargin,
  setDocumentMargin,
}: DocumentHeaderProps) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const latestRequestId = useRef(0);
  const debounceTimer = useRef<number | null>(null);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [applyToAllMargins, setApplyToAllMargins] = useState(true);
  const [marginValue, setMarginValue] = useState(String(documetMargin?.top));

  const [topMargin, setTopMargin] = useState(
    documetMargin.top ? String(documetMargin.top) : "25",
  );
  const [rightMargin, setRightMargin] = useState(
    documetMargin.right ? String(documetMargin.right) : "25",
  );
  const [bottomMargin, setBottomMargin] = useState(
    documetMargin.bottom ? String(documetMargin.bottom) : "25",
  );
  const [leftMargin, setLeftMargin] = useState(
    documetMargin.left ? String(documetMargin.left) : "25",
  );
  // console.log(documetMargin.top);
  const closeSuggestions = useCallback(() => {
    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    latestRequestId.current += 1;
    setSuggestions([]);
    setActiveIndex(0);
  }, []);

  useEffect(()=>{
  setMarginValue(String(documetMargin?.top ?? 20))
  setTopMargin(String(documetMargin?.top ?? 20));
  setRightMargin(String(documetMargin?.right ?? 20));
  setBottomMargin(String(documetMargin?.bottom ?? 20));
  setLeftMargin(String(documetMargin?.left ?? 20));
  },[documetMargin])

  const getCurrentToken = useCallback((value: string, caret: number) => {
    const beforeCaret = value.slice(0, caret);
    const match = beforeCaret.match(/([^\s]+)$/);

    if (!match) {
      return { token: "", start: caret, end: caret };
    }

    const token = match[1];
    return {
      token,
      start: caret - token.length,
      end: caret,
    };
  }, []);

  const applySuggestion = useCallback(
    (suggestion: string, addSpaceAfter = false) => {
      const input = inputRef.current;
      if (!input || !title) return;

      const caret = input.selectionStart ?? title.length;
      const { start, end } = getCurrentToken(title, caret);
      const nextValue =
        title.slice(0, start) +
        suggestion +
        (addSpaceAfter ? " " : "") +
        title.slice(end);
      const nextCaret = start + suggestion.length + (addSpaceAfter ? 1 : 0);

      onTitleChange?.(nextValue);
      closeSuggestions();

      requestAnimationFrame(() => {
        input.focus();
        input.setSelectionRange(nextCaret, nextCaret);
      });
    },
    [closeSuggestions, getCurrentToken, onTitleChange, title],
  );

  const updateSuggestions = useCallback(
    (value: string, caret: number) => {
      const { token } = getCurrentToken(value, caret);

      if (!token) {
        closeSuggestions();
        return;
      }

      if (/^[\u0900-\u097F]+$/.test(token)) {
        closeSuggestions(); 
        return;
      }

      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }

      const requestId = ++latestRequestId.current;

      debounceTimer.current = window.setTimeout(() => {
        const mapped = getMappedSuggestions(token);
        if (requestId !== latestRequestId.current) return;

        if (mapped.length) {
          setSuggestions(mapped);
          setActiveIndex(0);
          return;
        }

        getNepaliSuggestions(token).then((suggestionList) => {
          if (requestId !== latestRequestId.current) return;
          setSuggestions(suggestionList || []);
          setActiveIndex(0);
        });
      }, 150);
    },
    [closeSuggestions, getCurrentToken],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = e.target.value;
      onTitleChange?.(nextValue);

      const caret = e.target.selectionStart ?? nextValue.length;
      updateSuggestions(nextValue, caret);
    },
    [onTitleChange, updateSuggestions],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!suggestions.length) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeSuggestions();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        const activeSuggestion = suggestions[activeIndex] ?? suggestions[0];
        if (activeSuggestion) {
          applySuggestion(activeSuggestion, true);
        }
      }
    },
    [activeIndex, applySuggestion, closeSuggestions, suggestions],
  );

  return (
    <header className="pt-6 pr-8 pb-3  border-neutral-three flex justify-between items-center w-full border-b-1">
      <div className="px-7 flex items-center gap-4">
        <Button
          size={"icon"}
          className="w-10 h-10 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="w-full h-full" />
        </Button>

        <div className="w-auto relative">
          <input
            ref={inputRef}
            value={title ?? ""}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onClick={(e) => {
              const caret =
                e.currentTarget.selectionStart ?? title?.length ?? 0;
              updateSuggestions(title ?? "", caret);
            }}
            onSelect={(e) => {
              const caret =
                e.currentTarget.selectionStart ?? title?.length ?? 0;
              updateSuggestions(title ?? "", caret);
            }}
            className="text-xl w-auto min-w-20 font-main font-medium text-black outline-none"
            size={Math.max((title ?? "").length, 1)}
            required={true}
          />

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 z-50 mt-2 max-w-40 rounded-lg border border-neutral-300 bg-white shadow-md overflow-hidden">
              {suggestions.map((word, index) => (
                <div
                  key={`${word}-${index}`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    applySuggestion(word);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`${index === activeIndex ? "bg-primary/20" : ""} cursor-pointer space-x-2 px-2 py-1`}
                >
                  <span className="font-main text-sm">{index + 1}.</span>
                  <span className="font-main text-sm">{word}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <Button
            variant={"ghost"}
            className="hover:bg-gray-100 group transition duration-300 rounded-full"
          >
            <LockIcon color={"#4B4B4B"} />
            <div className="group-hover:block hidden transition duration-300">
              Locked
            </div>
          </Button>
        </div>
        <div>
          <span className="text-neutral-500 flex items-center gap-2 flex-row-reverse">
            {savingState == "saving" ? (
              <CloudUpload size={20} />
            ) : savingState == "saved" ? (
              <CloudCheck size={20} />
            ) : savingState == "unsaved" ? (
              <CloudOff size={20} />
            ) : (
              <CloudAlert size={20} />
            )}
            {savingState}
          </span>
        </div>
      </div>

      <div className="flex items-center flex-row-reverse gap-8">
        <Profile />
        <div className="flex flex-row gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-neutral-50 rounded-md!">
              <DropdownMenuItem onSelect={() => setLayoutOpen(true)}>
                Layout Setting
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={layoutOpen} onOpenChange={setLayoutOpen}>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="font-primary text-primary">
                  Document Setting
                </DialogTitle>
                <DialogDescription>
                  Document Options for the project
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Choose Format</span>
                <Select defaultValue={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="A4">
                      A4
                      <span className="text-sm text-neutral-500">
                        (210mm*297mm)
                      </span>
                    </SelectItem>
                    <SelectItem value="A5">
                      A5
                      <span className="text-sm text-neutral-500">
                        (148mm*210mm)
                      </span>
                    </SelectItem>
                    <SelectItem value="A3">
                      A3
                      <span className="text-sm text-neutral-500">
                        (297mm*420mm)
                      </span>
                    </SelectItem>
                    <SelectItem value="LETTER">
                      Letter
                      <span className="text-sm text-neutral-500">
                        (216mm*279mm)
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Layout Option</span>
                <Select
                  defaultValue={orientation}
                  onValueChange={setOrientation}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Margins</span>
                  <label className="flex items-center gap-2 text-xs text-neutral-600">
                    <input
                      type="checkbox"
                      checked={applyToAllMargins}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setApplyToAllMargins(checked);
                        if (checked) {
                          setMarginValue(topMargin);
                          setTopMargin(topMargin);
                          setRightMargin(topMargin);
                          setBottomMargin(topMargin);
                          setLeftMargin(topMargin);
                        }
                      }}
                      className="h-4 w-4 accent-primary"
                    />
                    Apply to all inputs
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-500">Top</span>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        value={applyToAllMargins ? marginValue : topMargin}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setMarginValue(nextValue);
                          setTopMargin(nextValue);
                          if (applyToAllMargins) {
                            setRightMargin(nextValue);
                            setBottomMargin(nextValue);
                            setLeftMargin(nextValue);

                            setDocumentMargin({
                              top: Number(nextValue),
                              right: Number(nextValue),
                              bottom: Number(nextValue),
                              left: Number(nextValue),
                            });
                          } else {
                            setRightMargin(rightMargin);
                            setBottomMargin(bottomMargin);
                            setLeftMargin(leftMargin);

                            setDocumentMargin({
                              ...documetMargin,
                              top:Number(nextValue)
                            })
                          
                          }
                        }}
                        className="pr-9"
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-neutral-500">
                        mm
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-500">Right</span>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        value={applyToAllMargins ? marginValue : rightMargin}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setRightMargin(nextValue);
                          if (applyToAllMargins) {
                            setMarginValue(nextValue);
                            setTopMargin(nextValue);
                            setBottomMargin(nextValue);
                            setLeftMargin(nextValue);

                            setDocumentMargin({
                              top: Number(nextValue),
                              right: Number(nextValue),
                              bottom: Number(nextValue),
                              left: Number(nextValue),
                            });
                          }    else{
                            setDocumentMargin({
                              ...documetMargin,
                              right:Number(nextValue)
                            })
                          }
                        }}
                        className="pr-9"
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-neutral-500">
                        mm
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-500">Bottom</span>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        value={applyToAllMargins ? marginValue : bottomMargin}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setBottomMargin(nextValue);
                          if (applyToAllMargins) {
                            setMarginValue(nextValue);
                            setTopMargin(nextValue);
                            setRightMargin(nextValue);
                            setLeftMargin(nextValue);

                            setDocumentMargin({
                              top: Number(nextValue),
                              right: Number(nextValue),
                              bottom: Number(nextValue),
                              left: Number(nextValue),
                            });
                          }
                              else{
                            setDocumentMargin({
                              ...documetMargin,
                              bottom:Number(nextValue)
                            })
                          }
                        }}
                        className="pr-9"
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-neutral-500">
                        mm
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-500">Left</span>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        value={applyToAllMargins ? marginValue : leftMargin}
                        onChange={(e) => {
                          const nextValue = e.target.value;
                          setLeftMargin(nextValue);
                          if (applyToAllMargins) {
                            setMarginValue(nextValue);
                            setTopMargin(nextValue);
                            setRightMargin(nextValue);
                            setBottomMargin(nextValue);

                            setDocumentMargin({
                              top: Number(nextValue),
                              right: Number(nextValue),
                              bottom: Number(nextValue),
                              left: Number(nextValue),
                            });
                          }
                          else{
                            setDocumentMargin({
                              ...documetMargin,
                              left:Number(nextValue)
                            })
                          }
                        }}
                        className="pr-9"
                      />
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-neutral-500">
                        mm
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Preset</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Default", active: true },
                    { label: "Wide", active: false },
                    { label: "Custom", active: false },
                  ].map(({ label, active }) => (
                    <button
                      key={label}
                      type="button"
                      className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                        active
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-neutral-200 bg-white text-neutral-700"
                      }`}
                    >
                      {active ? (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                          ✓
                        </span>
                      ) : (
                        <span className="h-4 w-4 rounded-full border border-neutral-300" />
                      )}
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant={"default"}
            className="bg-primary text-white rounded-full"
          >
            <MessageSquare />
          </Button>
          <Button variant={"default"} className="bg-primary text-white">
            <Share2 />
            Share
          </Button>
        </div>
      </div>
    </header>
  );
}

export default HeaderDocPage;
