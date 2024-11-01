'use client';
import React from 'react';
import TopBar from '@/components/topBar';
import { Input } from '@nextui-org/input';
import { Button, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = () => {
  const numbers = [1, 2, 3, 4, 5];

  const handleSubmit = () => {
    toast.success('Backend ka kam hai ye', {
      position: "top-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      // transition: Bounce,
      });
  };

  return (
    <div>
      <TopBar pageName='Appointment Form' />
      <div className="w-screen overflow-x-hidden">
        <div className="p-5 max-w-4xl mx-auto">
          <div className="pt-2">
            Please fill out the form below to schedule an appointment. Ensure all
            fields are completed accurately to avoid any delays in processing your
            request.
          </div>
          <Input
            type="text"
            variant="bordered"
            label="Full Name"
            placeholder="Enter your Name"
            className="pt-5"
          />
          <Input
            type="email"
            variant="bordered"
            label="Email"
            placeholder="Enter your email"
            className="pt-5"
          />
          <Input
            type="number"
            variant="bordered"
            label="Number"
            placeholder="Enter your Number"
            className="pt-5"
          />
          <Input
            type="date"
            variant="bordered"
            label="Date of visit"
            placeholder="Date of Visit"
            className="pt-5"
          />
          <Input
            type="text"
            variant="bordered"
            label="Purpose of Visit"
            placeholder="Enter your Purpose"
            className="pt-5"
          />
          <Select label="Number of visitors" placeholder="Select a number" className="pt-5">
            {numbers.map((number) => (
              <SelectItem key={number} value={number.toString()}>
                {number}
              </SelectItem>
            ))}
          </Select>
          <Input
            type="email"
            variant="bordered"
            label="Representative's Email Address"
            placeholder="Enter Email Address"
            className="pt-5 pb-5"
          />
          <Button
            style={{ background: '#17C6ED' }}
            className="w-full text-white text-xl h-12"
            onClick={handleSubmit} // Bind the handleSubmit function here
          >
            Book an Appointment
          </Button>
          <div className='pt-5'>
            <Button color="danger" variant='flat' className="w-full text-xl h-12" as={Link} href='/'>
              Cancel
            </Button>      
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Form;
