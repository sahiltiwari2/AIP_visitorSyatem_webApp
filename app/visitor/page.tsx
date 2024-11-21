'use client'
import React, { useEffect, useState } from 'react';
import TopBar from '@/components/topBar';
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { RiMailSettingsLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import Link from 'next/link';
import { getDatabase, ref, query, orderByChild, equalTo, limitToLast, onValue } from "firebase/database";
import VisitorUpcomingCard from '@/components/visitorUpcomingCard';
import VisitorCheckedCard from '@/components/visitorCheckedin';

const VisitorOverview = () => {

  type AppointmentEntry = {
    name: string;
    timeOfVist: string;
  };
  
  type PendingApproval = {
    name: string;
    time: string;
  };
  
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  
  useEffect(() => {
    const fetchPendingApprovals = async () => {
      const db = getDatabase();
      const appointmentsRef = ref(db, 'approvedAppointments');
  
      const pendingQuery = query(
        appointmentsRef,
        orderByChild('approvalStatus'),
        equalTo('Pending'),
        limitToLast(3)
      );
  
      onValue(pendingQuery, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, AppointmentEntry>;
  
          const pendingList: PendingApproval[] = Object.values(data).map((entry) => ({
            name: entry.name,
            time: entry.timeOfVist,
          }));
  
          setPendingApprovals(pendingList);
        } else {
          setPendingApprovals([]);
        }
      });
    };
  
    fetchPendingApprovals();
  }, []);
  
  return (
    <div>
      <TopBar pageName="Visitor Overview" />
      <div className="w-screen grid grid-cols-2 gap-1 px-5 pt-1">
        <Link href={'/'}>
          <div className="flex items-center justify-center flex-col py-9 border-2 rounded-md shadow-sm hover:border-black transition-all duration-400 hover:shadow-lg">
            <div className="text-2xl">
              <MdOutlinePeopleAlt />
            </div>
            <div className="font-bold">Today</div>
            <div className="text-[13px]">Visitors Today</div>
          </div>
        </Link>
        <Link href={'/'}>
          <div className="flex items-center justify-center flex-col py-9 border-2 rounded-md shadow-sm hover:border-black transition-all duration-400 hover:shadow-lg">
            <div className="text-2xl">
              <IoLocationOutline />
            </div>
            <div className="font-bold">Upcoming Visits</div>
            <div className="text-[13px]">Visitors Coming to Meet</div>
          </div>
        </Link>
      </div>
      <div className="w-screen px-5">
        <Link href={'/pendingRequests'}>
          <div className="w-full mt-1 flex items-center justify-center flex-col py-9 border-2 rounded-md shadow-sm hover:border-black transition-all duration-400 hover:shadow-lg">
            <div className="text-2xl">
              <RiMailSettingsLine />
            </div>
            <div className="font-bold">Visit Requests</div>
            <div className="text-[13px]">Pending Requests</div>
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-2 w-screen">
        <div className="m-5 pt-5 flex justify-center flex-col items-center">
          <div className="font-bold text-2xl">Visitor Activity Log</div>
          <div>
            <VisitorCheckedCard name='Krishna' time='8:00'/>
          </div>
          <div>
            <VisitorCheckedCard name='Ashwin' time='3:00'/>
          </div>
          <div>
            <VisitorCheckedCard name='Zaid' time='7:00'/>
          </div>
          
        </div>
        <div className="m-5 pt-5 text-center">
          <div className="font-bold text-2xl">Scheduled Appointments</div>
          <div className='flex flex-col justify-center items-center'>
          {pendingApprovals.map((approval, index) => (
            <VisitorUpcomingCard key={index} name={approval.name} time={approval.time} />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorOverview;
