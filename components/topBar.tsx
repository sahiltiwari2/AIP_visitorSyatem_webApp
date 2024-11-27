import React from 'react'
import Image from 'next/image'
import { IoSettingsOutline } from "react-icons/io5";
import Logo from "@/public/AIPlogo.svg"
import Link from 'next/link';

const TopBar = ({ pageName }: { pageName: string }) => {
  return (
    <div className=' px-10 py-5 flex flex-row  w-screen bg-gray-100 shadow-md rounded-md'>
      <div className=''>
        <Image src={Logo} alt='Logo' />
      </div>
      <div className=' w-full text-center font-bold text-xl pt-2'>
        {pageName}
      </div>
      <div className='w-[230px] text-3xl flex items-center justify-center'>
        <Link href={'/mainSettings'}>
          <IoSettingsOutline />
        </Link>
      </div>
    </div>
  )
}

export default TopBar