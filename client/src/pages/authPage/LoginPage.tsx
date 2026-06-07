import Input from '#components/shared/Input'
import { KeyRound, Mail } from 'lucide-react'
import logo from '../../assets/core/logo.svg'
import Button from '#components/shared/Button'
import { useState } from 'react'
import { userAuthService } from '@/services/userAuth'
import { useAppDispatch, useAppSelector } from '#hooks/reduxHooks'
import { setLoading, setUserData } from '@/redux/AuthSlice'
import { useNavigate } from 'react-router'
import { isAllOf } from '@reduxjs/toolkit'

function LoginPage() {
    
    const [email,setEmail] = useState<string>('')
    const [password,setPassword] = useState<string>('')

    const dispatch = useAppDispatch()
    const {isLoading} = useAppSelector(state=>state.auth)

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        dispatch(setLoading(true))
        const data = {
            email,
            password
        }
        console.log(data)
        try{
            const response = await userAuthService.userLogin(data)
            if(response.success){
                dispatch(setUserData(response.userDetails))
                console.log(response)
                navigate('/')
            }
        }
        catch(error){
            console.error(error)
        }
        finally{
            dispatch(setLoading(false))
        }
    }
  return (
    <main className='flex justify-center items-center my-auto align-middle h-screen'>
        <section className='bg-white rounded-2xl border border-neutral-one w-1/4'>
            <div className='p-8'>
                <div className='w-40'>
                <img src={logo} alt="logo" className='w-full h-full' />
                </div>
                <div className='mt-4'>
                <h2 className='text-3xl font-bold text-primary'>Log-In</h2>
                <p className='font-medium text-neutral-two'>Log in to start typing <span className='font-secondary'>कागजात</span></p>
                </div>
                <div className='mt-3'>
                    <form className='space-y-2' onSubmit={handleSubmit}>
                        <Input placeholder='Enter Your Email' icon={Mail} className='w-full' onChange={(e)=>setEmail(e.target.value)}/>
                        <Input placeholder='Enter Your Password' icon={KeyRound} className='w-full' onChange={(e)=>setPassword(e.target.value)}/>
                        <Button className='bg-primary text-white rounded-xl w-full'>Log in</Button>
                    </form>

                </div>
                <div className='mt-4 cursor-pointer'>
                    <p className='text-center text-neutral-two text-sm'>Create a new account</p>
                </div>
            </div>
        </section>
    </main>
  )
}

export default LoginPage