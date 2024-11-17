'use client'
import React, { useState } from 'react'
import TopBar from '@/components/topBar'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import Link from 'next/link'
import { Divider } from '@nextui-org/react'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase"
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'


const signup = () => {
    const router = useRouter()

    const [name, setname] = useState("")
    const [department, setdepartment] = useState("")
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")

    const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

    const handelSignup = async () => {
        if (password === confirmPassword) {
            const res = await createUserWithEmailAndPassword(email, password)
            setname('');
            setemail('');
            setpassword('');
            setconfirmPassword('');
            toast.success('Account created', {
                position: "top-left",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setTimeout(() => {
                router.push('/');
            }, 3000);
        }
        else {
            toast.error('Password does not match', {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }

    }
    return (
        <div >
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
                    placeholder="Enter your password here"
                    className='p-5 '
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                />
            </div>
            <div className="w-screen pt-2 ">
                <div className='px-5'>
                    <Button style={{ background: '#17C6ED' }} className="w-full text-white text-xl h-11 " onClick={handelSignup}>
                        Sign up
                    </Button>
                </div>
                <div className='w-screen flex flex-row pt-5  px-10'>
                    <Divider className="my-4 w-5/12" />
                    <div className='text-center px-20 pt-1 font-bold'>
                        OR
                    </div>
                    <Divider className="my-4 w-5/12" />
                </div>
                <div className='px-5'>
                    <Button color="primary" variant="ghost" className='w-full h-11 text-xl mt-4'>
                        Login Using Google
                    </Button>
                </div>
            </div>
            <div className='flex flex-row gap-2 justify-center  w-screen mt-3'>
                <div>
                    Old User ?
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

export default signup