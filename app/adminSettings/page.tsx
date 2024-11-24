'use client'
import React, { useEffect, useState } from 'react'
import TopBar from '@/components/topBar'
import { FaRegUser } from 'react-icons/fa'
import { child, get, getDatabase, ref } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Input } from '@nextui-org/input';

const page = () => {
    const dbRef = ref(getDatabase());
    const [username, setusername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email);
            }
        });

        return () => unsubscribe();
    }, []);
    if (email) {
        get(child(dbRef, `users/${email.split("@")[0]}/username`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setusername(snapshot.val());
                } else {
                    console.log("No user data available");
                }
            })
    }
    return (
        <div>
            <TopBar pageName='Profile Settings' />
            <div className='text-3xl font-bold ml-5 mt-3'>
                Admin profile settings
            </div>
            <div className='ml-5'>
                Manage your account details and preferences
            </div>
            <div className='w-screen flex flex-col items-center justify-center text-6xl mt-10'>
                <FaRegUser />
                <div className='text-xl mt-1 font-bold'>{username}</div>
            </div>

            <div className='font-bold text-2xl mt-10 ml-5'>
                Basic Information
            </div>
            <div className='w-screen'>
                <div className='items-center w-auto mx-5'>
                    <Input
                        type="text"
                        variant="bordered"
                        label="Full Name"
                        placeholder=" Name"
                        className="pt-5"
                    // value={name}
                    // onChange={(e) => setname(e.target.value)}
                    />
                    <Input
                        type="text"
                        variant="bordered"
                        label="Full Name"
                        placeholder="Username"
                        className="pt-5"
                    // value={name}
                    // onChange={(e) => setname(e.target.value)}
                    />
                    <Input
                        type="email"
                        variant="bordered"
                        label="Email"
                        placeholder="email"
                        className="pt-5"
                    // value={email}
                    // onChange={(e) => setemail(e.target.value)}
                    />
                    <Input
                        type="number"
                        variant="bordered"
                        label="Number"
                        placeholder="Phone Number"
                        className="pt-5"
                    // value={number}
                    // onChange={(e) => setnumber(e.target.value)}
                    />
                </div>
            </div>
            <div className='font-bold text-2xl mt-10 ml-5'>
                PassWord
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
        </div>
    )
}

export default page