import { useEffect, useState } from "react"
import { Editor } from "slate"
import Circle from '@uiw/react-color-circle';
import { Popover, PopoverContent, PopoverTrigger } from "#components/ui/popover";
import { Button } from "#components/ui/button";
import Chrome from '@uiw/react-color-chrome';
import { GithubPlacement } from '@uiw/react-color-github';
import { HighlighterIcon } from "lucide-react";

interface ColorButtonProps {
  editor: Editor
}

const hexToRgba = (hex: string, alpha: number): string => {
  const value = hex.replace('#', '')
  const normalized = value.length === 3
    ? value.split('').map((char) => char + char).join('')
    : value

  const parsed = Number.parseInt(normalized, 16)
  const r = (parsed >> 16) & 255
  const g = (parsed >> 8) & 255
  const b = parsed & 255

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const featuredColors = [
  {
    name: "Document",
    colors: [
      "#000000", // Black
      "#374151", // Dark Gray
      "#6B7280", // Gray
      "#9CA3AF", // Muted Gray
      "#D1D5DB", // Light Gray
      "#F3F4F6", // Very Light Gray
      "#FFFFFF", // White
    ],
  },

  {
    name: "Colors of Nepal",
    colors: [
      "#DC143C", // Crimson Red
      "#003893", // Deep Blue
      "#D4AF37", // Gold
      "#F4C430", // Saffron
      "#8B0000", // Deep Red
      "#7B3F00", // Earth Brown
      "#2E5D50", // Himalayan Green
      "#4F7942", // Forest Green
      "#5B8C85", // Mountain Teal
    ],
  },

  {
    name: "Accent",
    colors: [
      "#EF4444", // Red
      "#F97316", // Orange
      "#EAB308", // Yellow
      "#22C55E", // Green
      "#06B6D4", // Cyan
      "#3B82F6", // Blue
      "#8B5CF6", // Purple
      "#EC4899", // Pink
    ],
  },
]

function Highlighter({ editor }: ColorButtonProps) {
  const [hex,setHex] = useState<string>('#111827')
  const [open,setOpen] = useState<boolean>(false)

  console.log(hex)

  useEffect(()=>{
    const marks = Editor.marks(editor)

    if(marks?.color){
        setHex(marks.color as string)
    }
    else{
        setHex('#111827')
    }
  },[editor.selection])

  const handleColorChange = (color:string):void=>{
    setHex(color)
    Editor.addMark(editor,"highlights",hexToRgba(color, 0.28))
  }

  
  return(
    <Popover>
    <PopoverTrigger>
        <Button>
            <div>
               <HighlighterIcon/>
                     <div
        className="w-full h-[3px]"
        style={{
          backgroundColor: hexToRgba(hex, 0.28),
        }}
      />

            </div>
        </Button>
    </PopoverTrigger>
    <PopoverContent className="bg-white">
    <div className="flex flex-col gap-4">
   {
    featuredColors.map((color)=>{
        return (
            <div className="space-y-2">
                 <p>{color.name}</p>
            <Circle
    colors={color.colors}
    color={hex}
     style={{
        gap: 12
      }}
      rectProps={{
        style: {
          width: 18,
          height: 18,
        }
      }}
      onChange={(color)=>handleColorChange(color.hex)}
    />
    </div>
        )
    })
   }
   <div>
     <Button variant={'ghost'} className="text-gray-500" onClick={()=>setOpen(prev=>!prev)}>Open Color Cutomizer</Button>
   </div>
   {
    open &&
    <div>
         <Chrome
        color={hex}
        style={{ float: 'left' }}
        placement={GithubPlacement.Right}
        onChange={(color) => handleColorChange(color.hex)}
      />
    </div>
}
     </div>
    </PopoverContent>
    </Popover>
  )
  
}

export default Highlighter