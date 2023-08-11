import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer/index.js';

class MailService {
  private transporter: Mail;
  constructor() {
    this.transporter = createTransport({
      secure: true,
      service: 'gmail',
      port: Number(process.env.EMAIL_PORT),
      host: String(process.env.EMAIL_SERVER),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  sendMail(email: string, link: string) {
    this.transporter.sendMail({
      from: String(process.env.EMAIL_SERVER),
      to: email,
      text: '',
      subject: 'Подтвердите email на ChatApp',
      html: `<h1>Подтвердите email</h1>
      <p><a>https://${process.env.SERVER_URL}/api/user/activate/${link}</a></p>
      `,
    });
  }
}

export default new MailService();
