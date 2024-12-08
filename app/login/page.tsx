'use client'
import React, { useState } from 'react'
import TopBar from '@/components/topBar'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/button'
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth"
import { auth, database, provider } from '@/firebase'
import { useRouter } from 'next/navigation'
import { signInWithPopup } from 'firebase/auth'
import { ref, set } from 'firebase/database'
import { toast, ToastContainer } from 'react-toastify'
import Emails from "@/public/email.json"
import 'react-toastify/dist/ReactToastify.css';

const login = () => {
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  const router = useRouter()



  const [SignInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth)

  const handelSingIn = async () => {
    if (Emails.accounts.includes(email)) {
      const res = await SignInWithEmailAndPassword(email, password)
      if (res) {
        toast.success('Login Successfull ', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setemail('');
        setpassword('');
        router.push('/profile')
      }
      else{
        toast.error('Incorrect Password', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
    else {
      toast('User not Authorized for login ', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
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
      // setTimeout(() => {
      //   router.push('/adminSettings');
      // }, 2000);
    } catch (error) {

    }
  }

  return (
    <div>
      <TopBar pageName='Login' />
      <div className='w-screen'>
        <Input
          type="email"
          label="Username / Email"
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
      </div>
      <div className="w-screen pt-2 ">
        <div className='px-5'>
          <Button style={{ background: '#17C6ED' }} className="w-full text-white text-xl h-11 " onClick={handelSingIn}>
            Login
          </Button>
        </div>
        {/* <div className='w-screen flex flex-row pt-5  px-10'>
          <Divider className="my-4 w-5/12" />
          <div className='text-center px-20 pt-1 font-bold'>
            OR
          </div>
          <Divider className="my-4 w-5/12" />
        </div> */}
        {/* <div className='px-5'>
          <Button onClick={handleGoogleSignIn} color="primary" variant="ghost" className='w-full h-11 text-xl mt-4'>
            Login Using Google
          </Button>
        </div> */}
      </div>
      {/* <div className='flex flex-row gap-2 justify-center  w-screen mt-3'>
        <div>
          New User ?
        </div>
        <Link href={"/signup"}>
          <div className='text-blue-500' >
            Sign up
          </div>
        </Link>
      </div> */}

      <ToastContainer />
    </div>
  )
}

export default login