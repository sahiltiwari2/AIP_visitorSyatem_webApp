import React from 'react'
import PreRegisterVisitorChar from '@/components/preRegisterVisitorChar'
import VisitorTrendChart from "@/components/VisitorTrendChart"

const page = () => {
  return (
    <div>
      <div className='w-screen flex items-center justify-center flex-col'>
        <div className='w-[1000px] border-2 shadow-md p-3 rounded-md'>
          <PreRegisterVisitorChar />
        </div>
        <div className='w-[1000px]'>
          <VisitorTrendChart/>
        </div>
      </div>
    </div>
  )
}

export default page