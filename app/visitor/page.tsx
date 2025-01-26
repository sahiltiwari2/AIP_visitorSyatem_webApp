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
import { auth } from '@/firebase';
import Image from 'next/image';

const VisitorOverview = () => {
  type AppointmentEntry = {
    name: string;
    timeOfVist: string;
    email: string;
  };

  type PendingApproval = {
    name: string;
    time: string;
    email: string;
  };

  type CheckedInEntry = {
    name: string;
    checkedInTime: string; // Updated to use checkedInTime
    email: string;
  };

  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [checkedInEntries, setCheckedInEntries] = useState<CheckedInEntry[]>([]);
  const isLoggedIn = auth.currentUser !== null;


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
            email: entry.email
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
            email: entry.email,
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
      <div className={isLoggedIn ? "w-screen grid grid-cols-1 lg:grid-cols-2 gap-1 px-5 pt-1" : "w-screen grid grid-cols-1 lg:grid-cols-1 gap-1 px-5 pt-1"}>
        <Link href={'/visitorToday'}>
          <div className="flex items-center justify-center flex-col py-9 border-2 rounded-md shadow-sm hover:border-black transition-all duration-400 hover:shadow-lg lg:w-auto w-full">
            <div className="text-2xl">
              <MdOutlinePeopleAlt />
            </div>
            <div className="font-bold lg:text-black">Today</div>
            <div className="text-[13px]">Visitors Today</div>
          </div>
        </Link>
        <Link href={'/upcomingVisitors'}>
          <div className={isLoggedIn ? "lg:flex items-center justify-center flex-col py-9 border-2 rounded-md shadow-sm hover:border-black transition-all duration-400 hover:shadow-lg" : "hidden"}>
            <div className="text-2xl">
              <IoLocationOutline />
            </div>
            <div className="font-bold">Upcoming Visits</div>
            <div className="text-[13px]">Visitors Coming to Meet</div>
          </div>
        </Link>
      </div>
      <div className=  "w-screen px-5"  >
        <Link href={'/pendingRequests'}>
          <div className="w-full mt-1 lg:flex items-center justify-center flex-col py-9 border-2 rounded-md shadow-sm hover:border-black transition-all duration-400 hover:shadow-lg">
            <div className="text-2xl">
              <RiMailSettingsLine />
            </div>
            <div className="font-bold">Visit Requests</div>
            <div className="text-[13px]">Pending Requests</div>
          </div>
        </Link>
      </div>
      <div className={isLoggedIn ? "grid grid-cols-2 w-screen" : "hidden"}>
        <div className={isLoggedIn ? "m-5 pt-5 text-center border-2 py-5 rounded-lg shadow-md h-full" : "hidden"}>
          <div className="font-bold text-2xl">Checked In</div>
          <div className='flex flex-col justify-center items-center'>
            {checkedInEntries.map((entry, index) => (
              <VisitorCheckedCard key={index} name={entry.name} time={entry.checkedInTime} email={entry.email}/>
            ))}
          </div>
        </div>
        <div className=" m-5 pt-5 text-center border-2 py-5 rounded-lg shadow-md h-full">
          <div className="font-bold text-2xl">Scheduled Appointments</div>
          <div className='flex flex-col justify-center items-center'>
            {pendingApprovals.map((approval, index) => (
              <VisitorUpcomingCard key={index} name={approval.name} time={approval.time} email={approval.email} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorOverview;
