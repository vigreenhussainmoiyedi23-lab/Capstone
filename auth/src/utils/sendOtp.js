import transporter from "../config/nodemailer.js";

async function SendEmail(data) {
  let retries = data.retries || 0;
  try {
    console.log("Email sent successfully");
    return await transporter.sendMail(data);
  } catch (error) {
    if (retries < 5) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      retries++;
      SendEmail({ ...data, retries });
    }else{
      throw error
    }
  }
}

export default SendEmail;
