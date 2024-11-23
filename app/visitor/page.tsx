'use client';
import React, { useEffect, useState } from 'react';
import TopBar from '@/components/topBar';
import { MdOutlinePeopleAlt } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { RiMailSettingsLine } from "react-icons/ri";
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

  type CheckedInEntry = {
    name: string;
    checkedInTime: string; // Updated to use checkedInTime
  };

  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [checkedInEntries, setCheckedInEntries] = useState<CheckedInEntry[]>([]);

  useEffect(() => {
    // Fetch pending approvals
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

    // Fetch checked-in entries
    const fetchCheckedInEntries = async () => {
      const db = getDatabase();
      const checkedInRef = ref(db, 'checkedIn');

      const checkedInQuery = query(checkedInRef, limitToLast(3));

      onValue(checkedInQuery, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, CheckedInEntry>;

          const checkedInList: CheckedInEntry[] = Object.values(data).map((entry) => ({
            name: entry.name,
            checkedInTime: entry.checkedInTime, // Use checkedInTime here
          }));

          setCheckedInEntries(checkedInList);
        } else {
          console.log("No checked-in data found.");
          setCheckedInEntries([]);
        }
      });
    };

    fetchPendingApprovals();
    fetchCheckedInEntries();
  }, []);

  return (
    <div>
      <TopBar pageName="Visitor Overview" />
      <div className="w-screen grid grid-cols-2 gap-1 px-5 pt-1">
        <Link href={'/visitorToday'}>
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
        <div className="m-5 pt-5 text-center">
          <div className="font-bold text-2xl">Checked In</div>
          <div className='flex flex-col justify-center items-center'>
            {checkedInEntries.map((entry, index) => (
              <VisitorCheckedCard key={index} name={entry.name} time={entry.checkedInTime} />
            ))}
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
