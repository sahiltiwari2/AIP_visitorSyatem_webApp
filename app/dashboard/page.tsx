import React from 'react'
import PreRegisterVisitorChar from '@/components/preRegisterVisitorChar'
import VisitorTrendChart from "@/components/VisitorTrendChart"
import TopBar from '@/components/topBar'
import VisitorsPerDepartment from "@/components/VisitorPerDepartmentChart"
import VisitorTypesChart from "@/components/TypesOfVisitors"
const page = () => {
  return (
    <div>
      <TopBar pageName='Dashboard'/>
      <div className='grid grid-cols-2 w-screen '>
        <div className='w-full px-5 py-5'>
          <div className='flex flex-col justify-center border-2 py-3 px-10 rounded-md shadow-md'>
            <div className='font-bold text-xl'>
              Visitors Today
            </div>
            <div>
              55
            </div>
          </div>
        </div>
        <div className='w-full px-5 py-5'>
          <div className='flex flex-col justify-center border-2 py-3 px-10 rounded-md shadow-md'>
            <div className='font-bold text-xl'>
              Total This Week
            </div>
            <div>
              176
            </div>
          </div>
        </div>
      </div>
      <div className='w-screen flex items-center justify-center flex-col'>
      <div className='w-[1000px]'>
          <VisitorTrendChart/>
        </div>
        <div className='w-[1000px] border-2 shadow-md p-3 rounded-md'>
          <PreRegisterVisitorChar />
        </div>
        <div>
          <VisitorsPerDepartment/>
        </div>
        <div>
          <VisitorTypesChart/>
        </div>
      </div>
    </div>
  )
}

export default page