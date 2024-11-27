'use client';

import React, { useEffect, useState } from 'react';
import PreRegisterVisitorChar from '@/components/preRegisterVisitorChar';
import VisitorTrendChart from '@/components/VisitorTrendChart';
import TopBar from '@/components/topBar';
import VisitorsPerDepartment from '@/components/VisitorPerDepartmentChart';
import VisitorTypesChart from '@/components/TypesOfVisitors';
import { equalTo, get, getDatabase, limitToLast, onValue, orderByChild, query, ref } from 'firebase/database';
import VisitorCheckedCard from '@/components/visitorCheckedin' // Ensure these are defined or imported
import VisitorUpcomingCard from '@/components/visitorUpcomingCard';

const DashboardPage = () => {
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
    checkedInTime: string;
  };

  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [checkedInEntries, setCheckedInEntries] = useState<CheckedInEntry[]>([]);
  const [todaysVisitor, setTodaysVisitor] = useState<number>(0);

  useEffect(() => {

    const fetchTodayVisitorCount = async () => {
      const db = getDatabase();
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const todayVisitorsRef = ref(db, `todayVisitors/${today}`);
    
      try {
        const snapshot = await get(todayVisitorsRef);
        if (snapshot.exists()) {
          setTodaysVisitor(snapshot.val());
        } else {
          setTodaysVisitor(0); // No data for today, set to 0
        }
      } catch (error) {
        console.error("Error fetching today's visitor count:", error);
      }
    }
    // Fetch pending approvals
    const fetchPendingApprovals = () => {
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
    const fetchCheckedInEntries = () => {
      const db = getDatabase();
      const checkedInRef = ref(db, 'checkedIn');

      const checkedInQuery = query(checkedInRef, limitToLast(3));

      onValue(checkedInQuery, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, CheckedInEntry>;

          const checkedInList: CheckedInEntry[] = Object.values(data).map((entry) => ({
            name: entry.name,
            checkedInTime: entry.checkedInTime,
          }));

          setCheckedInEntries(checkedInList);
        } else {
          setCheckedInEntries([]);
        }
      });
    };

    fetchPendingApprovals();
    fetchCheckedInEntries();
    fetchTodayVisitorCount();
  }, []);

  return (
    <div>
      <TopBar pageName='Dashboard' />
      <div className='grid grid-cols-2 w-screen '>
        <div className='w-full px-5 py-5'>
          <div className='flex flex-col justify-center border-2 py-3 px-10 rounded-md shadow-md'>
            <div className='font-bold text-xl'>
              Visitors Today
            </div>
            <div>
            {todaysVisitor}
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
        <div className='w-[1100px] border-2 shadow-md p-3 rounded-md m-3'>
          <VisitorTrendChart />
        </div>
        <div className='w-[1100px] border-2 shadow-md p-3 rounded-md m-3'>
          <VisitorTypesChart />
        </div>
        <div className='w-[1100px] border-2 shadow-md p-3 rounded-md m-3'>
          <PreRegisterVisitorChar />
        </div>
        <div className='w-[1100px] border-2 shadow-md p-3 rounded-md m-3'>
          <VisitorsPerDepartment />
        </div>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-5 mt-10 mb-10 w-screen">
        <div className="text-center ">
          <div className="font-bold text-2xl mb-3">Checked In</div>
          <div className="flex flex-col items-center">
            {checkedInEntries.length > 0 ? (
              checkedInEntries.map((entry, index) => (
                <VisitorCheckedCard key={index} name={entry.name} time={entry.checkedInTime} />
              ))
            ) : (
              <p>No checked-in visitors.</p>
            )}
          </div>
        </div>
        <div className="text-center">
          <div className="font-bold text-2xl mb-3">Scheduled Appointments</div>
          <div className="flex flex-col items-center">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((approval, index) => (
                <VisitorUpcomingCard key={index} name={approval.name} time={approval.time} />
              ))
            ) : (
              <p>No pending approvals.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
