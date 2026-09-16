import type { DocumentMargins } from '@/types/documentSetting'
import React from 'react'

interface DocumentPageProps {
  pageWidth:string,
  pageHeight:string,
  documentMargin:DocumentMargins,

  children:React.ReactNode
}

const DocumentPage = React.forwardRef<HTMLDivElement,DocumentPageProps>(({pageWidth,pageHeight,documentMargin,children},ref,) => { 
  return (
    <div        
                ref={ref}

                className="border-2 border-neutral-200 bg-white rounded-xl mt-4"
                style={{
                  width: pageWidth,
                  height: pageHeight,
                  padding: `${documentMargin.top}mm ${documentMargin.right}mm ${documentMargin.bottom}mm ${documentMargin.left}mm`,
                  boxSizing:'border-box'
                }}
              >
                <div className="relative w-full h-full">
                  {children}
                </div>
              </div>
  )
}
)

export default DocumentPage