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
import { Select, SelectItem } from '@nextui-org/react';
import { TimeFrames } from "@/data"
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
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<string>('');

  // Helper function to calculate the current week
  const getCurrentWeek = (date: Date): number => {
    const dayOfMonth = date.getDate();
    return Math.ceil(dayOfMonth / 7); // Week number (1-5)
  };

  // Function to fetch the weekly visitors data from Firebase
  const fetchWeeklyVisitors = async (year: string, month: string, week: number) => {
    const db = getDatabase();
    const weeklyVisitorsRef = ref(db, `weeklyVisitors/${year}-${month}/week${week}`);

    try {
      const snapshot = await get(weeklyVisitorsRef);
      if (snapshot.exists()) {
        const visitorCount = snapshot.val();
        console.log(`Visitor count for week ${week} of ${month}-${year}: ${visitorCount}`);
        setVisitorCount(visitorCount);
      } else {
        console.log(`No data found for week ${week} of ${month}-${year}`);
        setVisitorCount(0);
      }
    } catch (error) {
      console.error('Error fetching weekly visitors:', error);
      setVisitorCount(0);
    }
  };

  useEffect(() => {
    const now = new Date();

    // Get the current year, month, and week
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 1-based, padded to 2 digits
    const week = getCurrentWeek(now);

    setCurrentYear(year);
    setCurrentMonth(month);
    setCurrentWeek(week);

    // Fetch data for the current week
    fetchWeeklyVisitors(year, month, week);
  }, []);



  type TimeFrame = 'Week' | 'Month' | 'Year';  // Valid time frames
  const [TimeFrame, setTimeFrame] = useState<TimeFrame>("Week");  // Set default to '' (or 'Week' if preferred)

  // Handle the select change
  const handleTimeFrameChange = (value: string) => {
    if (value === 'Week' || value === 'Month' || value === 'Year') {
      setTimeFrame(value as TimeFrame);
    }
  }


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
              {visitorCount}
            </div>
          </div>
        </div>
      </div>
      <div className='w-screen flex items-center justify-center flex-col'>
        <div className=' w-[1100px] mb-1'>
          <Select
            label="Time Period"
            placeholder="Select a time frame"
            className="w-48 pt-5"
            value={TimeFrame}
            variant="bordered"
            onChange={(e) => handleTimeFrameChange(e.target.value)}
          >
            {TimeFrames.map((dept) => (
              <SelectItem key={dept.key} value={dept.key}>
                {dept.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className='w-[1100px] border-2 shadow-md  rounded-md  relative flex flex-row justify-center items-centers'>

          <div className=' absolute bg-teal-300 h-14 w-full flex items-center justify-center font-bold text-2xl text-gray-50 shadow-sm'>
            Visitor Trend
          </div>
          <div className='pl-3 pt-7'>
            <VisitorTrendChart timeFrame={TimeFrame} />
          </div>
        </div>

        <div className='w-[1100px] border-2 shadow-md p-3 rounded-md  relative flex flex-row justify-center items-centers'>
          <div className=' absolute bg-orange-300 h-14 w-full flex items-center justify-center font-bold text-2xl text-gray-50 shadow-sm'>
            Type Of Visitors
          </div>
          <div className='pl-3 pt-7'>
            <VisitorTypesChart timeFrame={TimeFrame}/>
          </div>
        </div>
        <div className='w-[1100px] border-2 shadow-md p-3 rounded-md  relative flex flex-row justify-center items-centers'>
          <div className=' absolute bg-pink-300 h-14 w-full flex items-center justify-center font-bold text-2xl text-gray-50 shadow-sm'>
            Pre Registered Visitors
          </div>
          <div className='pl-3 pt-7'>
            <PreRegisterVisitorChar />
          </div>
        </div>
        <div className='w-[1100px] border-2 shadow-md  rounded-md m-3 relative flex flex-row justify-center items-centers'>
          <div className=' absolute bg-blue-300 h-14 w-full flex items-center justify-center font-bold text-2xl text-gray-50 shadow-sm'>
            Visitors Per Department
          </div>
          <div className='pl-3 pt-7'>
            <VisitorsPerDepartment />
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-5 mt-10 mb-10 w-screen">
        <div className="text-center border-2 py-5 rounded-lg shadow-md">
          <div className="font-bold text-2xl">Checked In</div>
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
        <div className="text-center border-2 py-5 rounded-lg shadow-md">
          <div className="font-bold text-2xl">Scheduled Appointments</div>
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