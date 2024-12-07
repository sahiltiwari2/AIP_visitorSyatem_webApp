'use client'
import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, query, remove, set } from "firebase/database";
import { Accordion, AccordionItem, Button, Select, SelectItem } from "@nextui-org/react";
import TopBar from "@/components/topBar";
import { departments } from "@/data";
import { auth } from '@/firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Page = () => {
  type AppointmentEntry = {
    id?: string; // Optional `id` to identify entries
    name: string;
    timeOfVist: string;
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
  const dbRef = ref(getDatabase());
  const [pendingApprovals, setPendingApprovals] = useState<AppointmentEntry[]>([]);
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email || "")
      }
    });
    const fetchPendingApprovals = async () => {
      const db = getDatabase();
      const starCountRef = ref(db, 'users/' + email.split("@")[0] + '/department');
      onValue(starCountRef, (snapshot) => {
         setDepartment(snapshot.val());
      });


      if (!department) {
        setPendingApprovals([]);
        return;
      }

      const departmentRef = ref(db, `appointmentsPending/${department}`);

      onValue(departmentRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val() as Record<string, AppointmentEntry>;

          const approvals: AppointmentEntry[] = Object.entries(data).map(
            ([id, entry]) => ({
              id,
              ...(entry as AppointmentEntry),
            })
          );

          setPendingApprovals(approvals);
        } else {
          setPendingApprovals([]);
        }
      });
    };

    fetchPendingApprovals();
  }, [department]);

  const handleReject = async (entryId: string) => {
    const db = getDatabase();
    try {
      const pendingRef = ref(db, `appointmentsPending/${department}/${entryId}`);
      await remove(pendingRef);

      setPendingApprovals((prev) => prev.filter((item) => item.id !== entryId));
    } catch (error) {
      console.error("Error rejecting appointment:", error);
    }
  };


  const handleApprove = async (entryId: string, entry: AppointmentEntry) => {
    const db = getDatabase();
    try {
      // Add entry to approvedAppointments
      const approvedRef = ref(db, "approvedAppointments/" + entryId);
      await set(approvedRef, entry);

      // Remove entry from appointmentsPending/<department>
      const pendingRef = ref(db, `appointmentsPending/${department}/${entryId}`);
      await remove(pendingRef);

      // Update the local state
      setPendingApprovals((prev) => prev.filter((item) => item.id !== entryId));
    } catch (error) {
      console.error("Error approving appointment:", error);
    }
  };

  return (
    <div>
      <TopBar pageName="Pending Approvals" />
      {/* {email} */}
      {/* <Select
        label="Department"
        placeholder="Select a Department"
        className="w-[250px] pt-5 m-5"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        {departments.map((department) => (
          <SelectItem key={department.key} value={department.key}>
            {department.label}
          </SelectItem>
        ))}
      </Select> */}
      <div className="mt-4 space-y-6 flex flex-col items-center w-screen ">
        {pendingApprovals.map((entry, index) => (
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
                {entry.timeOfVist}
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
                  Accept
                </Button>
                <Button variant="ghost" color="warning" className="w-36 h-11" onClick={() => handleReject(entry.id!)}>
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
