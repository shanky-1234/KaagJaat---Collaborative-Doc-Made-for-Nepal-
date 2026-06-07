import { Search } from 'lucide-react'
import  Input  from '../shared/Input'
import { MenuIcon } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { Avatar, AvatarImage } from '#components/ui/avatar'
import { useSidebar } from '#components/ui/sidebar'
import logo from '../../assets/core/logo.svg'
import Profile from '#components/shared/Profie'

function HeaderDashboard() {
  const {toggleSidebar} = useSidebar()

  return (
    <header className='pt-6 pb-3  border-neutral-three flex justify-between w-full border-b-1'>
            <div className='flex items-center gap-4'>
          
          <MenuIcon onClick={toggleSidebar} color='#343434' />
            
          <div className='w-40'>
              <img src={logo} alt="logo" className='w-full h-full object-contain'/>
            </div>
            </div>
      <div className='hidden md:block'>
       <Input icon={Search} placeholder='Global Search'/>
       </div>
       <div className='flex items-center flex-row-reverse gap-8'>
        {
      <Profile/>
        }
       <LanguageSwitcher/>
       </div>
    </header>
  )
}

export default HeaderDashboard