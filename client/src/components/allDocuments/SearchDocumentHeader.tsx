import React from 'react'
import morningArt from '../../assets/headerElements/morning.png'
import nightArt from '../../assets/headerElements/night.png'
import eveningArt from '../../assets/headerElements/evening.png'
import { getTime } from '@/utils/dateandtime/getTime'
import { useAppSelector } from '#hooks/reduxHooks'

function SearchDocumentHeader() {
  const currentSpace = useAppSelector(state=>state.space.currentSpace)
  const period = getTime()
  return (
    <div className={`px-4 py-6 ${period === 'morning' ? 'bg-[#BBF7FF]' : period === 'afternoon' ? 'bg-[#95F1FD] ' : period === 'evening' ? 'bg-[#FFE3CF]': 'bg-[#192B3F]' } flex-row  md:flex justify-between`}>
        <div>
        <h1 className={`font-secondary ${period === 'morning' ? 'text-secondary' : period === 'afternoon' ? 'text-secondary' : period === 'evening' ? 'text-primary': 'text-white' }`}>All Documents in {currentSpace?.name}</h1>
        </div>
        <div className='max-w-[320px] absolute right-0 hidden md:block'>
          <img src={period === 'morning' ? morningArt : period === 'afternoon' ? morningArt : period === 'evening' ? eveningArt : nightArt } className='w-full h-full object-cover'/>
        </div>
        </div>
  )
}

export default SearchDocumentHeader