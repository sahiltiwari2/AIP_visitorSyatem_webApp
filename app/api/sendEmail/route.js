import nodemailer from 'nodemailer';
import { ref, get, child } from "firebase/database";
import { database } from '@/firebase';

export async function POST(req) {
  // Extract the request body
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

  // Fetch department emails and master email from Firebase
  const fetchEmailsFromFirebase = async () => {
    const dbRef = ref(database);
    try {
      const [masterEmailSnap, hrEmailSnap, devEmailSnap] = await Promise.all([
        get(child(dbRef, 'currenMasterEmail')),
        get(child(dbRef, 'departments/hr/email')),
        get(child(dbRef, 'departments/development/email'))
      ]);

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

  // Retrieve the emails
  let emails;
  try {
    emails = await fetchEmailsFromFirebase();
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }

  const { masterEmail, hrEmail, developmentEmail } = emails;

  if (!masterEmail) {
    return new Response(JSON.stringify({ message: 'Master email is not configured' }), { status: 500 });
  }

  // Create the email transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sahiltiwari2005@gmail.com',
      pass: 'qwcg giwt qspv lqax', // Use an app password for Gmail for security
    },
  });

  // Prepare email options
  const mailOptions = {
    from: 'sahiltiwari2005@gmail.com',
    subject: 'New Appointment Request',
    text: `
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
    `,
  };

  // Determine the recipient based on the department
  let recipientEmail;
  if (department === "hr") {
    recipientEmail = hrEmail || masterEmail; // Use HR email or fallback to master email
  } else if (department === "development") {
    recipientEmail = developmentEmail || masterEmail; // Use development email or fallback to master email
  } else {
    recipientEmail = masterEmail; // Default to master email for invalid departments
  }

  // Set the recipient email dynamically
  mailOptions.to = recipientEmail;

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: 'Failed to send email' }), { status: 500 });
  }
}
