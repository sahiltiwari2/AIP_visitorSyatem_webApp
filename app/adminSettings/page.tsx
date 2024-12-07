'use client';
import React, { useEffect, useState } from 'react';
import TopBar from '@/components/topBar';
import { FaRegUser, FaPencilAlt } from 'react-icons/fa';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Input } from '@nextui-org/input';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
    const dbRef = ref(getDatabase());
    const [username, setUsername] = useState<string | null>('');
    const [email, setEmail] = useState<string | null>(null);
    const [number, setNumber] = useState<string | null>(null);

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingNumber, setIsEditingNumber] = useState(false);

    useEffect(() => {
        toast('Make sure to enter your username and phone number', {
            position: 'top-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });

        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (email) {
            const userKey = email.split('@')[0];

            get(child(dbRef, `users/${userKey}/username`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        setUsername(snapshot.val());
                    }
                });

            get(child(dbRef, `users/${userKey}/number`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        setNumber(snapshot.val());
                    }
                });
        }
    }, [email]);

    const handleSave = (field: 'username' | 'email' | 'number', value: string) => {
        if (email) {
            const userKey = email.split('@')[0];
            const fieldPath = `users/${userKey}/${field}`;

            set(ref(getDatabase(), fieldPath), value)
                .then(() => {
                    toast.success(`${field} updated successfully!`);
                    if (field === 'username') setIsEditingUsername(false);
                    if (field === 'email') setIsEditingEmail(false);
                    if (field === 'number') setIsEditingNumber(false);
                })
                .catch((error) => {
                    console.error(`Failed to update ${field}:`, error);
                    toast.error(`Failed to update ${field}.`);
                });
        }
    };

    return (
        <div>
            <TopBar pageName="Profile Settings" />
            <div className="text-3xl font-bold ml-5 mt-3">Admin profile settings</div>
            <div className="ml-5">Manage your account details and preferences</div>
            <div className="w-screen flex flex-col items-center justify-center text-6xl mt-10">
                <FaRegUser />
                <div className="text-xl mt-1 font-bold">{username}</div>
            </div>

            <div className="font-bold text-2xl mt-10 ml-5">Basic Information</div>
            <div className="w-screen">
                <div className="items-center w-auto mx-5">
                    <div className="relative">
                        <Input
                            type="text"
                            variant="bordered"
                            label="Full Name"
                            placeholder="Name"
                            className="pt-5"
                            value={username || ''}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={!isEditingUsername}
                            endContent={
                                <FaPencilAlt
                                    className="mb-2 text-xl cursor-pointer"
                                    onClick={() => setIsEditingUsername(!isEditingUsername)}
                                />
                            }
                        />
                        {isEditingUsername && (
                            <button
                                className="mt-2 text-white bg-blue-400 px-4 py-1 rounded h-11 ml-3"
                                onClick={() => handleSave('username', username || '')}
                            >
                                Save Changes
                            </button>
                        )}
                    </div>

                    <div className="relative mt-5">
                        <Input
                            type="email"
                            variant="bordered"
                            label="Email"
                            placeholder="email"
                            className="pt-5"
                            value={email || ''}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditingEmail}
                            // endContent={
                            //     <FaPencilAlt
                            //         className="mb-2 text-xl cursor-pointer"
                            //         onClick={() => setIsEditingEmail(!isEditingEmail)}
                            //     />
                            // }
                        />
                        {isEditingEmail && (
                            <button
                                className="mt-2 text-white bg-blue-400 px-4 py-1 rounded h-11 ml-3"
                                onClick={() => handleSave('email', email || '')}
                            >
                                Save Changes
                            </button>
                        )}
                    </div>

                    <div className="relative mt-5">
                        <Input
                            type="number"
                            variant="bordered"
                            label="Number"
                            placeholder="Set your phone number here"
                            className="pt-5"
                            value={number || ''}
                            onChange={(e) => setNumber(e.target.value)}
                            disabled={!isEditingNumber}
                            endContent={
                                <FaPencilAlt
                                    className="mb-2 text-xl cursor-pointer"
                                    onClick={() => setIsEditingNumber(!isEditingNumber)}
                                />
                            }
                        />
                        {isEditingNumber && (
                            <button
                                className="mt-2 text-white bg-blue-400 px-4 py-1 rounded h-11 ml-3"
                                onClick={() => handleSave('number', number || '')}
                            >
                                Save Changes
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className='font-bold text-2xl mt-10 ml-5'>
                Password
            </div>
            <div className='w-screen'>
                <div className='items-center w-auto mx-5'>
                    <Input
                        type="password"
                        variant="bordered"
                        label="Current Password"
                        placeholder="Enter your current password"
                        className="pt-5"
                    // value={number}
                    // onChange={(e) => setnumber(e.target.value)}
                    />
                    <Input
                        type="password"
                        variant="bordered"
                        label="New Password"
                        placeholder="Enter your New password"
                        className="pt-5"
                    // value={number}
                    // onChange={(e) => setnumber(e.target.value)}
                    />
                    <Input
                        type="password"
                        variant="bordered"
                        label="Confirm Password"
                        placeholder="Enter your New password"
                        className="pt-5"
                    // value={number}
                    // onChange={(e) => setnumber(e.target.value)}
                    />
                    {/* <Input
                        type="password"
                        label="Password"
                        labelPlacement="outside"
                        placeholder="Enter your password here"
                        className='p-5 '
                    // value={password}
                    // onChange={(e) => setpassword(e.target.value)}
                    />

                    <Input
                        type="password"
                        label="Confirm Password"
                        labelPlacement="outside"
                        placeholder="Confirm your password"
                        className='p-5 '
                    // value={confirmPassword}
                    // onChange={(e) => setconfirmPassword(e.target.value)}
                    /> */}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Page;
