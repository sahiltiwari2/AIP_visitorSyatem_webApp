'use client';
import React, { useEffect, useState } from 'react';
import TopBar from '@/components/topBar';
import { Input } from '@nextui-org/input';
import { Button, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from 'react-spinners';
import { get, getDatabase, push, ref, set } from "firebase/database";
import { typeOfVisitors } from "@/data";
import { departments } from "@/public/department.json";
import { FaCamera } from "react-icons/fa";
import { useRouter } from 'next/navigation'
import VisitorPhotoSystem from '@/components/visitorPhoto';

const Form = () => {


  // Camera Logic
  const videoRef = useRef<HTMLVideoElement | null>(null); // Define the type explicitly
  const [isCameraOn, setIsCameraOn] = useState(false);



  const openCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // TypeScript now knows srcObject exists
          videoRef.current.play();
          setIsCameraOn(true);
        }
      } else {
        // alert('Camera not supported in this browser.');
      }
    } catch (err) {
      console.error('Error accessing the camera:', err);
      // alert('Unable to access the camera. Please check your permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream; // Explicit type assertion
      const tracks = stream.getTracks();

      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };


  // Camera logic ends here
  const numbers = [0, 1, 2, 3, 4, 5];

  const router = useRouter()

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [visitors, setVisitors] = useState('0');
  const [visitorNames, setVisitorNames] = useState<string[]>([]);
  const [representativeEmail, setRepresentativeEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [typeOfVisit, setTypeOfVisit] = useState('');
  const [TimeofMeeting, setTimeofMeeting] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visitorEmails, setVisitorEmails] = useState<string[]>([]);
  const [visitorNumbers, setVisitorNumbers] = useState<string[]>([]);
  const [showCameraMessage, setShowCameraMessage] = useState(false); // State for showing the camera message
  const [departments, setDepartments] = useState([]); // State to store department names
  const [selectedDepartment, setSelectedDepartment] = useState(''); // State for the selected department
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    // Fetch the departments from the JSON file
    fetch('/department.json')
      .then((response) => response.json())
      .then((data) => setDepartments(data.departments || []))
      .catch((error) => console.error('Error fetching departments:', error));

  }, []);

  // Fetch data if the email exists in the database
  const fetchOrInitializePerson = async (email: string) => {
    if (!email) return;

    const db = getDatabase();
    const peopleRef = ref(db, 'people');
    const snapshot = await get(peopleRef);

    if (snapshot.exists()) {
      const people = snapshot.val();

      // Search for the email
      const personKey = Object.keys(people).find(
        (key) => people[key].email === email
      );

      if (personKey) {
        // If the email exists, fetch the corresponding data
        setName(people[personKey].name);
        setNumber(people[personKey].number);
        setIsNewEntry(false);
      } else {
        // If the email does not exist, reset form for new entry
        setName('');
        setNumber('');
        setIsNewEntry(true);
      }
    } else {
      // If no people exist in the database, reset form for new entry
      setName('');
      setNumber('');
      setIsNewEntry(true);
    }
  };


  const saveNewPerson = async () => {
    const db = getDatabase();
    const peopleRef = ref(db, 'people');
    const newPersonRef = push(peopleRef); // Create a new unique key
    await set(newPersonRef, {
      email,
      name,
      number,
    });

    // alert('Person added successfully!');
    setIsNewEntry(false); // Switch back to "existing entry" mode
  };

  const handleTimeChange = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);

    // Adjust minutes to the nearest valid value (00 or 30)
    let adjustedMinutes = minutes;
    if (minutes < 15) {
      adjustedMinutes = 0; // Round down to 00
    } else if (minutes < 45) {
      adjustedMinutes = 30; // Round up/down to 30
    } else {
      adjustedMinutes = 0; // Round up to 00 of the next hour
    }

    // Format the corrected time
    const adjustedTime = `${String(hours).padStart(2, "0")}:${String(adjustedMinutes).padStart(2, "0")}`;


    const currentTime = new Date();
    const currentHours = String(currentTime.getHours()).padStart(2, "0");
    const currentMinutes = String(currentTime.getMinutes()).padStart(2, "0");
    const formattedCurrentTime = `${currentHours}:${currentMinutes}`;

    // Check if the adjusted time is outside working hours or in the past
    if (adjustedTime < formattedCurrentTime) {
      toast.error('Please select a time in Future!', {
        position: 'top-left',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      });
      return;
    }
    setTimeofMeeting(adjustedTime);
  };

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
    if (name == "" || email == "" || number == "" || date == "" || purpose == "" || TimeofMeeting == "" || selectedDepartment == "") {
      toast.warning('Please fill all the fields before submitting', {
        position: 'top-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark'
      })
      return;
    }

    incrementFutureVisitorCount(date);
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
      selectedDepartment
    };

    console.log("Form Data:", formData);

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

        saveNewPerson();
        const db = getDatabase();
        set(ref(db, `appointmentsPending/${selectedDepartment}/${email.split("@")[0]}`), {
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
          departmentOfWork: selectedDepartment,
          approvalStatus: "Pending",
          typeOfVisit: typeOfVisit
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setName('');
      setDate('');
      setDepartment('');
      setEmail("");
      setNumber('');
      setPurpose('');
      setRepresentativeEmail('');
      setTimeofMeeting('');
      setTypeOfVisit('');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  };

  const incrementFutureVisitorCount = async (date: string): Promise<void> => {
    try {
      const db = getDatabase();
      const today = new Date();
      const currentDate = today.toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

      if (date > currentDate) {
        // Reference for the upcoming visitor count on the given future date
        const futureVisitorsRef = ref(db, `upComingVisitors/${date}`);

        // Fetch the current count from Firebase
        const snapshot = await get(futureVisitorsRef);
        const currentCount = snapshot.exists() ? snapshot.val() : 0;

        // Increment the count by 1 and update in Firebase
        await set(futureVisitorsRef, currentCount + 1);
      } else {
        console.log("The provided date is not in the future.");
      }
    } catch (error) {
      console.error("Error incrementing future visitor count:", error);
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
            type="email"
            variant="bordered"
            label="Email"
            placeholder="Enter your email"
            className="pt-5"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              fetchOrInitializePerson(e.target.value);
            }}
          />
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
            label="Type of Visit"
            placeholder="Select a Type"
            className="w-full pt-5 "
            value={typeOfVisit}
            onChange={(e) => setTypeOfVisit(e.target.value)}
          >
            {typeOfVisitors.map((dept) => (
              <SelectItem key={dept.key} value={dept.key}>
                {dept.label}
              </SelectItem>
            ))}
          </Select>
          <div className='pt-5 text-[12px] text-gray-400 pl-2'>Enter Team Details- if any</div>
          <Select
            label="Members in Group"
            placeholder="Select a Number"
            className={visitors == "0" ? "w-full pb-5" : "w-full"}
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
                label={`Member ${index + 1} Name`}
                placeholder="Enter Member Name"
                className="pt-5"
                value={visitorName}
                onChange={(e) => handleVisitorNameChange(index, e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                label={`Member ${index + 1} Email`}
                placeholder="Enter Member Email"
                className="pt-5"
                value={visitorEmails[index]}
                onChange={(e) => handleVisitorEmailChange(index, e.target.value)}
              />
              <Input
                type="text"
                variant="bordered"
                label={`Member ${index + 1} Number`}
                placeholder="Enter Member Phone Number"
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
            className={visitors != "0" ? "pt-5 pb-5" : "hidden"}
            value={representativeEmail}
            onChange={(e) => setRepresentativeEmail(e.target.value)}
          />
          <Input
            type="time"
            id="appt"
            name="appt"
            min="09:00"
            max="18:00"
            step="1800" // Ensures 30-minute intervals in dropdowns
            label="Select time for the meeting"
            value={TimeofMeeting}
            onChange={(e) => handleTimeChange(e.target.value)} // Custom handler
            required
            variant="bordered"
          // description="Working hours from 9 AM to 6 PM"
          />


          <select
            className="w-full p-2 border-2 rounded-md mb-5 pt-4 mt-5 pb-4"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)} // Update this line
          >
            <option value="" disabled>
              Select a Department
            </option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {/* <Button
            className=" w-full text-xl mb-5 h-12"
            variant='ghost'
            color='secondary'
            onClick={isCameraOn ? stopCamera : openCamera}
          >
            <FaCamera />
            {isCameraOn ? "Click To Capture" : 'Take Photo'}
          </Button>

          <div className={isCameraOn ? 'flex justify-center items-center m-5 rounded-lg' : "hidden"}>
            <video
              className=' rounded-lg border-2 shadow-md'
              ref={videoRef}
              style={{ width: '100%', maxWidth: '600px' }}
            />
          </div> */}

          <VisitorPhotoSystem email={email} />
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