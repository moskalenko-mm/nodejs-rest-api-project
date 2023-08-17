import nodemailer from "nodemailer";
import "dotenv/config";

const { GMAIL_EMAIL, EMAIL_PASSWORD } = process.env;

const nodemailerGmailConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_EMAIL,
    pass: EMAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(nodemailerGmailConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: GMAIL_EMAIL };
  const result = await transporter.sendMail(email);
  return result;
};

export default sendEmail;
