  import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from "react";
  import {
    createEditor,
    type Descendant,
    type BaseEditor,
    Element as SlateElement,
    Editor,
    string,
    Transforms,
  } from "slate";
  import {
    Slate,
    Editable,
    withReact,
    type RenderLeafProps,
    type RenderElementProps,
    ReactEditor,
  } from "slate-react";
  import { withHistory, type HistoryEditor } from "slate-history";
  import Toolbar from "#components/docpage/Toolbar/Toolbar";
  import { useNavigate, useParams } from "react-router";
  import DocumentHeader from "#components/docpage/DocumentHeader";
  import useDocument from "#hooks/useDocument";
  import Element from "#components/docpage/Element";
  import Leaf from "#components/docpage/Leaf";
  import HeaderDocPage from "#components/docpage/HeaderDoc";

  import { useTransliterate } from "#hooks/useTransliterate";
  import Suggestion from "#components/docpage/Transliteration/Suggestion";
  import { useMarkShortcuts } from "@/components/docpage/Toolbar/shortcuts/useMarkShortcuts";
  import { useAlignmentShortcuts } from "@/components/docpage/Toolbar/shortcuts/useAlignmentShortcuts";
  import { PAGE_SIZES } from "@/config/pageSizes";
  import type { DocumentOrientation } from "@/types/documentSetting";
  import DocumentPage from "#components/docpage/DocumentPage";
import { withPageBreak } from "@/utils/withPageBreak";
import { insertPageBreak } from "@/utils/pageBreak";

  function DocPage() {
    const [pageCount, setPageCount] = useState<number>(1);
    /* where the editor has to sit so it lines up with the first page's padding */
    const [editorBox, setEditorBox] = useState({ top: 0, left: 0, width: 0 });
    const pageRef = useRef<HTMLDivElement | null>(null);
    const editorWrapRef = useRef<HTMLDivElement | null>(null);
    const verticalNavigationX = useRef<number | null>(null)

    const [activeFont, setActiveFont] = useState<string>("Mukta");
    const [fontSize, setFontSize] = useState<number>(16);
    const [savingState, setSavingState] = useState<
      "saved" | "saving" | "unsaved" | "error"
    >("saved");
    const [suggestionPosition, setSuggestionPosition] = useState({
      top: 0,
      left: 0,
    });
    const { id } = useParams();
    const [editor] = useState<BaseEditor & ReactEditor & HistoryEditor>(() =>
      withPageBreak(withHistory(withReact(createEditor()))) as BaseEditor &
        ReactEditor &
        HistoryEditor
    );
    const {
      title,
      setTitle,
      loading,
      content,
      setContent,
      updateDocument,
      orientation,
      setOrientation,
      pageSize,
      setPageSize,
      documentMargin,
      setDocumentMargin,
      settingsLoaded,
      setSettingsLoaded,
    } = useDocument({ id, setSavingState });

    const page = PAGE_SIZES[pageSize];
    const orientations = orientation as DocumentOrientation;
    const pageWidth = orientations === "portrait" ? page.width : page.height;

    const pageHeight = orientations === "portrait" ? page.height : page.width;
    const pageHeightpx = orientations === "portrait" ? page.height : page.width;

    const storeSettings = () => {
      const settings = {
        pageSize,
        orientation,
        margin: documentMargin,
      };
      updateDocument(title, content, settings);
    };

    //Handling Page Content and Auto New Page

    /*
      One single Slate editor is laid on top of a stack of page sheets.
      A block that would cross the bottom of its page gets a top margin
      big enough to push it down to the top of the next sheet.
    */
    const paginateContent = () => {
      const sheet = pageRef.current;
      const editable = editorWrapRef.current?.querySelector<HTMLElement>(
        '[data-slate-editor="true"]'
      );
      if (!sheet || !editable) return;

      /* read the real page paddings (the document margins) from the DOM */
      const styles = window.getComputedStyle(sheet);
      const paddingTop = parseFloat(styles.paddingTop) || 0;
      const paddingBottom = parseFloat(styles.paddingBottom) || 0;
      const paddingLeft = parseFloat(styles.paddingLeft) || 0;
      const paddingRight = parseFloat(styles.paddingRight) || 0;
      const sheetGap = parseFloat(styles.marginTop) || 0;

      const usableHeight = sheet.clientHeight - paddingTop - paddingBottom;
      /* distance from one page's content top to the next page's content top */
      const step = sheet.offsetHeight + sheetGap;
      if (usableHeight <= 0) return;

      setEditorBox({
        top: sheet.offsetTop + paddingTop,
        left: sheet.offsetLeft + paddingLeft,
        width: sheet.clientWidth - paddingLeft - paddingRight,
      });

      const blocks = Array.from(editable.children) as HTMLElement[];

      let currentPage = 0;
      let y = 0; // vertical position inside the continuous flow

      blocks.forEach((block) => {
        block.style.marginTop = "0px";

        const isPageBreak = block.dataset.type === "page-break"
         const height = isPageBreak ? 0 : block.offsetHeight;

        const pageStart = currentPage * step;
        const pageEnd = pageStart + usableHeight;

        if (isPageBreak){
          const nextPage = currentPage + 1
          block.style.marginTop = `${nextPage * step -y}px`
          y = nextPage * step
          currentPage = nextPage
          return
        }

        const doesNotFit = y + height > pageEnd;
        const isFirstBlockOfPage = y <= pageStart;

        if (doesNotFit && !isFirstBlockOfPage) {
          let nextPage = currentPage + 1;
          while (nextPage * step < y) nextPage++;

          block.style.marginTop = `${nextPage * step - y}px`;
          y = nextPage * step;
          currentPage = nextPage;
        }

        y += height;
      });

      /* a block taller than a whole page can still spill over */
      const lastPageEnd = currentPage * step + usableHeight;
      const extraPages = y > lastPageEnd ? Math.ceil((y - lastPageEnd) / step) : 0;

      setPageCount(currentPage + 1 + extraPages);
    };

    useEffect(() => {
      /* first pass positions/sizes the editor, second pass measures with that size */
      const frame = requestAnimationFrame(() => {
        paginateContent();
        requestAnimationFrame(paginateContent);
      });
      return () => cancelAnimationFrame(frame);
    }, [content, pageSize, orientation, documentMargin]);

    useEffect(() => {
      if (!settingsLoaded) return;

      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }

      saveTimer.current = setTimeout(() => {
        storeSettings();
      }, 1500);

      return () => {
        if (saveTimer.current) {
          clearTimeout(saveTimer.current);
        }
      };
    }, [settingsLoaded, pageSize, orientation, documentMargin]);

    const {
      suggestions,
      activeIndex,
      setActiveIndex,
      handleKeyDown,
      handleChange,
      selectSuggestion,
    } = useTransliterate(editor);

    const handleKeyShortcuts = useMarkShortcuts(editor);
    const handleAlignmentShortcut = useAlignmentShortcuts(editor);

    const handleCaretReact = () =>{
      if(!editor.selection) return null

      try {
        const domRange = ReactEditor.toDOMRange(
          editor,
          editor.selection
        )

        const rect = domRange.getBoundingClientRect()

        return{
          left:rect.left,
          top:rect.top,
          bottom:rect.bottom,
          height:rect.height
        }
      } catch (error) {
        console.log("Could not get caret position:", error);
    return null;

      }
    }

    const getSlatePointFromMouse = (
  event: React.MouseEvent<HTMLDivElement>
) => {
  const { clientX, clientY } = event;

  // Modern browser API
  if ("caretPositionFromPoint" in document) {
    const position = document.caretPositionFromPoint(
      clientX,
      clientY
    );

    if (!position) return null;

    const node = position.offsetNode;
    const offset = position.offset;

    if (!(node instanceof Text)) {
      return null;
    }

    try {
      return ReactEditor.toSlatePoint(
        editor,
        [node, offset],
        {
          exactMatch: false,
          suppressThrow: true,
        }
      );
    } catch {
      return null;
    }
  }

  return null;
};

const handleDocumentMouseDown = (
  event: React.MouseEvent<HTMLDivElement>
) => {
  const target = event.target as HTMLElement;

  // Let Slate handle normal text clicks.
  if (
    target.closest('[data-slate-node="element"]') ||
    target.closest('[data-slate-node="text"]')
  ) {
    return;
  }

  const page = target.closest("[data-document-page]");

  if (!page) return;

  event.preventDefault();

  const point = getSlatePointFromMouse(event);

  if (point) {
    Transforms.select(editor, {
      anchor: point,
      focus: point,
    });

    ReactEditor.focus(editor);
    return;
  }

  /*
   * No text exists exactly where the user clicked.
   *
   * For now, put the caret at the end of the
   * nearest existing block.
   */
  const blocks = Array.from(
    editorWrapRef.current?.querySelectorAll(
      '[data-slate-node="element"]'
    ) ?? []
  ) as HTMLElement[];

  if (!blocks.length) return;

  let closestBlock: HTMLElement | null = null;
  let closestDistance = Infinity;

  blocks.forEach((block) => {
    const rect = block.getBoundingClientRect();

    const centerY = rect.top + rect.height / 2;
    const distance = Math.abs(event.clientY - centerY);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestBlock = block;
    }
  });

  if (!closestBlock) return;

  const path = ReactEditor.findPath(editor, closestBlock);

  const end = Editor.end(editor, path);

  Transforms.select(editor, end);

  ReactEditor.focus(editor);
};

    const handleEditorKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      
      const caret = handleCaretReact()

      if(caret){
        verticalNavigationX.current = caret.left
      }
        if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    insertPageBreak(editor);
    return;
  }

      
      
      if (handleKeyShortcuts(event)) {
        return;
      }
      handleKeyDown(event);

      if (handleAlignmentShortcut(event)) {
        return;
      }
      handleAlignmentShortcut(event);
    };
  
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    }, [suggestions, editor]);

    const storeDoc = (value: Descendant[]): void => {
      // console.log(JSON.stringify(value, null, 2));
      setContent(value);
      setSavingState("unsaved");
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }

      saveTimer.current = setTimeout(() => {
        updateDocument(title, value);
      }, 1500);
      const marks = Editor.marks(editor);
      setActiveFont(marks?.fontFamily as string) ?? "Mukta";

      setFontSize(marks?.fontSize as number) ?? 16;
    };

    const handleTitleChange = (value: string) => {
      setTitle(value);
      setSavingState("unsaved");

      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }

      saveTimer.current = setTimeout(() => {
        updateDocument(title, content);
      }, 1500);
    };

    const renderElement = useCallback((props: RenderElementProps) => {
    return <Element {...props} />;
  }, []);

    const renderLeaf = useCallback((props: RenderLeafProps) => {
      return <Leaf {...props} />;
    }, []);

    return (
      <>
        <HeaderDocPage
          title={title}
          onTitleChange={handleTitleChange}
          savingState={savingState}
          orientation={orientation}
          setOrientation={setOrientation}
          setPageSize={setPageSize}
          pageSize={pageSize}
          documetMargin={documentMargin}
          setDocumentMargin={setDocumentMargin}
        />
        <main className=" mx-auto rounded-xl h-full pt-8  bg-[#f7f7f7]">
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

    <div className="relative flex flex-col items-center" onMouseDown={handleDocumentMouseDown}>
      {/* the page sheets: they only draw the paper + the margins */}
      {Array.from({ length: pageCount }).map((_, index) => (
        <DocumentPage
          key={index}
          ref={index === 0 ? pageRef : undefined}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          documentMargin={documentMargin}
        >
          <div />
        </DocumentPage>
      ))}

      {/* one single editor sitting on top of every sheet */}
      <div
        ref={editorWrapRef}
        className="absolute"
        style={{
          top: editorBox.top,
          left: editorBox.left,
          width: editorBox.width || undefined,
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Start Writing"
          className="w-full focus:outline-0"
          onKeyDown={handleEditorKeydown}
        />
      </div>

      {suggestions.length !== 0 && (
        <div
          className="fixed z-999"
          style={{
            top: suggestionPosition.top,
            left: suggestionPosition.left,
          }}
        >
          <Suggestion
            words={suggestions}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onSelect={selectSuggestion}
          />
        </div>
      )}
    </div>
  </Slate>
            </div>
          )}
        </main>
      </>
    );
  }

  export default DocPage;
