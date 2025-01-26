import nodemailer from 'nodemailer';
import { ref, get, child } from "firebase/database";
import { database } from '@/firebase';

export async function POST(req) {
  const {
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
    selectedDepartment,
    TimeofMeeting
  } = await req.json();

  if (!selectedDepartment || typeof selectedDepartment !== "string" || selectedDepartment.trim() === "") {
    console.error("Invalid department received:", selectedDepartment);
    return new Response(JSON.stringify({ message: 'Invalid department provided' }), { status: 400 });
  }

  const fetchEmailFromFirebase = async (department) => {
    const dbRef = ref(database);
    try {
      console.log(`Fetching email for department '${department}' from Firebase...`);
      const emailSnap = await get(child(dbRef, `departments/${department}/email`));
      if (!emailSnap.exists()) {
        throw new Error(`Email for department '${department}' not found`);
      }
      return emailSnap.val();
    } catch (error) {
      console.error(`Error fetching email for department '${department}':`, error);
      throw new Error(`Failed to fetch email for department '${department}'`);
    }
  };
  const fetchMasterEmailFromFirebase = async () => {
    const dbRef = ref(database);
    try {
      console.log(`Fetching Masrter email from Firebase...`);
      const emailSnap = await get(child(dbRef, `departments/masterEmail/email`));
      if (!emailSnap.exists()) {
        throw new Error(`Email for department '${department}' not found`);
      }
      return emailSnap.val();
    } catch (error) {
      console.error(`Error fetching email for department '${department}':`, error);
      throw new Error(`Failed to fetch email for department '${department}'`);
    }
  };

  let departmentEmail;
  let masterEmail;
  try {
    departmentEmail = await fetchEmailFromFirebase(selectedDepartment);
    masterEmail = await fetchMasterEmailFromFirebase();
    console.log(`Fetched department email: ${departmentEmail}`);
  } catch (error) {
    console.error("Error during Firebase fetch:", error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sahiltiwari2005@gmail.com',
      pass: 'wcyc uafc bshq ltvv', // Use app password for Gmail
    },
  });

  const emailText = `
    Full Name: ${name}
    Email: ${email}
    Phone Number: ${number}
    Date of Visit: ${date}
    Purpose of Visit: ${purpose}
    Time of Meeting: ${TimeofMeeting}
    Number of Visitors: ${visitors}
    Name of Visitors: ${visitorNames}
    Email of Visitors: ${visitorEmails}
    Number of Visitors: ${visitorNumbers}
    Representative Email: ${representativeEmail}
  `;

  const recipients = [departmentEmail, masterEmail]; 

  try {
    await Promise.all(
      recipients.map((recipient) =>
        transporter.sendMail({
          from: 'sahiltiwari2005@gmail.com',
          to: recipient,
          subject: `New Appointment Request for ${selectedDepartment.toUpperCase()} Department`, // Fixed: Use selectedDepartment
          text: emailText,
        })
      )
    );
    console.log("Emails sent successfully to:", recipients);
    return new Response(JSON.stringify({ message: 'Emails sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending emails:', error);
    return new Response(JSON.stringify({ message: 'Failed to send emails' }), { status: 500 });
  }
  
}
