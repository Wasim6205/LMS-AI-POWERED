import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const sendMail = async (to,otp) => {
    await transporter.sendMail({
        from: `${process.env.EMAIL}`,
        to,
        subject: "Reset Your Password",
        html: `<h1>Reset Your Password</h1>
               <p>Use the following OTP to reset your password:</p>
               <h2>${otp}</h2>
               <p>Note: This OTP is valid for 5 minutes.</p>`,
    })
}

export default sendMail