import { Scaling } from "lucide-react"
import { Transforms } from "slate"
import { ReactEditor, useFocused, useSelected, useSlateStatic, type RenderElementProps } from "slate-react"

function ImageElement({attributes,element,children}:RenderElementProps) {
    const selected = useSelected()
    const focused = useFocused()
    const editor = useSlateStatic()

    const handleResize = (e:any)=>{
        e.preventDefault()
        e.stopPropagation()

        const startX = e.clientX
        const startWidth = element.width ?? 400
        const startHeight = element.height ?? 300

        const aspectRatio = startWidth / startHeight

        const handleMouseMove = (moveEvent:MouseEvent) =>{
             const newWidth = Math.max(100, startWidth + (moveEvent.clientX - startX));
            const newHeight = newWidth / aspectRatio;

            const path = ReactEditor.findPath(editor, element);

            Transforms.setNodes(
                editor,
                {
                    width: newWidth,
                    height: newHeight,
                },
                { at: path }
            );
        }

        const handleMouseUp = () =>{
            window.removeEventListener("mousemove",handleMouseMove)
            window.removeEventListener("mouseup",handleMouseUp)
        }

        window.addEventListener("mousemove",handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp);
    }

  return (
     <div {...attributes} 
        contentEditable={false}
         className={`relative inline-block ${selected && focused ? 'border border-primary':''} transition duration-300`}>
          <img 
          src={element.url}
          alt={element.alt ?? ""}
          width={element.width ?? 400}
          height={element.height ?? 300}
          className="max-w-full h-auto"
          contentEditable={false}
          draggable={false}
          />
            {selected && focused && (
                <div
                    onMouseDown={handleResize}
                    className="absolute bottom-1 right-1 flex justify-center h-8 w-8 items-center bg-gray-200 border-2 border-white rounded-full cursor-nwse-resize"
                >
                    <Scaling size={16} />
                </div>
            )}
          {children}
        </div>
  )
}

export default ImageElement