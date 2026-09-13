
import type { RenderLeafProps } from 'slate-react'

function Leaf({leaf,attributes,children}:RenderLeafProps) {

    if (leaf.bold) children = <strong>{children}</strong>
    if (leaf.italic) children = <em>{children}</em>
    if (leaf.underline)     children = <u>{children}</u>
    if (leaf.strikethrough) children = <s>{children}</s>

    const style : React.CSSProperties = {
        color:leaf.color,
        backgroundColor:leaf.highlights,
        fontSize:leaf.fontSize,
        fontFamily:leaf.fontFamily || "Mukta",
        lineHeight:leaf.lineHeight
    }

    return <span {...attributes} style={style}>{children}</span>
}

export default Leaf