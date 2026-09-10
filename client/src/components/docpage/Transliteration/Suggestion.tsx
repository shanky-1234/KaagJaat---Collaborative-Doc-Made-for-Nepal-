import React from "react";

interface SuggestionProp {
  words: string[];
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  onSelect: (word: string) => void;
}

function Suggestion({
  words,
  activeIndex,
  setActiveIndex,
  onSelect,
}: SuggestionProp) {
  return (
    <div className="max-w-32 rounded-lg border border-neutral-300 shadow-md overflow-hidden">
      <div className="space-y-1 mb-2">
        {words.map((word, index) => (
          <div
            key={index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseDown={(event)=>{event.preventDefault()
              onSelect(word)
            }}
            className={`${index == activeIndex ? "bg-primary/20" : ""} cursor-pointer space-x-2 px-2`}
          >
            <span className="font-main text-sm">{index + 1}.</span>
            <span className="font-main text-sm">{word}</span>
          </div>
        ))}
      </div>
      <div className="border-t-1 border-t-neutral-200">
        <div className="text-xs">
          <span className="p-1 border-neutral-100 bg-neutral-100">ESC</span>
          <span>to escape</span>
        </div>
      </div>
    </div>
  );
}

export default Suggestion;
