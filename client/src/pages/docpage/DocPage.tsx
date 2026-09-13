import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createEditor, type Descendant, Editor, string } from "slate";
import {
  Slate,
  Editable,
  withReact,
  type RenderLeafProps,
  type RenderElementProps,
  ReactEditor,
} from "slate-react";
import { withHistory } from "slate-history";
import Toolbar from "#components/docpage/Toolbar/Toolbar";
import { useNavigate, useParams } from "react-router";
import DocumentHeader from "#components/docpage/DocumentHeader";
import useDocument from "#hooks/useDocument";
import Element from "#components/docpage/Element";
import Leaf from "#components/docpage/Leaf";
import HeaderDocPage from "#components/docpage/HeaderDoc";

import { useTransliterate } from "#hooks/useTransliterate";
import Suggestion from "#components/docpage/Transliteration/Suggestion";

function DocPage() {
  const [activeFont, setActiveFont] = useState<string>("Mukta");
  const [fontSize, setFontSize] = useState<number>(16);
  const [savingState,setSavingState] = useState<"saved" | "saving" | "unsaved" | "error" >("saved")
  const [suggestionPosition, setSuggestionPosition] = useState({
    top: 0,
    left: 0,
  });

  const { id } = useParams();
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const { title, setTitle, loading, content, setContent, updateDocument } =
    useDocument({id,setSavingState});
  const {
    suggestions,
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    handleChange,
    selectSuggestion
  } = useTransliterate(editor);

  const saveTimer = useRef<ReturnType<typeof setTimeout>| null>(null)
  useEffect(() => {

    

    if (!suggestions.length || !editor.selection) {
      return;
    }
    const selection = editor.selection;
    const updatePosition = () => {
      try {
        const domRange = ReactEditor.toDOMRange(editor, selection);

        const rect = domRange.getBoundingClientRect();
        setSuggestionPosition({
          top: rect.bottom,
          left: rect.left,
        });
      } catch (error) {
        console.log("Could not get suggestion position", error);
      }
    };
    requestAnimationFrame(updatePosition);
    if (saveTimer.current){
      clearTimeout(saveTimer.current)
    }
  }, [suggestions, editor]);

  const storeDoc = (value: Descendant[]): void => {
    setContent(value);
    setSavingState("unsaved")
    if (saveTimer.current){
      clearTimeout(saveTimer.current)
    }

    saveTimer.current = setTimeout(()=>{
    
      updateDocument(title,value)
    },1500)
    const marks = Editor.marks(editor);
    console.log("UNDO STACK:", editor.history.undos.length);
    console.log("REDO STACK:", editor.history.redos.length);

    setActiveFont(marks?.fontFamily as string) ?? "Mukta";

    setFontSize(marks?.fontSize as number) ?? 16;
  };

  const handleTitleChange = (value:string) =>{
    setTitle(value)
    setSavingState("unsaved")

     if (saveTimer.current){
      clearTimeout(saveTimer.current)
    }

    saveTimer.current = setTimeout(()=>{
    
      updateDocument(title)
    },1500)

  }

  const renderElement = useCallback((props: RenderElementProps) => {
    return <Element {...props} />;
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return (
    <>
      <HeaderDocPage title={title} onTitleChange={handleTitleChange} savingState={savingState}/>
      <main className=" mx-auto rounded-xl w-full h-full mt-8  border-neutral-300 w-[90%] md:w-1/2">
        {" "}
        {/*Dynamic Margin, paddings*/}
        {/* <DocumentHeader
          title={title}
          onTitleChange={setTitle}
          updateDocument={updateDocument}
        /> */}
        {loading ? (
          <div>loading...</div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <Slate
              key={id}
              editor={editor}
              initialValue={content}
              onChange={(value) => {
                storeDoc(value);
                handleChange(value);
              }}
            >
              <Toolbar editor={editor} />
              <div className="border-2 border-neutral-200 p-4 w-full h-[842px] max-h-[842px] rounded-xl mt-4">
                <div className="relative">
                  <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Start Wirting"
                    className="w-full focus:outline-0"
                    onKeyDown={handleKeyDown}
                  />
                  {suggestions.length != 0 && (
                    <div className="fixed z-999"
                    style={{
                      top:suggestionPosition.top,
                      left:suggestionPosition.left
                    }}>
                      <Suggestion
                        words={suggestions}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                        onSelect={selectSuggestion}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Slate>
          </div>
        )}
      </main>
    </>
  );
}

export default DocPage;
