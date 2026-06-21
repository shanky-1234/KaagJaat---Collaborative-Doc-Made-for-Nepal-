import DashboardCardCreate from '#components/dashboard/DashboardCardCreate'
import React from 'react'
import notepage from '../../assets/elements/notepage.svg'
import folder from '../../assets/elements/foldericon.svg'
import { useNavigate } from 'react-router'
import { useAppSelector } from '#hooks/reduxHooks'

function DashboardHome() {

  const navigate = useNavigate()

  const {userData} = useAppSelector(state=>state.auth)

  const options= [
    {
      title:'Create New Document',
      description:'Start with new blank page and invite as you go',
      className:'bg-primary',
      icon:notepage
    },
    {
       title:'Import From Device',
      description:'Bring in your designs from other formats and customize them',
      className:'bg-secondary',
      icon:folder
    }
  ]
  return (
    <section className='mt-8 mx-8'>
      <div>
        <h1 className='font-bold font-secondary text-primary tracking-[-3%] text-2xl'>सुभ प्रभाबत ! {userData?.fullname}</h1>
      </div>
      <section className='mt-4 flex gap-4'>
        {
          options.map((item)=>{
            return(
                 <DashboardCardCreate title={item.title} className={item.className} description={item.description} icon={item.icon} onClick={()=>navigate('/doc')}/>
            )
          })
        }
     
      </section>
    </section>
  )
}

export default DashboardHome