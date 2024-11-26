import React from 'react'
import TopBar from '@/components/topBar'
import { FaPencilAlt } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { IoMail } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";

const page = () => {
  return (
    <div>
      <TopBar pageName='Settings' />
      <div className='font-bold text-2xl m-5'>
        Profile Management
      </div>
      <div className='w-screen flex justify-between items-center px-5 '>
        <Link href="/">
          <div className='flex flex-row gap-4 text-xl'>
            <FaPencilAlt />
            <span className='text-xl'>Admin: Name</span>
          </div>
        </Link>
        <Button className='ml-auto'>Manage</Button>
      </div>

      <Link href="/">
        <div className='flex flex-row gap-4 text-2xl ml-4 mt-2'>
          <MdDeleteForever /> <span className='text-xl'> Log Details </span>
        </div>
      </Link>

      <div className='font-bold text-2xl m-5 mt-10'>
        Notifications
      </div>
      <div className='w-screen flex justify-between items-center px-5 '>
        <Link href="/">
          <div className='flex flex-row gap-4 text-xl'>
            <div className='mt-1'>
              <IoMail />
            </div>
            <span className='text-xl'>Master Verification Email</span>
          </div>
        </Link>
        <Button className='ml-auto'>Set for Development Purpose</Button>
      </div>
      <div className='w-screen flex justify-between items-center px-5 mt-3'>
        <Link href="/">
          <div className='flex flex-row gap-4 text-xl'>
            <div className='mt-1'>
              <IoMail />
            </div>
            <span className='text-xl'>Department Verification Email</span>
          </div>
        </Link>
        <Button className='ml-auto'>Set for Development Purpose</Button>
      </div>

      <div className='font-bold text-2xl m-5 mt-10'>
        Security Settings
      </div>
      <div className='w-screen flex justify-between items-center px-5 mt-3'>
        <Link href="/">
          <div className='flex flex-row gap-4 text-xl'>
            <div className='mt-1'>
            <FaLock />
            </div>
            <span className='text-xl'>Change Password</span>
          </div>
        </Link>
        <Button className='ml-auto' variant='ghost'>Change</Button>
      </div>
    </div>
  )
}

export default page