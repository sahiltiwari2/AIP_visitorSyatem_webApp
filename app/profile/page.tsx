'use client'
import React from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'
import TopBar from '@/components/topBar'
import { getDatabase, ref, child, get } from "firebase/database";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { HiUserCircle } from "react-icons/hi2";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link'
import Image from 'next/image';

const page = () => {
  const dbRef = ref(getDatabase());
  const [email, setEmail] = useState<string | null>(null);
  const [username, setusername] = useState<string | null>(null);
  const [department, setdepartment] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isPhotoPresent, setIsPhotoPresent] = useState(true)
  const currentUser = auth.currentUser;
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
    get(child(dbRef, `users/${email.split("@")[0]}/department`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setdepartment(snapshot.val());
        } else {
          console.log("No user data available");
        }
      })
  }

  const router = useRouter()

  const handelSignout = async () => {
    signOut(auth)
    router.push('/login')
  }
      useEffect(() => {
          if (currentUser) {
              const email = currentUser.email || "";
              const timestamp = new Date().getTime(); // Generate a timestamp
              setPhotoUrl(`/profile-photos/${email.replace("@", "_")}.jpg?timestamp=${timestamp}`);
          }
      }, [currentUser]);
  return (
    <div>
      <TopBar pageName='Admin Profile' />
      <div className='font-bold text-xl m-5'>
        Profile Information
      </div>

      <div className='flex justify-center mt-10  text-[150px] w-screen'>
        <div className={isPhotoPresent ? '' : ' hidden'}>
          {photoUrl && (
            <Image
              src={photoUrl}
              alt="Profile Photo"
              className='rounded-full'
              width={150}
              height={150}
              onError={(e) => (setIsPhotoPresent(false))} // Default image if photo not found
            />
          )}
        </div>
        <div className={isPhotoPresent ? 'hidden' : ""}>
          <HiUserCircle />
        </div>
      </div>
      <div className='flex justify-center mt-5 gap-3 text-2xl w-screen'>
        <span className='font-semibold'>Current User:</span><span>{username}</span>
      </div>
      <div className='flex justify-center mt-4 gap-3 text-2xl w-screen'>
        <span className='font-semibold'>Department:</span><span>{department}</span>
      </div>
      <div className='flex justify-center mt-4 gap-3 text-2xl w-screen'>
        <span className='font-semibold'>Email:</span><span>{email}</span>
      </div>
      <div className='mt-24 w-screen p-3 '>
        <Button style={{ background: '#FFFFFF' }} className="w-full  text-xl h-11 hover:shadow-lg transition-all duration-700 delay-150" variant='bordered' as={Link} href='/adminSettings'>
          <div className='w-full flex items-center text-xl'>
            <div className='w-full flex items-center gap-3'>
              <IoMdSettings />
              Profile Settings
            </div>
            <MdOutlineKeyboardArrowRight />
          </div>
        </Button>
        <Button style={{ background: '#FFFFFF' }} className="w-full  text-xl h-11 hover:shadow-lg transition-all duration-700 delay-150 mt-3" variant='bordered' onClick={handelSignout}>
          <div className='w-full flex items-center text-xl'>
            <div className='w-full flex items-center gap-3'>
              <RiLogoutCircleLine />
              Log Out
            </div>
            <MdOutlineKeyboardArrowRight />
          </div>
        </Button>
      </div>

    </div>
  )
}


export default page
