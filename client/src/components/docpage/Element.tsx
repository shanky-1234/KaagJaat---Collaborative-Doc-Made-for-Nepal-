import type { RenderElementProps } from "slate-react"

{/* Contains Elements: Basically Block Level Contents*/}

function Element({ attributes, children, element }: RenderElementProps) {

  const style:React.CSSProperties ={
    textAlign:element.align ?? 'left'
  }
  switch (element.type) {
        case 'heading-one' : 
                return <h1 {...attributes} className='text-5xl' style={style}>{children}</h1>
            case 'heading-two':
                return <h2 {...attributes} className='text-3xl' style={style}>{children}</h2>
          case 'heading-three':
                return <h3 className='text-xl' {...attributes} style={style}>{children}</h3>
            default:
                return <p {...attributes} style={style}>{children}</p>
  }
}

export default Element