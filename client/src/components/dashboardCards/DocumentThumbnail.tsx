import { useCallback, useMemo } from "react";
import { createEditor, type Descendant } from "slate";
import {
  Editable,
  Slate,
  withReact,
  type RenderElementProps,
  type RenderLeafProps,
} from "slate-react";
import Element from "#components/docpage/Element";
import Leaf from "#components/docpage/Leaf";

type DocumentThumbnailProps = {
  content: Descendant[];
};

const emptyDocument: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

function DocumentThumbnail({ content }: DocumentThumbnailProps) {
  const editor = useMemo(() => withReact(createEditor()), []);
  const initialValue = content?.length ? content : emptyDocument;

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    [],
  );

  return (
    <div className="relative h-full w-full overflow-hidden bg-white text-black">
      <div className="pointer-events-none absolute left-0 top-0 w-[250%] origin-top-left scale-[0.4] select-none">
        <Slate editor={editor} initialValue={initialValue}>
          <Editable
            readOnly
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            className="min-h-[520px] outline-none"
          />
        </Slate>
      </div>
    </div>
  );
}

export default DocumentThumbnail;
