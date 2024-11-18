import nodemailer from 'nodemailer';

export async function POST(req) {
  const { name, email, number, date, purpose, visitors, representativeEmail } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sahiltiwari2005@gmail.com', 
      pass: '**** **** ****',       
    },
  });

  const mailOptions = {
    from: 'sahiltiwari2005@gmail.com',
    to: representativeEmail,
    subject: 'New Appointment Request',
    text: `
      Full Name: ${name}
      Email: ${email}
      Phone Number: ${number}
      Date of Visit: ${date}
      Purpose of Visit: ${purpose}
      Number of Visitors: ${visitors}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Failed to send email' }), { status: 500 });
  }
}
