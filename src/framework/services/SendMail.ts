import nodemailer, { Transporter } from "nodemailer";
import InodeMailer from "../../usecase/interface/InodeMailer";

class sendMail {
  async sendMail(mailOptions: {
    email: string;
    subject: string;
    activationCode: string;
  }): Promise<any> {
    const transporter: Transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const { email, subject, activationCode } = mailOptions;

    const mailConfig = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html: `<p> Enter <b>${activationCode}</b> in the app to verify your email address.</p>
            <p>This code will <b> Expires in one hour</b></P> `,
    };

    await transporter.sendMail(mailConfig);
  }
}

export default sendMail;
