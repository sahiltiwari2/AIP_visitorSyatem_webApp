'use client';
import React, { useEffect, useState } from 'react';
import { ref, get, set, push, child } from "firebase/database";
import { departments } from "@/public/department.json";
import { auth, database } from '@/firebase';
import TopBar from '@/components/topBar';
import { FaPencilAlt } from "react-icons/fa";
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { IoMail } from "react-icons/io5";
import { FaLock } from "react-icons/fa6";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import Email from "@/public/email.json";
import { FaUserLock } from "react-icons/fa";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"
import { Select, SelectItem } from '@nextui-org/react';
import { getDatabase } from "firebase/database";
import { Arrow } from '@chakra-ui/react/dist/types/components/hover-card/namespace';

const Page = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [currentMasterEmail, setCurrentMasterEmail] = useState('');
  const [currentHrEmail, setCurrentHrEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');
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
  const [jsondepartments, setJsonDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [deleteDepartment, setDeleteDepartment] = useState("");
  const [departments, setDepartments] = useState([]); // State to store department names
  const [admins, setAdmins] = useState([]);

  // Function to reset password for the user 
  const resetPass = async () => {
    sendPasswordResetEmail(auth, email).then(() => {
      toast.success('Email to reset your password is send !', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
      });
    })
  }

  useEffect(() => {
    // Fetch the departments from the JSON file
    fetch('/department.json')
      .then((response) => response.json())
      .then((data) => setDepartments(data.departments || []))
      .catch((error) => console.error('Error fetching departments:', error));
  }, []);

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
    const firstMailName = newEmail.split('@')[0];
    const finalName = firstMailName.replace(/\./, ">");
    set(ref(db, 'users/' + finalName), {
      username: newEmail.split('@')[0],
      email: newEmail,
      department: selectedDepartment
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

  const handleReplaceAdmin = async () => {
    if (!emailInput) {
      // setMessage("Please enter an email.");
      return;
    }

    try {
      const response = await fetch("/api/updateAdmins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newAdmin: emailInput }),
      });

      if (response.ok) {
        // setMessage("Admin replaced successfully!");
      } else {
        throw new Error("Failed to replace admin");
      }
    } catch (error) {
      console.error(error);
      // setMessage("Error replacing admin.");
    }
  };


  useEffect(() => {
    // Fetch the JSON file from the public folder
    fetch('/department.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch departments.');
        }
        return response.json();
      })
      .then((data) => {
        setJsonDepartments(data.departments || []); // Set the fetched departments
        setLoading(false); // Fetch complete
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
        toast.error('Failed to load departments.');
        setLoading(false); // Stop loading even on error
      });
  }, []);



  // Adding Departments
  const addDepartment = async () => {

    const db = getDatabase();
    set(ref(db, "departments/" + newDepartment), {
      email: "dummy@gmail.com"
    });

    if (!newDepartment) {
      toast.error('Please enter a department name.');
      return;
    }

    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: newDepartment }),
      });

      const data = await response.json();
      if (response.ok) {
        setJsonDepartments(data.departments);
        setNewDepartment('');
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Failed to add department.');
      }
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error('Failed to add department.');
    }
  };

  // Removing Departments from the json 
  const removeDepartment = async () => {
    if (!deleteDepartment) {
      toast.error('Please enter a department name.');
      return;
    }

    try {
      const response = await fetch('/api/departments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: deleteDepartment }),
      });

      const data = await response.json();
      if (response.ok) {
        setJsonDepartments(data.departments);
        setDeleteDepartment('');
        toast.success(data.message);
      } else {
        toast.error(data.error || 'Failed to remove department.');
      }
    } catch (error) {
      console.error('Error removing department:', error);
      toast.error('Failed to remove department.');
    }
  };

  useEffect(() => {
    const dbRef = ref(database);


    // Fetch user details
    const fetchUserDetails = async (userEmail: string) => {
      try {
        const firstMailName = email.split('@')[0];
        const userKey = firstMailName.replace(/\./, ">");
        const usernameSnapshot = await get(child(dbRef, `users/${userKey}/username`));
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
    if (!emailInput) return;

    const emailRef = ref(database, 'departments/masterEmail/email');
    try {
      await set(emailRef, emailInput);
      setCurrentMasterEmail(emailInput);
      setEmailInput('');
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

    const dbRef = ref(getDatabase());
    const firstMailName = email.split('@')[0];
    const FinalName = firstMailName.replace(/\./, ">");
    get(child(dbRef, `users/${FinalName}/username`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setUsername(snapshot.val());
        } else {
          console.log("No user data available");
        }
      })

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
            <span className='text-xl'>{username}</span>
          </div>
          <Button className='ml-auto w-32' variant='ghost' as={Link} href='/adminSettings'>Manage</Button>
        </div>
      </div>

      <div className={admin ? 'font-bold text-2xl m-5 mt-10' : 'hidden'}>Admin Settings</div>
      <div className={admin ? 'w-screen flex justify-between items-center px-5' : "hidden"}>
        <div className='w-full border-2 flex items-center rounded-lg p-5 shadow-sm'>
          <div className='flex flex-col gap-2 text-xl p-2 px-5 rounded-md'>
            <div className='flex items-center gap-2'>
              <IoMail />
              <span>Master Verification Email</span>
            </div>
            <span className='text-gray-600 ml-6'>{admin}</span>
          </div>
          {isEditingMasterEmail ? (
            <div className='flex items-center gap-2'>
              <input
                type="email"
                placeholder="Enter new master email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
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
              className="w-full p-2 border-2 rounded-md mb-5 pt-4 mt-5 pb-4"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)} // Update this line
            >
              <option value="" disabled>
                Select a Department
              </option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
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
              <select
                className="w-full p-2 border-2 rounded-md mb-5 pt-4 mt-5 pb-4"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)} // Update this line
              >
                <option value="" disabled>
                  Select a Department
                </option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

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
          <div className="mb-6 ml-5">
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

      <div className={admin ? '' : "hidden"}>
        <div className="">
          <h1 className="text-2xl font-bold pt-5 pl-5">Current Departmetns</h1>

          {/* Display Departmetns */}
          <div className="mb-6 w-screen p-5">
            <div className='w-full border-2 p-10 rounded-md'>
              <h2 className="text-xl font-bold flex gap-2"><FaUserLock className='text-3xl' />Current Departments:</h2>
              <ul className="list-disc list-inside p-5">
                {jsondepartments.length > 0 ? (
                  jsondepartments.map((department, index) => (
                    <li key={index}>{department}</li>
                  ))
                ) : (
                  <li>Loading...</li>
                )}
              </ul>
            </div>
          </div>

          {/* Add Department */}
          <div className="mb-4 p-5">
            <h2 className="text-xl font-bold">Add Department:</h2>
            <div className='flex gap-2'>
              <input
                type="text"
                placeholder="Enter department name"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="border p-2 mt-5 rounded-md"
              />
              <button
                onClick={addDepartment}
                className="bg-blue-400 text-white px-4 py-2 rounded mt-5">
                Add
              </button>
            </div>
          </div>

          {/* Remove Department */}
          <div className="mb-6 p-5">
            <h2 className="text-xl font-bold">Remove Department:</h2>
            <div className='flex gap-2'>
              <input
                type="text"
                placeholder="Enter department name"
                value={deleteDepartment}
                onChange={(e) => setDeleteDepartment(e.target.value)}
                className="border p-2 rounded-md"
              />
              <button
                onClick={removeDepartment}
                className="bg-red-500 text-white px-4 py-2 rounded">
                Remove
              </button>
            </div>
          </div>
        </div>
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
        <Button className='ml-auto' variant='ghost' onClick={resetPass}>Change</Button>
      </div>
      <div className='font-bold text-2xl m-5 mt-10'>Database Access</div>
      <div className='w-screen flex justify-between items-center px-5 mt-3'>

        <div className='flex flex-row gap-4 text-xl'>
          <div className='mt-1'>
            <FaLock />
          </div>
          <span className='text-xl'>Go To DataBase</span>
        </div>
        <Link href="https://docs.google.com/spreadsheets/d/1WxGaDWAdcYjWhLY1hR_2alrH5pmX5_tCzFgYv-_ln2A/edit?gid=0#gid=0">
          <Button className='ml-auto' variant='ghost'>{"->"}</Button>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Page;