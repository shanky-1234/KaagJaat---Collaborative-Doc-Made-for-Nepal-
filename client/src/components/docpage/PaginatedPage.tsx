import { useCallback, useMemo } from "react";
import { createEditor, Editor, type Descendant } from "slate";
import { Editable, Slate, type RenderElementProps, type RenderLeafProps } from "slate-react";
import Element from "./Element";
import Leaf from "./Leaf";

interface PaginatedPageProps {
    content:Descendant[]
}

function PaginatedPage({content}:PaginatedPageProps) {
    const editor = useMemo(() => createEditor(), []);

      const renderElement = useCallback((props: RenderElementProps) => {
    return <Element {...props}/>;
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return (
        <Editable
        readOnly
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        />
  )
}

export default PaginatedPage