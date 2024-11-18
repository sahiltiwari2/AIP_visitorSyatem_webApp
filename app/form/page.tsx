'use client';
import React, { useState } from 'react';
import TopBar from '@/components/topBar';
import { Input } from '@nextui-org/input';
import { Button, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = () => {
  const numbers = [1, 2, 3, 4, 5];
  
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [number, setnumber] = useState('');
  const [date, setdate] = useState('');
  const [purpose, setpurpose] = useState('');
  const [visitors, setVisitors] = useState('');
  const [representativeEmail, setRepresentativeEmail] = useState('');

  const handleSubmit = async () => {
    const formData = { name, email, number, date, purpose, visitors, representativeEmail };
  
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        toast.success('Email sent successfully!', {
          position: 'top-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      } else {
        toast.error('Failed to send email.', {
          position: 'top-left',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while sending the email.', {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
    }
  };
  

  return (
    <div>
      <TopBar pageName="Appointment Form" />
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
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <Input
            type="email"
            variant="bordered"
            label="Email"
            placeholder="Enter your email"
            className="pt-5"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <Input
            type="number"
            variant="bordered"
            label="Number"
            placeholder="Enter your Number"
            className="pt-5"
            value={number}
            onChange={(e) => setnumber(e.target.value)}
          />
          <Input
            type="date"
            variant="bordered"
            label="Date of visit"
            className="pt-5"
            value={date}
            onChange={(e) => setdate(e.target.value)}
          />
          <Input
            type="text"
            variant="bordered"
            label="Purpose of Visit"
            placeholder="Enter your Purpose"
            className="pt-5"
            value={purpose}
            onChange={(e) => setpurpose(e.target.value)}
          />
          <Select
            label="Number of visitors"
            placeholder="Select a number"
            className="pt-5"
            onChange={(e) => setVisitors(e.target.value)}
          >
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
            value={representativeEmail}
            onChange={(e) => setRepresentativeEmail(e.target.value)}
          />
          <Button
            style={{ background: '#17C6ED' }}
            className="w-full text-white text-xl h-12"
            onClick={handleSubmit}
          >
            Book an Appointment
          </Button>
          <div className="pt-5">
            <Button color="danger" variant="flat" className="w-full text-xl h-12" as={Link} href="/">
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
