import nodemailer from "nodemailer";
import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ErrorHandler from "../utils/errorHandler";

const sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    return next(new ErrorHandler("Failed to send email", 500));
  }
};

const forgotPasswordEmail = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, resetUrl } = req.body;
    if (!email || !resetUrl) {
      return next(new ErrorHandler("Email and reset link are required", 400));
    }
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Password Reset Request",
        text: `Click the link to reset your password: ${resetUrl}`,
      };

      await transporter.sendMail(mailOptions);
      res
        .status(200)
        .json({ message: "Password reset email sent successfully" });
    } catch (error) {
      return next(new ErrorHandler("Failed to send password reset email", 500));
    }
  }
);

export { sendEmail, forgotPasswordEmail };
