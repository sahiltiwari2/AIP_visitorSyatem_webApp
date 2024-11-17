'use client'
import React from 'react'
import {signOut} from 'firebase/auth'
import { auth } from '@/firebase'
import { Button } from '@nextui-org/button'
import { useRouter } from 'next/navigation'

const page = () => {
    const router = useRouter()

    const handelSignout = async() => {
        signOut(auth)
        router.push('/login')
        }
  return (
    <div>
        <Button onClick={handelSignout}>
            Log Out
        </Button>
    </div>
  )
}

export default page