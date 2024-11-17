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
import { Icon } from "@chakra-ui/react"
import { IoMdSettings } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiUserCircle } from "react-icons/hi2";
import { RiLogoutCircleLine } from "react-icons/ri";

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
      <div className='flex justify-center mt-10  text-[150px] w-screen'><HiUserCircle /></div>
      <div className='flex justify-center mt-5 gap-3 text-2xl w-screen'>
        <span className='font-semibold'>Current User:</span><span>Sahil Tiwari</span>
      </div>
      <div className='flex justify-center mt-4 gap-3 text-2xl w-screen'>
        <span className='font-semibold'>Department:</span><span>Software Development</span>
      </div>
      <div className='flex justify-center mt-4 gap-3 text-2xl w-screen'>
        <span className='font-semibold'>Email:</span><span>Sahiltiwari2005@gmail.com</span>
      </div>
      <div className='mt-10 w-screen p-3'>
        <Button style={{ background: '#FFFFFF' }} className="w-full  text-xl h-11 hover:shadow-lg transition-all duration-700 delay-150" variant='bordered'>
          <div className='w-full flex items-center text-xl'>
            <div className='w-full flex items-center gap-3'>
            <IoMdSettings />
            Settings
            </div>
            <MdOutlineKeyboardArrowRight />
          </div>
        </Button>
        <Button style={{ background: '#FFFFFF' }} className="w-full  text-xl h-11 hover:shadow-lg transition-all duration-700 delay-150 mt-3" variant='bordered'onClick={handelSignout}>
          <div className='w-full flex items-center text-xl'>
            <div className='w-full flex items-center gap-3'>
            <RiLogoutCircleLine />
            Log Out
            </div>
            <MdOutlineKeyboardArrowRight />
          </div>
        </Button>
      </div>
      
    </div>
  )
}

export default page