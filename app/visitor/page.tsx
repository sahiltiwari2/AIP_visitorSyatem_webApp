import React from 'react'
import TopBar from '@/components/topBar'
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { RiMailSettingsLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import Link from 'next/link';

const visitor = () => {
  return (
    <div>
      <TopBar pageName='Visitor Overview' />
      <div className='w-screen grid grid-cols-2 gap-1 px-5 pt-1'>
        <Link href={'/'}>
          <div className='flex items-center justify-center flex-col py-9 border-2 rounded-md shadow-sm hover:border-black transition-all duration-400 hover:shadow-lg' >
            <div className='text-2xl'>
              <MdOutlinePeopleAlt />
            </div>
            <div className='font-bold'>
              Today
            </div>
            <div className='text-[13px]'>
              Visitors Today
            </div>
          </div>
        </Link>
        <Link href={'/'}>
          <div className='flex items-center justify-center flex-col py-9 border-2 rounded-md shadow-sm hover:border-black transition-all duration-400 hover:shadow-lg'>
            <div className='text-2xl'>
              <IoLocationOutline />
            </div>
            <div className='font-bold'>
              Upcoming Visits
            </div>
            <div className='text-[13px]'>
              Visitors Coming to Meet
            </div>
          </div>
        </Link>
      </div>
      <div className='w-screen px-5'>
        <Link href={'/'}>
          <div className='w-full mt-1   flex items-center justify-center flex-col py-9 border-2 rounded-md shadow-sm hover:border-black transition-all duration-400 hover:shadow-lg'>
            <div className='text-2xl'>
              <RiMailSettingsLine />
            </div>
            <div className='font-bold'>
              Visit Requests
            </div>
            <div className='text-[13px]'>
              Pending Requests
            </div>
          </div>
        </Link>
      </div>
      <div className='grid grid-cols-2  w-screen '>
        <div className='m-5 pt-5 flex justify-center flex-col items-center'>
          <div className='font-bold text-2xl '>
            Visitor Activity Log
          </div>
          <div className='flex mt-7 ml-5 '>
            <div className='text-4xl mt-1'>
              <FaRegUser />
            </div>
            <div className='ml-5'>
              <div className='font-semibold'>
                Hemant
              </div>
              <div className='text-[13px]'>
                Checked in at 9:30 AM
              </div>
            </div>
          </div>

          <div className='flex mt-7 ml-5 '>
            <div className='text-4xl mt-1'>
              <FaRegUser />
            </div>
            <div className='ml-5'>
              <div className='font-semibold'>
                Pllavi
              </div>
              <div className='text-[13px]'>
                Checked in at 10:00 AM
              </div>
            </div>
          </div>

          <div className='flex mt-7 ml-5 '>
            <div className='text-4xl mt-1'>
              <FaRegUser />
            </div>
            <div className='ml-5'>
              <div className='font-semibold'>
                Samarp
              </div>
              <div className='text-[13px]'>
                Checked in at 11:00 AM
              </div>
            </div>
          </div>
        </div>

        <div className='m-5 pt-5 flex justify-center flex-col items-center'>
          <div className='font-bold text-2xl '>
          Scheduled Appointments
          </div>
          <div className='flex mt-7 ml-5 '>
            <div className='text-4xl mt-1'>
              <FaRegUser />
            </div>
            <div className='ml-5'>
              <div className='font-semibold'>
                Hemant
              </div>
              <div className='text-[13px]'>
                Arival at 9:30 AM
              </div>
            </div>
          </div>

          <div className='flex mt-7 ml-5 '>
            <div className='text-4xl mt-1'>
              <FaRegUser />
            </div>
            <div className='ml-5'>
              <div className='font-semibold'>
                Pllavi
              </div>
              <div className='text-[13px]'>
                Arival at 10:00 AM
              </div>
            </div>
          </div>

          <div className='flex mt-7 ml-5 '>
            <div className='text-4xl mt-1'>
              <FaRegUser />
            </div>
            <div className='ml-5'>
              <div className='font-semibold'>
                Samarp
              </div>
              <div className='text-[13px]'>
                Arival at 11:00 AM
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default visitor