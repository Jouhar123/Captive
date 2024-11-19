import express from "express";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
// Use `import` with `.js` for ES Modules
// import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } from '../../constants.js';

// const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = require('../../constants');
import Vendor from "../Schema/Vendor.js"

import dotenv from 'dotenv';
dotenv.config();


// console.log("this is secret",AWS_ACCESS_KEY);
// console.log("this is secret",AWS_SECRET_ACCESS_KEY);
// const JWT_SECRET = JWT_SECRET || "Your Secret";

// if (!AWS_ACCESS_KEY || !AWS_SECRET_ACCESS_KEY) {
//   throw new Error("Missing AWS credentials in environment variables");
// }







const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

function generateOTP() {
  let otp = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }
  return otp;
}


export const sendCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res
        .status(400)
        .json({ message: "user email not Found" });
    }

    const otp = generateOTP();
    vendor.code = otp;
    await vendor.save();

    const params = {
      Source: "sales@quarknetworks.net",
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: "Code for Vendor Verification",
        },
        Body: {
          Text: {
            Data: `Your OTP is: ${otp}`,
          },
          Html: {
            Charset: "UTF-8",
            Data: `<p> Dear sirs, 
            Your code for verification is: <strong>${otp}</strong>
            Please use code for wifi access.. </p>`,
          },
        },
      },
    };

    const command = new SendEmailCommand(params);
    const response = await sesClient.send(command);

    // Return success response
    res.status(200).json({
      message: "OTP sent successfully",
      response: response,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};
