import React from 'react'

type ButtonProps = {
    children: React.ReactNode,
    className?:string,
    onClick?:(e?:React.MouseEvent<HTMLButtonElement>)=>void,
    onMouseDown?:(e?:React.MouseEvent<HTMLButtonElement>)=>void
}

function Button({children,className,onClick,onMouseDown}:ButtonProps) {
  return (
    <button className={`${className} p-2 cursor-pointer`} onClick={onClick} onMouseDown={onMouseDown}>
        {children}
    </button>
  )
}

export default Button