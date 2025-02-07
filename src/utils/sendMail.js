import nodemailer from "nodemailer";
async function sendMail() {
    try {
        const transporter = nodemailer.createTransport({
          service: "gmail", 
          auth: {
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PASSWORD, 
          },
        });
        
    } catch (error) {
        return false
    }
}

export default sendMail;