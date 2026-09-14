import ElementButton from "../ElementButton";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";
import { Editor } from "slate";
import MarkButton from "./MarkButton";
import ColorPicker from "./ColorPicker";
import FontSizePicker from "./FontSizePicker";
import FontFamilyPicker from "./FontFamilyPicker";
import AlignButton from "./AlignButton";
import UndoRedoButton from "./UndoRedoButton";
import { HistoryEditor } from "slate-history";
import Highlighter from "./Highlighter";
import LineHeight from "./LineHeight";

function Toolbar({ editor }: { editor: Editor & HistoryEditor }) {
  return (
    <section className="flex items-center gap-2 border p-2 border-neutral-two rounded-2xl mt-4 h-full w-fit">
      <UndoRedoButton editor={editor} />
      <div className="block border min-h-[30px] border-neutral-400" />
      <FontFamilyPicker editor={editor} />
      <div className="block border min-h-[30px] border-neutral-400" />
      <FontSizePicker />
      <div className="block border min-h-[30px] border-neutral-400" />
      <Highlighter editor={editor}/>
      <ColorPicker editor={editor} />
      <MarkButton mark="bold" shortcut="b">
        <BoldIcon />
      </MarkButton>
      <MarkButton mark="italic" shortcut="i">
        <ItalicIcon />
      </MarkButton>
      <MarkButton mark="underline" shortcut="u">
        <UnderlineIcon />
      </MarkButton>
      <MarkButton mark="strikethrough">
        <StrikethroughIcon />
      </MarkButton>
      <div className="block border min-h-[30px] border-neutral-400" />
      <ElementButton type="heading-one">
        <Heading1 />
      </ElementButton>
      <ElementButton type="heading-two">
        <Heading2 />
      </ElementButton>
      <ElementButton type="heading-three">
        <Heading3 />
      </ElementButton>
      <div className="block border min-h-[30px] border-neutral-400" />
      <LineHeight editor={editor}/>
      <AlignButton editor={editor} align="left">
        <AlignLeft />
      </AlignButton>
      <AlignButton editor={editor} align="center">
        <AlignCenter />
      </AlignButton>
      <AlignButton editor={editor} align="right">
        <AlignRight />
      </AlignButton>
    </section>
  );
}

export default Toolbar;
