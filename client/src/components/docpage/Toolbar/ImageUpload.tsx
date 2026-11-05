import { Button } from '#components/ui/button'
import { documentHandler } from '@/services/documentHandler'
import { ImagePlus } from 'lucide-react'
import React, { useRef } from 'react'
import { toast } from 'react-toastify'
import{ Editor,Transforms,type RangeRef } from 'slate'

interface ImageUploadProps {
    editor:Editor
}

function ImageUpload({editor}:ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const selectionRef = useRef<ReturnType<typeof Editor.rangeRef> | null>(null)

    const handleButtonClick = () => {
    if (editor.selection) {
        selectionRef.current?.unref()

        selectionRef.current = Editor.rangeRef(
            editor,
            editor.selection,
            { affinity: 'forward' }
        )
    }

    fileInputRef.current?.click()
}

    const handleImageSelect= async(e:any)=>{
        const file = e.target.files?.[0]

        if (!file) return

        console.log(file)
        try {
            const response = await documentHandler.handleImageUploadOnDocument(file)
                    console.log('Backend response:', response)

            if(response.success){
                console.log("Image Uploaded")
                toast.success("Successfully Uploaded Image")

                const savedSuccesstion = selectionRef.current?.current

                if(!savedSuccesstion){
                    console.error("cannot find cursor position")
                    return
                }

                Transforms.select(editor,savedSuccesstion)

                const imageNode = {
                    type: 'image',
                    url: response.url,
                    public_id: response.public_id,
                    width:400,
                    height:300,
                    children: [{ text: '' }],
                } as any

                Transforms.insertNodes(editor, imageNode)

                    selectionRef.current?.unref()
    selectionRef.current = null
            }

            
            console.log('Image Upload')
        } catch (error) {
            console.error("Image Upload Failed",error)
            toast.error("Failed To Upload Image")
        }
        finally{
        e.target.value = ""
        }

    }
  return (
    <>
    <Button type='button' onClick={handleButtonClick} className='cursor-pointer'>
        <ImagePlus/>
    </Button>
       
        <input
        ref={fileInputRef}
        type="file"
        accept='image/*'
        hidden
        onChange={handleImageSelect}/>
    </>
  )
}

export default ImageUpload