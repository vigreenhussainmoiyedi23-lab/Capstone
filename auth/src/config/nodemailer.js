import { config } from "./config.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Shortcut for Gmail's SMTP settings - see Well-Known Services
  auth: {
    type: "OAuth2",
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_SECRET_KEY,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
  },
});

export default transporter;