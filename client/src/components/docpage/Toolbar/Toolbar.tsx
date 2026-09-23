import ElementButton from "../ElementButton";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  ItalicIcon,
  List,
  ListOrdered,
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
import TextStylePicker from "./TextStylePicker";
import PageBreakButton from "./PageBreakButton";
import BulletPointListingButton from "./BulletPointListingButton";
import OrderedPointsListingButton from "./OrderedPointsListingButton";

function Toolbar({ editor }: { editor: Editor & HistoryEditor }) {
  return (
    <section className="flex items-center gap-2 border border-neutral-200 p-1 bg-white rounded-2xl h-full w-fit">
      <UndoRedoButton editor={editor} />
      <div className="block border min-h-[30px] border-neutral-200" />
      <PageBreakButton editor={editor}/>
      <div className="block border min-h-[30px] border-neutral-200" />
      <TextStylePicker/>
       <div className="block border min-h-[30px] border-neutral-200" />
      <FontFamilyPicker editor={editor} />
      <div className="block border min-h-[30px] border-neutral-200" />
      <FontSizePicker />
      <div className="block border min-h-[30px] border-neutral-200" />
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
   <div className="block border min-h-[30px] border-neutral-200" />
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
      <AlignButton editor={editor} align="justify">
        <AlignJustify/>
      </AlignButton>
    <div className="block border min-h-[30px] border-neutral-200" />
    <BulletPointListingButton editor={editor} bulletType="bulleted-list">
      <List/>
    </BulletPointListingButton>
    <OrderedPointsListingButton editor={editor} bulletType="numbered-list">
       <ListOrdered/>
    </OrderedPointsListingButton>
    </section>
  );
}

export default Toolbar;
