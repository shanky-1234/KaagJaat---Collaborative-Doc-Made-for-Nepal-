import { documentHandler } from "@/services/documentHandler"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "react-toastify"
import type { Descendant } from "slate"


function useDocument(id:string | undefined) {
    
    const navigate = useNavigate()

    const defaultContent: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
]

     const [title,setTitle] = useState<string>("")
     const [content,setContent] = useState<Descendant[]>(defaultContent)
     const [loading,setLoading] = useState<boolean>(false)

     const fetchDocument = async(id:string)=>{

            setLoading(true)
             try {
                 const response = await documentHandler.getSingleDocument(id)
                 console.log(response)
                 setTitle(response?.singleDocument.name)
                 setContent(response?.singleDocument.content)
             } catch (error) {
                 console.error(error)
                 toast.error(`${error}`)
             }
             finally{
                 setLoading(false)
             }
         }

     useEffect(()=>{
             if (!id){
                 navigate('/')
                 return
             }
             fetchDocument(id)
         },[id])

        const updateDocument = async()=>{
        try {
            if (!id) {
                toast.error('Document id is missing')
                return
            }
            const response = await documentHandler.updateDocument(id,{name:title,content:content})
            if (response.success){
                console.log('successful')
                toast.success('Succefully Updated')
            }
        } catch (error) {
            console.error(error)
             toast.error(`${error}`)
        }
    }

    return {
        title,
        setTitle,
        loading,
        setLoading,
        content,
        setContent,
        updateDocument
    }


}

export default useDocument