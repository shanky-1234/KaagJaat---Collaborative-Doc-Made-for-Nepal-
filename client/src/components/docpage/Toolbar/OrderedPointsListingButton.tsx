import { Select, SelectContent, SelectItem, SelectTrigger } from '#components/ui/select'
import { getCurrentListStyle } from '@/utils/getListStyle'
import { toggleList } from '@/utils/toggleList'
import { Circle, Cross, DotIcon, Icon, List, Square, X } from 'lucide-react'
import React from 'react'
import type { Editor } from 'slate'
import { useSlate } from 'slate-react'
interface ListButtonProps {
    editor:Editor
    bulletType:'numbered-list',
    children:React.ReactNode
}

const listOption = [
    {
        label:'None',
        icon:<X/>,
        value:'none'
    },
    {
        label:'Numbered List',
        icon:<span>1.</span>,
        value:'numbered'
    },
]
function OrderedPointsListingButton({editor,bulletType,children}:ListButtonProps) {
  const slate = useSlate()

  const currentListStyle = getCurrentListStyle(slate)
  return (
    <Select value={currentListStyle} onValueChange={(value) => {
         if (value === "none") {
    toggleList({
      editor,
      listType: bulletType,
      listStyle: "none",
    });

    return;
  }
    toggleList({
      editor,
      listType: bulletType,
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
        ${currentListStyle === 'numbered' && 'bg-primary text-white' }
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

export default OrderedPointsListingButton