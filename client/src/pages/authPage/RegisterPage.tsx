import Input from '#components/shared/Input'
import { Calendar, KeyRound, Mail, User } from 'lucide-react'
import logo from '../../assets/core/logo.svg'
import Button from '#components/shared/Button'
import { useState } from 'react'
import { userAuthService } from '@/services/userAuth'
import { useAppDispatch, useAppSelector } from '#hooks/reduxHooks'
import { setLoading, setToken, setUserData } from '@/redux/AuthSlice'
import { useNavigate } from 'react-router'
import { isAllOf } from '@reduxjs/toolkit'

function RegisterPage() {
    
    const [fullname,setFullname] = useState<string>('')
    const [email,setEmail] = useState<string>('')
    const [password,setPassword] = useState<string>('')
    const [gender,setGender] = useState<string>('')
    const [dob,setDob] = useState<string>('')
    const [purpose,setPurpose] = useState<string>('')
    const today = new Date().toISOString().split('T')[0]

    const [error, setError] = useState<string>('')

    const dispatch = useAppDispatch()
    const {isLoading} = useAppSelector(state=>state.auth)

    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault()
        setError('')
        dispatch(setLoading(true))
        const data = {
            fullname,
            email,
            password,
            gender,
            dob,
            purpose,
    
        }
        console.log(data)
        try{
            const response = await userAuthService.userRegister(data)
            if(response.success){
                console.log('success')
                navigate('/')
            }
        }
        catch(error:any){
            console.error(error)
            if (error instanceof Error)
            setError(error.message)
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
                <h2 className='text-3xl font-bold text-primary'>Create Account</h2>
                <p className='font-medium text-neutral-two'>Create a new Account</p>
                </div>
                <div className='mt-3'>
                    <form className='space-y-2' onSubmit={handleSubmit}>
                        <Input placeholder='Enter Your Fullname' icon={User} className='w-full' onChange={(e)=>setFullname(e.target.value)}/>
                        <select className={`w-full p-2 rounded-full border-neutral-one border-2 ${gender === '' ? 'text-neutral-one': 'text-black'} text-sm`} name='gender' value={gender} onChange={(e)=>setGender(e.target.value)}>
                            <option value="" disabled> Select your gender</option>
                            <option value='male' className='text-black'>Male</option>
                            <option value='female' className='text-black'>Female</option>
                            <option value='other' className='text-black'>Other</option>
                        </select>
                        <Input placeholder='DD/MM/YYYY' type='date' icon={Calendar} className='w-full' value={dob} onChange={(e)=>setDob(e.target.value)} max={today} />
                        <select className={`w-full p-2 rounded-full border-neutral-one border-2 ${gender === '' ? 'text-neutral-one': 'text-black'} text-sm`} name='gender' value={purpose} onChange={(e)=>setPurpose(e.target.value)}>
                            <option value="" disabled> Select your Purpose</option>
                            <option value='Personal Works' className='text-black'>Personal Works</option>
                            <option value='Nepali Note AI' className='text-black'>Nepali Note AI</option>
                            <option value='Government Works' className='text-black'>Government Works</option>
                        </select>
                         <Input placeholder='Enter Your Email' icon={Mail} className='w-full' onChange={(e)=>setEmail(e.target.value)}/>
                        <Input placeholder='Enter Your Password' icon={KeyRound} className='w-full' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        
                        {
                            error &&
                            <div>
                                <span className='text-sm text-red-400'>{error}</span>
                            </div>
                        }
                        <Button className='bg-primary text-white rounded-xl w-full'>Register</Button>
                    </form>

                </div>
                <div className='mt-4 cursor-pointer'>
                    <p className='text-center text-neutral-two text-sm' onClick={()=>navigate('/auth/login')}>Go Back to Login</p>
                </div>
            </div>
        </section>
    </main>
  )
}

export default RegisterPage