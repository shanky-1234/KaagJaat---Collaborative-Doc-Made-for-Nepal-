import React, { useState } from 'react'

function LanguageSwitcher() {
    const [isActive ,setIsActive] = useState<string>('english')
    console.log(isActive)
  return (
    <div className='h-fit px-2 py-1 flex items-center gap-1 w-fit bg-neutral-three rounded-full'>
        <div className={`${isActive === 'english' && 'bg-primary'} px-2 py-1 rounded-tl-full rounded-tr-xl rounded-bl-full rounded-br-xl flex justify-center cursor-pointer`}  onClick={()=>setIsActive('english')}>
            <span className={`font-secondary font-bold ${isActive === 'english' ? 'text-white' : 'text-primary'}`}>EN</span>
        </div>
        <div className={`${isActive === 'nepali' && 'bg-primary'} px-2 py-1 rounded-tl-xl rounded-tr-full rounded-bl-xl rounded-br-full cursor-pointer`} onClick={()=>setIsActive('nepali')}>
            <span className={`font-secondary font-bold ${isActive === 'nepali' ? 'text-white' : 'text-primary' }`}>नेपा</span>
        </div>
    </div>
  )
}

export default LanguageSwitcher