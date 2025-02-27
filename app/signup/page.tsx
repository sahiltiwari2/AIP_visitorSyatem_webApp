'use client'
import React, { useState } from 'react'
import TopBar from '@/components/topBar'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import Link from 'next/link'
import { Divider } from '@nextui-org/react'
import { getAuth, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider, database } from "@/firebase"
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { ref, set } from "firebase/database";
import {} from "@/data";    

const signup = () => {
    const router = useRouter()

    const [name, setname] = useState("")
    const [department, setdepartment] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")

    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

    const handleSignup = async () => {
        if (password === confirmPassword) {
            try {
                const res = await createUserWithEmailAndPassword(email, password);
                await set(ref(database, 'users/' + email.split("@")[0]), {
                    username: name,
                    department: department,
                });
                setname('');
                setemail('');
                setpassword('');
                setconfirmPassword('');
                setdepartment('');
                toast.success('Account created', {
                    position: "top-left",
                    autoClose: 3000,
                    theme: "dark",
                });
                setTimeout(() => {
                    router.push('/profile');
                }, 3000);
            } catch (error) {
                // toast.error(error.message, { position: "top-left", theme: "dark" });
            }
        } else {
            toast.error('Password does not match', { position: "top-left", theme: "dark" });
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Save user data to the database
            await set(ref(database, 'users/' + user.uid), {
                username: user.displayName,
                email: user.email,
            });

            toast.success('Logged in with Google!', { position: "top-left", theme: "dark" });
            setTimeout(() => {
                router.push('/adminSettings');
            }, 2000);
        } catch (error) {
            // toast.error(error.message, { position: "top-left", theme: "dark" });
        }
    }

    return (
        <div>
            <TopBar pageName='SignUp' />
            <div className='w-screen'>
                <Input
                    type="text"
                    label="Full Name"
                    labelPlacement="outside"
                    placeholder="Enter your name here"
                    className='p-5 '
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                />

                <Input
                    type="text"
                    label="Department"
                    labelPlacement="outside"
                    placeholder="Enter your department"
                    className='p-5 '
                    value={department}
                    onChange={(e) => setdepartment(e.target.value)}
                />

                <Input
                    type="email"
                    label="Email"
                    labelPlacement="outside"
                    placeholder="Enter your email"
                    className='p-5 '
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                />

                <Input
                    type="password"
                    label="Password"
                    labelPlacement="outside"
                    placeholder="Enter your password here"
                    className='p-5 '
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                />

                <Input
                    type="password"
                    label="Confirm Password"
                    labelPlacement="outside"
                    placeholder="Confirm your password"
                    className='p-5 '
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                />
            </div>
            <div className="w-screen pt-2 ">
                <div className='px-5'>
                    <Button style={{ background: '#17C6ED' }} className="w-full text-white text-xl h-11" onClick={handleSignup}>
                        Sign up
                    </Button>
                </div>
                <div className='w-screen flex flex-row pt-5 px-10'>
                    <Divider className="my-4 w-5/12" />
                    <div className='text-center px-20 pt-1 font-bold'>
                        OR
                    </div>
                    <Divider className="my-4 w-5/12" />
                </div>
                {/* <div className='px-5'>
                    <Button color="primary" variant="ghost" className='w-full h-11 text-xl mt-4' onClick={handleGoogleSignIn}>
                        Login Using Google
                    </Button>
                </div> */}
            </div>
            <div className='flex flex-row gap-2 justify-center w-screen mt-3'>
                <div>
                    Old User?
                </div>
                <Link href={"/login"}>
                    <div className='text-blue-500'>
                        Login
                    </div>
                </Link>
            </div>
            <ToastContainer />
        </div>
    )
}

export default signup;
