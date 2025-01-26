import React from 'react'
import { FaRegUser } from 'react-icons/fa'
import Image from 'next/image'

const formatTime = (time: { split: (arg0: string) => { (): any; new(): any; map: { (arg0: NumberConstructor): [any, any]; new(): any; }; }; }) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 or 12 to 12 for 12-hour format
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};
const visitorUpcomingCard = (props: any) => {

    return (
        <div className='flex mt-7 ml-5 '>
            <div className=''>
                <Image
                    src={`/visitorPhoto/${props.email}.png`}
                    alt="Profile Photo"
                    width={50}
                    height={50}
                    className=''
                />
            </div>
            <div className='ml-5'>
                <div className='font-semibold'>
                    {props.name}
                </div>
                <div className='text-[13px]'>
                    Arival at {formatTime(props.time)}
                </div>
            </div>
        </div>
    )
}

export default visitorUpcomingCard