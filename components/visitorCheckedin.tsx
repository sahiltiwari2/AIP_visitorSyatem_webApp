import React from 'react'
import { FaRegUser } from 'react-icons/fa'
import Image from 'next/image'
const visitorUpcomingCard = (props: any) => {
    return (
        <div className='flex mt-7 ml-5 '>
            <div className='p-2'>
                <Image
                    src={`/visitorPhoto/${props.email}.png`}
                    alt="Profile Photo"
                    width={300}
                    height={300}
                    className=''
                />
            </div>
            <div className='ml-5'>
                <div className='font-semibold'>
                    {props.name}
                </div>
                <div className='text-[13px]'>
                    Checked in at: {props.time}
                </div>
            </div>
        </div>
    )
}

export default visitorUpcomingCard