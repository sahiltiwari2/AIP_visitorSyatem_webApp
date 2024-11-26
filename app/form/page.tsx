'use client';
import React, { useState } from 'react';
import TopBar from '@/components/topBar';
import { Input } from '@nextui-org/input';
import { Button, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { getDatabase, ref, set } from "firebase/database";
import { departments } from "@/data";

const Form = () => {
  const numbers = [1, 2, 3, 4, 5];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [visitors, setVisitors] = useState('');
  const [visitorNames, setVisitorNames] = useState<string[]>([]);
  const [representativeEmail, setRepresentativeEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [TimeofMeeting, setTimeofMeeting] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visitorEmails, setVisitorEmails] = useState<string[]>([]);
  const [visitorNumbers, setVisitorNumbers] = useState<string[]>([]);
  const [showCameraMessage, setShowCameraMessage] = useState(false); // State for showing the camera message

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
      TimeofMeeting,
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
        set(ref(db, `appointmentsPending/${department}/${email.split("@")[0]}`), {
          name,
          email,
          phonenumber: number,
          dateOfVisit: date,
          purposeOfVisit: purpose,
          numberOfVisitors: visitors,
          timeOfVist: TimeofMeeting,
          visitorsNames: visitorNames,
          visitorsEmails: visitorEmails,
          visitorsNumbers: visitorNumbers,
          representativeEmail,
          departmentOfWork: department,
          approvalStatus: "Pending"
        });
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
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            variant="bordered"
            label="Email"
            placeholder="Enter your email"
            className="pt-5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="number"
            variant="bordered"
            label="Number"
            placeholder="Enter your Phone Number"
            className="pt-5"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <Input
            type="date"
            variant="bordered"
            label="Date of visit"
            className="pt-5"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            type="text"
            variant="bordered"
            label="Purpose of Visit"
            placeholder="Enter your Purpose"
            className="pt-5"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
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
            <div className="grid grid-cols-3 gap-3" key={index}>
              <Input
                type="text"
                variant="bordered"
                label={`Visitor ${index + 1}'s Name`}
                placeholder="Enter Visitor Name"
                className="pt-5"
                value={visitorName}
                onChange={(e) => handleVisitorNameChange(index, e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                label={`Visitor ${index + 1}'s Email`}
                placeholder="Enter Visitor Email"
                className="pt-5"
                value={visitorEmails[index]}
                onChange={(e) => handleVisitorEmailChange(index, e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                label={`Visitor ${index + 1}'s Number`}
                placeholder="Enter Visitor Phone Number"
                className="pt-5"
                value={visitorNumbers[index]}
                onChange={(e) => handleVisitorNumberChange(index, e.target.value)}
              />
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
          <Input
            type="time"
            id="appt"
            name="appt"
            min="09:00"
            max="18:00"
            label="Select time for the meeting"
            value={TimeofMeeting}
            onChange={(e) => setTimeofMeeting(e.target.value)}
            required
            variant="bordered"
            description="Working hours from 9 AM to 6 PM"
          />
          <Select
            label="Department"
            placeholder="Select a Department"
            className="w-full pt-5 mb-8"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            {departments.map((dept) => (
              <SelectItem key={dept.key} value={dept.key}>
                {dept.label}
              </SelectItem>
            ))}
          </Select>

          <Button
            className="m-3"
            onClick={() => setShowCameraMessage(true)}
          >
            Camera
          </Button>

          {showCameraMessage && (
            <div className="p-4 mt-4 bg-red-100 text-red-700 border border-red-500 rounded-md m-5">
              Camera not found
            </div>
          )}

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
            <Button
              color="danger"
              variant="flat"
              className="w-full text-xl h-12"
              as={Link}
              href="/"
            >
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
