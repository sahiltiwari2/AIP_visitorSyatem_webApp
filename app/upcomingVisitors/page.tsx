'use client';

import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, set, remove, get, child } from 'firebase/database';
import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import TopBar from '@/components/topBar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { departments } from '@/data';

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
  const dbRef = ref(getDatabase());
  const [appointments, setAppointments] = useState<AppointmentEntry[]>([]);
  const [currentDate, setCurrentDate] = useState<string>('');
  const [userDepartment, setUserDepartment] = useState('');
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      }
    });
    
    const updateCurrentDate = () => {
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
      setCurrentDate(formattedDate);
    };

    updateCurrentDate();
  }, []);
  if (email) {
    get(child(dbRef, `users/${email.split("@")[0]}/department`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        setUserDepartment(snapshot.val());
      } else {
        console.log("No user data available");
      }
    })
  }

  // useEffect(() => {
  //   const db = getDatabase();
  //   const appointmentsRef = ref(db, 'approvedAppointments');

  //   onValue(appointmentsRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       const data = snapshot.val() as Record<string, AppointmentEntry>;
  //       const fetchedAppointments: AppointmentEntry[] = Object.entries(data).map(
  //         ([id, entry]) => ({
  //           id,
  //           ...entry,
  //         })
  //       );

  //       // Filter appointments to show only those in the future
  //       const filteredAppointments = fetchedAppointments.filter(
  //         (appointment) => appointment.dateOfVisit > currentDate
  //       );

  //       // Sort appointments by date in ascending order (earliest date first)
  //       const sortedAppointments = filteredAppointments.sort((a, b) =>
  //         a.dateOfVisit.localeCompare(b.dateOfVisit)
  //       );

  //       setAppointments(sortedAppointments);
  //     } else {
  //       setAppointments([]);
  //     }
  //   });
  // }, [currentDate]);

  useEffect(() => {
    const db = getDatabase();
    const appointmentsRef = ref(db, 'approvedAppointments');
  
    onValue(appointmentsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, AppointmentEntry>;
        const fetchedAppointments: AppointmentEntry[] = Object.entries(data).map(
          ([id, entry]) => ({
            id,
            ...entry,
          })
        );
  
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0];
  
        // Filter appointments to show only those with a future date and matching department
        const filteredAppointments = fetchedAppointments.filter(
          (appointment) =>
            appointment.dateOfVisit > currentDate &&
            appointment.departmentOfWork === userDepartment // Check department
        );
  
        // Optionally sort appointments by date (earliest first)
        const sortedAppointments = filteredAppointments.sort((a, b) =>
          a.dateOfVisit.localeCompare(b.dateOfVisit)
        );
  
        setAppointments(sortedAppointments);
      } else {
        setAppointments([]);
      }
    });
  }, [userDepartment]); // Add userDepartment as a dependency
  
  
  

  const handleApprove = async (entryId: string, entry: AppointmentEntry) => {
    const db = getDatabase();
    try {
      // Add entry to checkedIn with the current time
      const approvedRef = ref(db, `checkedIn/${entryId}`);
      await set(approvedRef, {
        ...entry,
        checkedInTime: new Date().toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: false,
        }),
      });

      // Remove entry from approvedAppointments
      const pendingRef = ref(db, `approvedAppointments/${entryId}`);
      await remove(pendingRef);

      // Update the local state
      setAppointments((prev) => prev.filter((item) => item.id !== entryId));
    } catch (error) {
      console.error('Error approving appointment:', error);
    }
  };

  return (
    <div>     
      <TopBar pageName="Future Visitors" />
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
                    className="w-[500px]"
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
              {/* <div className="flex gap-2">
                <Button
                  variant="ghost"
                  color="success"
                  className="w-36 h-11"
                  onClick={() => handleApprove(entry.id!, entry)}
                >
                  Check In Now
                </Button>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;