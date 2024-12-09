'use client';

import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set, remove, query, get } from 'firebase/database';
import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import TopBar from '@/components/topBar';
import VisitorCheckedCard from '@/components/visitorCheckedin';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

type AppointmentEntry = {
  id?: string;
  name: string;
  timeOfVisit: string;
  email: string;
  phonenumber: number;
  dateOfVisit: string;
  purposeOfVisit: string;
  numberOfVisitors: number;
  visitorsNames?: Record<string, string>;
  visitorsEmails?: Record<string, string>;
  visitorsNumbers?: Record<string, string>;
  representativeEmail: string;
  departmentOfWork: string;
  approvalStatus: string;
};

const Page = () => {
  const [appointments, setAppointments] = useState<AppointmentEntry[]>([]);
  const [timeNow, setTimeNow] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [userEmail, setUserEmail] = useState("");
  const [userDepartment, setUserDepartment] = useState("");

  type CheckedInEntry = {
    checkedInTime: string; // Updated to use checkedInTime
    id?: string;
    name: string;
    timeOfVisit: string;
    email: string;
    phonenumber: number;
    dateOfVisit: string;
    purposeOfVisit: string;
    numberOfVisitors: number;
    visitorsNames?: Record<string, string>;
    visitorsEmails?: Record<string, string>;
    visitorsNumbers?: Record<string, string>;
    representativeEmail: string;
    departmentOfWork: string;
    approvalStatus: string;
  };

  const [checkedInEntries, setCheckedInEntries] = useState<CheckedInEntry[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email || "")
      }
    });
    const db = getDatabase();
    const starCountRef = ref(db, 'users/' + userEmail.split("@")[0] + '/department');
    onValue(starCountRef, (snapshot) => {
      setUserDepartment(snapshot.val());
    });
    const updateCurrentTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
      setTimeNow(formattedTime);

      const formattedDate = now.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      setCurrentDate(formattedDate);
    };

    // Update the time immediately on load
    updateCurrentTime();

    // Optional: Update time every second
    const interval = setInterval(updateCurrentTime, 1000);

    // Cleanup the interval on component unmount


    const fetchCheckedInEntries = async () => {
      const db = getDatabase();
      const checkedInRef = ref(db, 'checkedIn');

      const checkedInQuery = query(checkedInRef);

      onValue(checkedInQuery, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, CheckedInEntry>;

          const checkedInList: CheckedInEntry[] = Object.values(data).map((entry) => ({
            name: entry.name,
            checkedInTime: entry.checkedInTime,
            id: entry.id,
            timeOfVisit: entry.timeOfVisit,
            email: entry.email,
            phonenumber: entry.phonenumber,
            dateOfVisit: entry.dateOfVisit,
            purposeOfVisit: entry.purposeOfVisit,
            numberOfVisitors: entry.numberOfVisitors,
            visitorsNames: entry.visitorsNames,
            visitorsEmails: entry.visitorsEmails,
            visitorsNumbers: entry.visitorsNumbers,
            representativeEmail: entry.representativeEmail,
            departmentOfWork: entry.departmentOfWork,
            approvalStatus: entry.approvalStatus,
          }));

          // Filter only entries with today's date
          const todayCheckedInEntries = checkedInList.filter(
            (entry) => entry.dateOfVisit === currentDate
          );

          setCheckedInEntries(todayCheckedInEntries);

          setCheckedInEntries(checkedInList);
        } else {
          console.log("No checked-in data found.");
          setCheckedInEntries([]);
        }
      });
    };
    fetchCheckedInEntries();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const appointmentsRef = ref(db, 'approvedAppointments');

    const initializeDailyVisitors = async () => {
      const db = getDatabase();
      const todayVisitorsRef = ref(db, `todayVisitors/${currentDate}`);

      // Check if there is an entry for today
      const snapshot = await get(todayVisitorsRef);
      if (!snapshot.exists()) {
        // If no entry, initialize with 0
        await set(todayVisitorsRef, 0);
      }
    };
    initializeDailyVisitors();

    onValue(appointmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, AppointmentEntry>;
        const fetchedAppointments: AppointmentEntry[] = Object.entries(data).map(
          ([id, entry]) => ({
            id,
            ...entry,
          })
        );

        // Filter appointments to show only those for the current date
        const filteredAppointments = fetchedAppointments.filter(
          (appointment) => appointment.dateOfVisit === currentDate
        );

        setAppointments(filteredAppointments);
      } else {
        setAppointments([]);
      }
    });
  }, [currentDate]);

  const handleCheckOut = async (entryId: string) => {
    const db = getDatabase();
    try {
      const now = new Date();
      const formattedTime = now.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
  
      const checkedInRef = ref(db, `checkedIn/${entryId}`);
      const snapshot = await get(checkedInRef);
  
      if (snapshot.exists()) {
        const entry = snapshot.val();
  
        // Move the entry to the `checkedOut` section with checkout time
        const checkedOutRef = ref(db, `checkedOut/${entryId}`);
        await set(checkedOutRef, {
          ...entry,
          checkedOutTime: formattedTime, // Add checkout time
        });
  
        // Remove the entry from the `checkedIn` section
        await remove(checkedInRef);
  
        console.log(`Checked out and moved to checkedOut section at ${formattedTime}`);
  
        // Update local state to remove the checked-out entry
        setCheckedInEntries((prevEntries) =>
          prevEntries.filter((item) => item.id !== entryId)
        );
      } else {
        console.error('Entry not found in database.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };
  

  const handleApprove = async (entryId: string, entry: AppointmentEntry) => {
    const db = getDatabase();
    try {
      // Add entry to checkedIn with the current time
      const approvedRef = ref(db, `checkedIn/${entryId}`);
      await set(approvedRef, {
        ...entry,
        checkedInTime: timeNow, // Add the current time as checkedInTime
      });

      // Remove entry from approvedAppointments
      const pendingRef = ref(db, `approvedAppointments/${entryId}`);
      await remove(pendingRef);

      // Determine the week number
      const dayOfMonth = new Date().getDate();
      const weekNumber = Math.ceil(dayOfMonth / 7); // Calculate week number (1-4)

      // Increment today's visitor count
      const todayVisitorsRef = ref(db, `todayVisitors/${currentDate}`);
      const snapshot = await get(todayVisitorsRef);
      const currentCount = snapshot.exists() ? snapshot.val() : 0;
      await set(todayVisitorsRef, currentCount + 1);

      // Increment the week's visitor count
      const weekVisitorsRef = ref(db, `weeklyVisitors/${currentDate.slice(0, 7)}/week${weekNumber}`);
      const weekSnapshot = await get(weekVisitorsRef);
      const currentWeekCount = weekSnapshot.exists() ? weekSnapshot.val() : 0;
      await set(weekVisitorsRef, currentWeekCount + 1);

      // Update the local state
      setAppointments((prev) => prev.filter((item) => item.id !== entryId));
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };



  return (
    <div>
      <TopBar pageName="Today's Visitors" />
      <div className="mt-4 space-y-6 flex flex-col items-center w-screen">
        {appointments.map((entry, index) => (
          <div key={entry.id || index} className="border-2 p-4 rounded shadow-sm">
            <div className="text-2xl font-semibold">Name: {entry.name}</div>
            <div className="flex gap-8 mt-5">
              <div>
                <span className="font-semibold">Email: </span>
                {entry.email}
              </div>
              <div>
                <span className="font-semibold">Phone Number: </span>
                {entry.phonenumber}
              </div>
              <div>
                <span className="font-semibold">Date of Visit: </span>
                {entry.dateOfVisit}
              </div>
              <div>
                <span className="font-semibold">Time of Visit: </span>
                {entry.timeOfVisit}
              </div>
            </div>
            <div className="flex gap-8 mt-3">
              <div>
                <span className="font-semibold">Number of Visitors: </span>
                {entry.numberOfVisitors}
              </div>
              <div>
                <span className="font-semibold">Representative Email: </span>
                {entry.representativeEmail}
              </div>
              <div>
                <span className="font-semibold">Department of Work: </span>
                {entry.departmentOfWork}
              </div>
              <div>
                <span className="font-semibold">Approval Status: </span>
                {entry.approvalStatus}
              </div>
            </div>
            <div className="mt-3">
              <span className="font-semibold">Purpose of Visit: </span>
              {entry.purposeOfVisit}
            </div>
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="mt-2 border-2 w-[525px] rounded-lg shadow-sm">
                <Accordion variant="shadow">
                  <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    subtitle="Press to expand"
                    title="Visitors Information:"
                    className=" w-[500px]"
                  >
                    {entry.visitorsNames &&
                      Object.keys(entry.visitorsNames).map((key) => (
                        <div key={key} className="ml-4 mb-3">
                          <p>
                            <strong>Visitor Name:</strong> {entry.visitorsNames![key]}
                          </p>
                          <p>
                            <strong>Visitor Email:</strong> {entry.visitorsEmails?.[key]}
                          </p>
                          <p>
                            <strong>Visitor Number:</strong> {entry.visitorsNumbers?.[key]}
                          </p>
                        </div>
                      ))}
                  </AccordionItem>
                </Accordion>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  color="success"
                  className="w-36 h-11"
                  onClick={() => handleApprove(entry.id!, entry)}
                >
                  Checked In
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className=" pt-5 ">
        <div className="font-bold text-2xl mt-10 ml-10">Checked In Today</div>
        {/* <div className='flex flex-col justify-center   ml-10'>
          {checkedInEntries.map((entry, index) => (
            <VisitorCheckedCard key={index} name={entry.name} time={entry.checkedInTime} />
          ))}
        </div> */}
      </div>


      {/* From Old code */}

      <div className="flex flex-col items-center w-screen px-32 pt-10">
        <div className='w-full  flex flex-col items-center space-y-6'>
          {checkedInEntries.map((entry, index) => (
            <div key={entry.id || index} className="border-2 p-4 rounded shadow-sm w-full">
              <div className="text-2xl font-semibold">Name: {entry.name}</div>
              <div className="flex gap-8 mt-5">
                <div>
                  <span className="font-semibold">Email: </span>
                  {entry.email}
                </div>
                <div>
                  <span className="font-semibold">Phone Number: </span>
                  {entry.phonenumber}
                </div>
                <div>
                  <span className="font-semibold">Date of Visit: </span>
                  {entry.dateOfVisit}
                </div>
                <div>
                  <span className="font-semibold">Time of Visit: </span>
                  {entry.timeOfVisit}
                </div>
              </div>
              <div className="flex gap-8 mt-3">
                <div>
                  <span className="font-semibold">Number of Visitors: </span>
                  {entry.numberOfVisitors}
                </div>
                <div>
                  <span className="font-semibold">Representative Email: </span>
                  {entry.representativeEmail}
                </div>
                <div>
                  <span className="font-semibold">Department of Work: </span>
                  {entry.departmentOfWork}
                </div>
                <div>
                  <span className="font-semibold">Approval Status: </span>
                  {entry.approvalStatus}
                </div>
              </div>
              <div className="mt-3">
                <span className="font-semibold">Purpose of Visit: </span>
                {entry.purposeOfVisit}
              </div>
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="mt-2 border-2 w-[525px] rounded-lg shadow-sm">
                  <Accordion variant="shadow">
                    <AccordionItem
                      key="1"
                      aria-label="Accordion 1"
                      subtitle="Press to expand"
                      title="Visitors Information:"
                      className=" w-[500px]"
                    >
                      {entry.visitorsNames &&
                        Object.keys(entry.visitorsNames).map((key) => (
                          <div key={key} className="ml-4 mb-3">
                            <p>
                              <strong>Visitor Name:</strong> {entry.visitorsNames![key]}
                            </p>
                            <p>
                              <strong>Visitor Email:</strong> {entry.visitorsEmails?.[key]}
                            </p>
                            <p>
                              <strong>Visitor Number:</strong> {entry.visitorsNumbers?.[key]}
                            </p>
                          </div>
                        ))}
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    color="warning"
                    className="w-36 h-11"
                    onClick={() => handleCheckOut(entry.id!)}
                  >
                    Checked Out
                  </Button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Page;
