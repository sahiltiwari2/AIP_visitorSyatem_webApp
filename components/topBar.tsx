import React from 'react'
import Image from 'next/image'
import Logo from "@/public/AIPlogo.svg"

const TopBar = ({pageName}: {pageName: string}) => {
  return (
    <div className=' px-10 py-5 flex flex-row border-2 w-screen border-black shadow-md rounded-md'>
        <div className=''>
          <Image src={Logo} alt='Logo'/>
        </div>
        <div className=' w-full text-center font-bold text-xl pt-2'>
            {pageName}
        </div> 
        <div className='w-[230px]'>

        </div>
      </div>
  )
}

export default TopBar