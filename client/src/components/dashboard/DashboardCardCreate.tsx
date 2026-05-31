import React from 'react'
import notepage from '../../assets/elements/notepage.svg'

type CardProps = {
    title:string,
    description:string,
    className?:string,
    icon?:string,
    link?:string,
    onClick?:()=>void
}

function DashboardCardCreate({title,description,className,icon,link,onClick}:CardProps) {
  return (
    <div className={` ${className} max-w-sm px-5 py-6 rounded-xl overflow-hidden cursor-pointer`} onClick={onClick}>
        <div className='w-34 h-34'>
            <img src={icon} className='w-full h-full object-contain' alt='icon'/>
        </div>
        <div>
            <h3 className='text-white'>{title}</h3>
            <p className='text-white'>{description}</p>
        </div>
    </div>
  )
}

export default DashboardCardCreate