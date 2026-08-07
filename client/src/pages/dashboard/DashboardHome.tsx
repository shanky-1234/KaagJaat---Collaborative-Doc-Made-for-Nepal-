import DashboardCardCreate from '#components/dashboard/DashboardCardCreate'
import React, { useEffect, useState } from 'react'
import notepage from '../../assets/elements/notepage.svg'
import folder from '../../assets/elements/foldericon.svg'
import { useNavigate } from 'react-router'
import { useAppSelector } from '#hooks/reduxHooks'
import { documentHandler } from '@/services/documentHandler'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import DocumentCard from '#components/dashboardCards/DocumentCard'
import type { DocumentResponse } from '@/types/documentResponse'

function DashboardHome() {

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

  const navigate = useNavigate()

  const {userData} = useAppSelector(state=>state.auth)

  const [userDocuments,setUserDocument] = useState<DocumentResponse[]>([])

  const getAllDocument = async ()=>{
    try {
      const response = await documentHandler.getAllDocuments()
      if (response.success){
        setUserDocument(response?.allDocument)
      }
    } catch (error) {
      console.error(error)
       toast.error(`${error}`)
    }
  }

  useEffect(()=>{
    getAllDocument()
    console.log(userDocuments)
  },[])

  const handleCreateDocument = async ()=>{
    try {
        const response = await documentHandler.createDocument()
        if(response.success){
          navigate(`/documents/n/${response?.newDocument._id}`)
        }
    } catch (error) {
      console.error(error)
      toast.error(`${error}`)
    }
  }

  const handleDocumentRouting = (id:string)=>{
    navigate(`/documents/n/${id}`)
  }

  const handleDocumentDelete = async (e:any,id:string) =>{
    try {
      e.stopPropagation()
        const response = await documentHandler.deleteDocument(id)
        if(response.success){
          getAllDocument()
          toast.success(`Deleted Successfully`)
        }
    } catch (error) {
      console.error(error)
      toast.error(`${error}`)
    }
  }
  return (
    <main className='mt-8 mx-8'>
      <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
      <div>
        <h1 className='font-bold font-secondary text-primary tracking-[-3%] text-2xl'>सुभ प्रभाबत ! {userData?.fullname}</h1>
      </div>
      <section className='mt-4 flex gap-4 mb-15'>
        {
          options.map((item)=>{
            return(
                 <DashboardCardCreate title={item.title} className={item.className} description={item.description} icon={item.icon} onClick={handleCreateDocument}/>
            )
          })
        }
     
      </section>

      <section>
        <div className='mb-4'>
           <h2 className='font-bold font-primary text-primary tracking-[-3%]'>Recent Documents</h2>
        </div>
        <div className='grid lg:grid-cols-4 md:grid-cols-3 gap-4'>
          {
              userDocuments.map((document)=>{
                return(
                   <DocumentCard key={document._id} title={document.name} content={document.content} author={document.ownerUser.fullname} date={document.createdAt} onClick={() => handleDocumentRouting(document._id)} onClickDelete={(e:any)=>handleDocumentDelete(e,document._id)} />
                )
              })
            }
         
        </div>
      </section>
    </main>
  )
}

export default DashboardHome