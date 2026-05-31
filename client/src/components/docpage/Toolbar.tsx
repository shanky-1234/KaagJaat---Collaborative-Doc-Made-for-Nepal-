import ElementButton from "./ElementButton"
import { BoldIcon, Heading, Heading1, Heading2, Heading3, ItalicIcon, StrikethroughIcon, UnderlineIcon } from "lucide-react"
import { Editor } from "slate"
import MarkButton from "./MarkButton"

function Toolbar({editor}:{editor:Editor}) {
    
  return (
            <section className='flex gap-2 border p-2 border-neutral-two rounded-2xl mt-4 h-full' >
             <MarkButton mark="bold"><BoldIcon/></MarkButton>
    <MarkButton mark="italic" ><ItalicIcon/></MarkButton>
    <MarkButton mark="underline" ><UnderlineIcon/></MarkButton>
        <MarkButton mark="strikethrough"><StrikethroughIcon/></MarkButton>
      <div className="block border-1  border-neutral-400" />
    <ElementButton type="heading-one">
      <Heading1/>
    </ElementButton>
    <ElementButton type="heading-two">
      <Heading2/>
    </ElementButton>
    <ElementButton type="heading-three">
      <Heading3/>
    </ElementButton>
    </section>
  )
}

export default Toolbar