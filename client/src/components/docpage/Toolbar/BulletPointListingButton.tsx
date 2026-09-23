import { Select, SelectContent, SelectItem, SelectTrigger } from '#components/ui/select'
import { getCurrentListStyle } from '@/utils/getListStyle'
import { toggleList } from '@/utils/toggleList'
import { Circle, Cross, DotIcon, Icon, List, Square, X } from 'lucide-react'
import React from 'react'
import type { Editor } from 'slate'
import { useSlate } from 'slate-react'
interface ListButtonProps {
    editor:Editor
    bulletType:'bulleted-list',
    children:React.ReactNode
}

const listOption = [
    {
        label:'None',
        icon:<X/>,
        value:'none'
    },
    {
        label:'Bullet Points',
        icon:<DotIcon/>,
        value:'disc'
    },
    {
        label:'Square Points',
        icon:<Square/>,
        value:'square'
    },{
      label:'Circle Points',
      icon:<Circle/>,
      value:'circle'
    }
]
function BulletPointListingButton({editor,bulletType,children}:ListButtonProps) {
  const slate = useSlate()

  const currentListStyle = getCurrentListStyle(slate)
  return (
    <Select value={currentListStyle} onValueChange={(value) => {

    toggleList({
      editor,
      listType: bulletType,
      listStyle: value as "disc" | "square" | "circle",
    });
  }}>
           <SelectTrigger
        className={`
          w-full 
          border
          border-neutral-400
          focus:border-neutral-400!
          focus-visible:border-neutral-400!
          focus-visible:ring-0
          data-[state=open]:border-neutral-400!
        ${currentListStyle !== 'none' && currentListStyle !== 'numbered' && 'bg-primary text-white' }
        `}
      >
            {children}
        </SelectTrigger>
        <SelectContent  position="popper"
        side="bottom"
        align="start"
        className="
          bg-white
          !border-neutral-400
          !ring-0
          !outline-none
        ">
            {
                listOption.map((list)=>{
                    return(
                         <SelectItem value={list.value} key={list.label}>
            <div className='flex items-center gap-2'>
            {list?.icon}
            <span>{list.label}</span>
            </div>
            </SelectItem>
                    )
                })
            }
           
        </SelectContent>
    </Select>
  )
}

export default BulletPointListingButton