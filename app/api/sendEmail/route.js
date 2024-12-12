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
    department,
    TimeofMeeting
  } = await req.json();

  // Fetch emails from Firebase
  const fetchEmailsFromFirebase = async () => {
    const dbRef = ref(database);
    try {
      console.log("Fetching emails from Firebase...");
      const [masterEmailSnap, hrEmailSnap, devEmailSnap] = await Promise.all([
        get(child(dbRef, 'currenMasterEmail')),
        get(child(dbRef, 'departments/hr/email')),
        get(child(dbRef, 'departments/development/email'))
      ]);

      console.log("Firebase fetch complete.");  
      return {
        masterEmail: masterEmailSnap.exists() ? masterEmailSnap.val() : null,
        hrEmail: hrEmailSnap.exists() ? hrEmailSnap.val() : null,
        developmentEmail: devEmailSnap.exists() ? devEmailSnap.val() : null,
      };
    } catch (error) {
      console.error('Error fetching emails from Firebase:', error);
      throw new Error('Failed to fetch emails from Firebase');
    }
  };

  // Retrieve emails
  let emails;
  try {
    emails = await fetchEmailsFromFirebase();
    console.log("Fetched Emails:", emails); // Debug Firebase values
  } catch (error) {
    console.error("Error during Firebase fetch:", error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  const { masterEmail, hrEmail, developmentEmail } = emails;

  if (!masterEmail) {
    console.error("Master email is not configured!");
    return new Response(JSON.stringify({ message: 'Master email is not configured' }), { status: 500 });
  }

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sahiltiwari2005@gmail.com',
      pass: 'qwcg giwt qspv lqax', // Use app password for Gmail
    },
  });

  // Prepare email text
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

  // Send email to the department-specific email and master email
  const recipients = [];
  if (department === "hr") {
    recipients.push(hrEmail);
  } else if (department === "development") {
    recipients.push(developmentEmail);
  }
  recipients.push(masterEmail); // Always send to master email

  // Log recipient emails
  console.log("Recipient Emails:", recipients);

  try {
    // Send emails to all recipients
    await Promise.all(
      recipients.map((recipient) =>
        transporter.sendMail({
          from: 'sahiltiwari2005@gmail.com',
          to: recipient,
          subject: `New Appointment Request for ${department.toUpperCase()} Department`,
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
