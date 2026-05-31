import { Search } from 'lucide-react'
import  Input  from '../shared/Input'
import LanguageSwitcher from '../dashboard/LanguageSwitcher'
import { Avatar, AvatarImage } from '#components/ui/avatar'
import logo from '../../assets/core/logo.svg'

function HeaderDocPage() {

  return (
    <header className='pt-6 pr-8 pb-3  border-neutral-three flex justify-between w-full border-b-1'>
            <div className='px-7 flex items-center gap-4'>
            
          <div className='w-40'>
              <img src={logo} alt="logo" className='w-full h-full object-contain'/>
            </div>
            </div>
       <Input icon={Search} placeholder='Global Search'/>
       <div className='flex items-center flex-row-reverse gap-8'>
        <Avatar>
            <AvatarImage src='https://github.com/shadcn.png'/>
        </Avatar>
       <LanguageSwitcher/>
       </div>
    </header>
  )
}

export default HeaderDocPage