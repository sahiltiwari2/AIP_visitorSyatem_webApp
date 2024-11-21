import React from 'react'
import { FaRegUser } from 'react-icons/fa'

const visitorUpcomingCard = (props: any) => {
    return (
            <div className='flex mt-7 ml-5 '>
                <div className='text-4xl mt-1'>
                    <FaRegUser />
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