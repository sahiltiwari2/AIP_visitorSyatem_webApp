'use client'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/topBar'
import settingIcon from '@/public/settingIcon.jpg'
import { Icons } from 'react-toastify'
import Image from 'next/image'

const page = () => {
  const router = useRouter()

  const handelSignout = async () => {
    signOut(auth)
    router.push('/login')
  }
  return (
    <div>
      <TopBar pageName='Admin Profile' />
      <div className='font-bold text-xl m-5'>
        Profile Information
      </div>
      <div className='pl-5  w-screen'>
        Oliver Smith is the main administrator of the system. He has been with the company for over 10 years and has extensive experience in
        managing IT infrastructure and software development projects. Oliver is known for his attention to detail and his ability to solve
        complex problems efficiently. In his free time, he enjoys hiking and photography.
      </div>
      <div className='flex justify-center mt-10 gap-3 text-2xl w-screen'>
        <span className='font-semibold'>Current User:</span><span>Sahil Tiwari</span>
      </div>
      <div className='flex justify-center mt-4 gap-3 text-2xl w-screen'>
        <span className='font-semibold'>Department:</span><span>Software Development</span>
      </div>
      <div className='flex justify-center mt-4 gap-3 text-2xl w-screen'>
        <span className='font-semibold'>Email:</span><span>Sahiltiwari2005@gmail.com</span>
      </div>
      <div className='font-bold text-xl m-10'>
        Settings
      </div>
      <div>
        <Button>
          <Image src={settingIcon} alt='' height={100} width={100}/>
        </Button>
      </div>
      <Button onClick={handelSignout}>
        Log Out
      </Button>
    </div>
  )
}

export default page