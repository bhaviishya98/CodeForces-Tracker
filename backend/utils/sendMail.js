import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail", // or use Mailgun/Sendgrid/etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function sendMail({ to, subject, text }) {
  return transporter.sendMail({
    from: `"CodeForces Tracker" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
}
