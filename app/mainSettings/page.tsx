'use client';
import React, { useEffect, useState } from 'react';
import { ref, get, set, push, child } from "firebase/database";
import { auth, database } from '@/firebase';
import TopBar from '@/components/topBar';
import { FaPencilAlt } from "react-icons/fa";
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { IoMail } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { departments } from "@/data";
import Email from "@/public/email.json";
import { FaUserLock } from "react-icons/fa";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"
import { Select, SelectItem } from '@nextui-org/react';
import { getDatabase } from "firebase/database";

const Page = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentMasterEmail, setCurrentMasterEmail] = useState('');
  const [currentHrEmail, setCurrentHrEmail] = useState('');
  const [newMasterEmail, setNewMasterEmail] = useState('');
  const [newDepartmentEmail, setNewDepartmentEmail] = useState('');
  const [isEditingMasterEmail, setIsEditingMasterEmail] = useState(false);
  const [isEditingDepartmentEmail, setIsEditingDepartmentEmail] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [admin, setAdmin] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [takePassword, settakePassword] = useState(false);


  // Function to create the user account in the firebase without logging out the current user 
  const [SignInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  const takePasswordfromUser = async () => {
    settakePassword(true);
  }

  const makeANewUser = async () => {
    try {
      settakePassword(false);
      signOut(auth)
      const res = await SignInWithEmailAndPassword(email, password)
      if (res) {
        const res = await createUserWithEmailAndPassword(newEmail, "123456");
        if (res) {
          signOut(auth)
          const res = await SignInWithEmailAndPassword(email, password)
        }
      }

      // logic for creating a new account
    } catch (error) {
    }
    addAccount();
    const db = getDatabase();
    set(ref(db, 'users/' + newEmail.split('@')[0]), {
      username: newEmail.split('@')[0],
      email: newEmail,
      department: department
    });
  }

  //  This code is for api that adds and removes emails from email.json in public folder
  const fetchAccounts = async () => {
    const response = await fetch("/email.json");
    const data = await response.json();
    setAccounts(data.accounts);
  };

  const addAccount = async () => {
    if (!newEmail)

      try {
        const response = await fetch('/api/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newEmail, department }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data.message); // "User created successfully!"
        } else {
          console.error('Error:', data.error);
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }

    const response = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail }),
    });

    const result = await response.json();
    if (response.ok) {
      setAccounts(result.data.accounts);
      setNewEmail("");
      // alert(result.message);
    } else {
      // alert(result.message);
    }
  };

  const removeAccount = async () => {
    if (!deleteEmail) return alert("Please enter an email");

    const response = await fetch("/api/accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: deleteEmail }),
    });

    const result = await response.json();
    if (response.ok) {
      setAccounts(result.data.accounts);
      setDeleteEmail("");
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);
  // API code ends here



  useEffect(() => {
    const dbRef = ref(database);

    // Fetch user details
    const fetchUserDetails = async (userEmail: string) => {
      try {
        const usernameSnapshot = await get(child(dbRef, `users/${userEmail.split("@")[0]}/username`));
        if (usernameSnapshot.exists()) {
          setUsername(usernameSnapshot.val());
        } else {
          console.log("No username data available.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    // Fetch department email
    const fetchDepartmentEmail = async (department: string) => {
      if (!department) return;
      try {
        const departmentEmailSnapshot = await get(child(dbRef, `departments/${department}/email`));
        if (departmentEmailSnapshot.exists()) {
          setCurrentHrEmail(departmentEmailSnapshot.val());
        } else {
          setCurrentHrEmail('');
          console.log("No department email data available.");
        }
      } catch (error) {
        console.error("Error fetching department email:", error);
      }
    };

    // Handle auth state change
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        setEmail(user.email);
        fetchUserDetails(user.email);
      }
    });

    // Update HR email when department changes
    if (selectedDepartment) fetchDepartmentEmail(selectedDepartment);

    return () => unsubscribe();
  }, [selectedDepartment]);

  // Handle master email change
  const handleMasterEmailChange = async () => {
    if (!newMasterEmail) return;

    const emailRef = ref(database, 'currenMasterEmail');
    const logsRef = ref(database, 'logs');

    try {
      await set(emailRef, newMasterEmail);
      await push(logsRef, {
        email: newMasterEmail,
        changedAt: new Date().toISOString(),
      });
      setCurrentMasterEmail(newMasterEmail);
      setNewMasterEmail('');
      setIsEditingMasterEmail(false);
      toast.success('Master Email Changed Successfully');
    } catch (error) {
      console.error("Error updating master email:", error);
      toast.error('Failed to change master email.');
    }
  };

  // Handle department email change
  const handleDepartmentEmailChange = async () => {
    if (!newDepartmentEmail || !selectedDepartment) return;

    const departmentEmailRef = ref(database, `departments/${selectedDepartment}/email`);

    try {
      await set(departmentEmailRef, newDepartmentEmail);
      setCurrentHrEmail(newDepartmentEmail);
      setNewDepartmentEmail('');
      setIsEditingDepartmentEmail(false);
      toast.success('Department Email Changed Successfully');
    } catch (error) {
      console.error("Error updating department email:", error);
      toast.error('Failed to change department email.');
    }
  };
  useEffect(() => {
    if (Email.admins.includes(email)) {
      setAdmin(true);
    } else {
      setAdmin(false);
    }

  }, [email])



  return (
    <div className='mb-10'>
      <TopBar pageName='Settings' />
      <div className='font-bold text-2xl m-5'>Profile Management</div>
      <div className='w-screen px-5'>
        <div className='w-full border-2 flex justify-center items-center p-2 px-5 rounded-md h-16'>
          <div className='flex flex-row gap-4 text-2xl'>
            <FaPencilAlt />
            <span className='text-xl'>Admin:</span>
            <span className='text-xl'>{username || "Loading..."}</span>
          </div>
          <Button className='ml-auto w-32' variant='ghost' as={Link} href='/adminSettings'>Manage</Button>
        </div>
      </div>

      <div className='font-bold text-2xl m-5 mt-10'>Notifications</div>
      <div className={admin ? 'w-screen flex justify-between items-center px-5' : "hidden"}>
        <div className='w-full border-2 flex items-center rounded-lg p-5 shadow-sm'>
          <div className='flex flex-col gap-2 text-xl p-2 px-5 rounded-md'>
            <div className='flex items-center gap-2'>
              <IoMail />
              <span>Master Verification Email</span>
            </div>
            <span className='text-gray-600 ml-6'>{currentMasterEmail}</span>
          </div>
          {isEditingMasterEmail ? (
            <div className='flex items-center gap-2'>
              <input
                type="email"
                placeholder="Enter new master email"
                value={newMasterEmail}
                onChange={(e) => setNewMasterEmail(e.target.value)}
                className='border-2 px-2 py-2 rounded-lg'
              />
              <Button onClick={handleMasterEmailChange} variant='ghost' color='primary'>Save</Button>
            </div>
          ) : (
            <Button className='ml-auto w-32' variant='ghost' onClick={() => setIsEditingMasterEmail(true)}>Change</Button>
          )}
        </div>
      </div>

      <div className={admin ? 'w-screen flex justify-between items-center px-5 mt-5' : "hidden"}>
        <div className='w-full border-2 flex items-center rounded-lg p-5 shadow-sm'>
          <div className='flex flex-col gap-2 text-xl p-2 px-5 rounded-md w-3/4'>
            <div className='flex items-center gap-2'>
              <IoMail />
              <span>Department Email</span>
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className='border-2 px-2 py-2 rounded-lg mt-2'
            >
              <option value="" disabled>Select Department</option>
              {departments.map(dept => (
                <option key={dept.key} value={dept.key}>
                  {dept.label}
                </option>
              ))}
            </select>
            <span className='text-gray-600 ml-6 mt-2'>
              {currentHrEmail || 'Select a department to view email'}
            </span>
          </div>
          {isEditingDepartmentEmail ? (
            <div className='flex items-center gap-2'>
              <input
                type="email"
                placeholder="Enter new department email"
                value={newDepartmentEmail}
                onChange={(e) => setNewDepartmentEmail(e.target.value)}
                className='border-2 px-2 py-2 rounded-lg'
              />
              <Button onClick={handleDepartmentEmailChange} variant='ghost' color='primary'>Save</Button>
            </div>
          ) : (
            <Button
              className='ml-auto w-32'
              variant='ghost'
              onClick={() => setIsEditingDepartmentEmail(true)}
              disabled={!selectedDepartment}
            >
              Change
            </Button>
          )}
        </div>
      </div>

      {/* Ui for adding and removing emails */}
      <div className={admin ? '' : "hidden"}>
        <div className="">
          <h1 className="text-2xl font-bold pt-5 pl-5">Manage Accounts</h1>

          {/* Display Accounts */}
          <div className="mb-6 w-screen p-5">
            <div className='w-full border-2 p-10 rounded-md'>
              <h2 className="text-xl font-bold flex gap-2"><FaUserLock className='text-3xl' />Current Accounts:</h2>
              <ul className="list-disc list-inside p-5">
                {accounts.map((email, index) => (
                  <li key={index}>{email}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Add Account */}
          <div className="mb-4 p-5">
            <h2 className="text-xl font-bold">Add Account:</h2>
            <div className='flex  '>
              <input
                type="email"
                placeholder="Enter email to add"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border p-2 mt-5 rounded-md mr-2 h-14 "
              />
              <Select
                label="Department"
                placeholder="Select a Department"
                className="w-full pt-5 mb-4"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <SelectItem key={dept.key} value={dept.key}>
                    {dept.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <button onClick={takePasswordfromUser} className="bg-blue-400 font-bold text-white px-4 py-2 rounded w-32">
              Add
            </button>
            <div className={takePassword ? "" : "hidden"}>
              <input
                type="password"
                placeholder="Enter your account password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="border p-2 mt-5 rounded-md mr-2 h-14 w-[250px]"
              />
              <Button className='ml-auto' variant='ghost' onClick={makeANewUser}>Continue</Button>
            </div>
          </div>

          {/* Remove Account */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Remove Account:</h2>
            <input
              type="email"
              placeholder="Enter email to remove"
              value={deleteEmail}
              onChange={(e) => setDeleteEmail(e.target.value)}
              className="border p-2 mr-2"
            />
            <button onClick={removeAccount} className="bg-red-500 text-white px-4 py-2 rounded">
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className={!admin ? 'w-screen  pl-10 font-bold text-xl' : "hidden"}>
        You are not an admin
      </div>

      <div className='font-bold text-2xl m-5 mt-10'>Security Settings</div>
      <div className='w-screen flex justify-between items-center px-5 mt-3'>
        <Link href="/">
          <div className='flex flex-row gap-4 text-xl'>
            <div className='mt-1'>
              <FaLock />
            </div>
            <span className='text-xl'>Change Password</span>
          </div>
        </Link>
        <Button className='ml-auto' variant='ghost'>Change</Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Page;
