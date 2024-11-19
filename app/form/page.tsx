'use client';
import React, { useState } from 'react';
import TopBar from '@/components/topBar';
import { Input } from '@nextui-org/input';
import { Button, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { animals, departments } from "@/data";
import { ClipLoader } from 'react-spinners';
import { Navbar } from "@/components/navbar";
import { getDatabase, ref, set } from "firebase/database";

const Form = () => {
  const numbers = [1, 2, 3, 4, 5];

  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [number, setnumber] = useState('');
  const [date, setdate] = useState('');
  const [purpose, setpurpose] = useState('');
  const [visitors, setVisitors] = useState('');
  const [visitorNames, setVisitorNames] = useState<string[]>([]); // Array to store visitor names
  const [representativeEmail, setRepresentativeEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visitorEmails, setVisitorEmails] = useState<string[]>([]);
  const [visitorNumbers, setVisitorNumbers] = useState<string[]>([]);


  const handleVisitorEmailChange = (index: number, value: string) => {
    const updatedVisitorEmails = [...visitorEmails];
    updatedVisitorEmails[index] = value;
    setVisitorEmails(updatedVisitorEmails);
  };

  const handleVisitorNumberChange = (index: number, value: string) => {
    const updatedVisitorNumbers = [...visitorNumbers];
    updatedVisitorNumbers[index] = value;
    setVisitorNumbers(updatedVisitorNumbers);
  };

  const handleVisitorsChange = (value: string) => {
    setVisitors(value);

    const numVisitors = parseInt(value, 10);
    setVisitorNames(Array(numVisitors).fill("")); 
  };

  const handleVisitorNameChange = (index: number, value: string) => {
    const updatedVisitorNames = [...visitorNames];
    updatedVisitorNames[index] = value;
    setVisitorNames(updatedVisitorNames);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const formData = {
      name,
      email,
      number,
      date,
      purpose,
      visitors,
      visitorNames, 
      visitorEmails,
      visitorNumbers,
      representativeEmail,
      department
    };

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
        
        const db = getDatabase();
        set(ref(db, 'appointmentsPending/' + email.split("@")[0]), {
          name: name,
          email: email,
          phonenumber : number,
          dateOfVisit : date,
          purposeOfVisit: purpose,
          numberOfVisitors : visitors,
          visitorsNames : visitorNames,
          visitorsEmails : visitorEmails,
          visitorsNumbers : visitorNumbers,
          representativeEmail : representativeEmail,
          departmentOfWork : department,
          approvalStatus : "Pending"
        });
      } else {
        console.log("Failed to send email");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
            placeholder="Enter your Phone Number"
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
            label="Number of Visitors"
            placeholder="Select a Number"
            className="w-full pt-5"
            value={visitors}
            onChange={(e) => handleVisitorsChange(e.target.value)}
          >
            {numbers.map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </Select>

          
          {visitorNames.map((visitorName, index) => (
            <div className='grid grid-cols-3 gap-3'>
              <div className=''>
                <Input
                  key={index}
                  type="text"
                  variant="bordered"
                  label={`Visitor ${index + 1}'s Name`}
                  placeholder={`Enter Visitor Name`}
                  className="pt-5"
                  value={visitorName}
                  onChange={(e) => handleVisitorNameChange(index, e.target.value)}
                />
              </div>
              <div className=''>
                <Input
                  key={index}
                  type="text"
                  variant="bordered"
                  label={`Visitor ${index + 1}'s Email`}
                  placeholder={`Enter Visitor Email`}
                  className="pt-5"
                  value={visitorEmails[index]}
                  onChange={(e) => handleVisitorEmailChange(index, e.target.value)}
                />
              </div>
              <div className=''>
                <Input
                  key={index}
                  type="text"
                  variant="bordered"
                  label={`Visitor ${index + 1}'s Number`}
                  placeholder={`Enter Visitor Phone Number`}
                  className="pt-5"
                  value={visitorNumbers[index]}
                  onChange={(e) => handleVisitorNumberChange(index, e.target.value)}
                />
              </div>
            </div>
          ))}

          <Input
            type="email"
            variant="bordered"
            label="Representative's Email Address"
            placeholder="Enter Email Address"
            className="pt-5 pb-5"
            value={representativeEmail}
            onChange={(e) => setRepresentativeEmail(e.target.value)}
          />

          <Select
            label="Department"
            placeholder="Select a Department"
            className="w-full pt-5 mb-8"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((department) => (
              <SelectItem key={department.key} value={department.key}>
                {department.label}
              </SelectItem>
            ))}
          </Select>

          <Button
            style={{ background: '#17C6ED' }}
            className="w-full text-white text-xl h-12"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ClipLoader color="#fff" size={20} />
            ) : (
              'Book an Appointment'
            )}
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
