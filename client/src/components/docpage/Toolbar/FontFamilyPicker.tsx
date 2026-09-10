import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "#components/ui/select"
import { useEffect, useState } from "react"
import { Editor } from "slate"



const fonts = [
  {
    name: "Noto Sans Devanagari",
    value: "Noto Sans Devanagari",
  },
  {
    name: "Poppins",
    value: "Poppins",
  },
  {
    name: "Mukta",
    value: "Mukta",
  },
  {
    name: "Hind",
    value: "Hind",
  },
    {
    name: "Khand",
    value: "Khand",
  },
]

interface FontFamilyPickerProps {
    editor:Editor
}



function FontFamilyPicker({editor}:FontFamilyPickerProps) {

    const [activeFont,setActiveFont] = useState<string>('Mukta')

    useEffect(()=>{
    const marks = Editor.marks(editor)
    if (marks?.fontFamily){
        setActiveFont(marks.fontFamily as string)
    }else{
     setActiveFont('Mukta')
    }

  },[editor.selection])


    const handleFontChange = (font: string) => {
         setActiveFont(font)
  Editor.addMark(editor, "fontFamily", font)
}
  return (
    <div>
        <Select value={activeFont} onValueChange={handleFontChange}>
            <SelectTrigger className="w-full min-w-24 max-w-28">
                <SelectValue defaultValue={activeFont}/>
            </SelectTrigger>
            <SelectContent className="bg-white">
                <SelectGroup>
                    <SelectLabel>
                        Featured Fonts
                    </SelectLabel>
                    {
                        fonts.map((font)=>{
                            return(
                                <SelectItem key={font.value} value={font.value}>
                                    {font.name}
                                </SelectItem>
                            )
                        })
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
  )
}

export default FontFamilyPicker