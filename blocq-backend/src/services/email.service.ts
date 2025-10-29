import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const EmailService = async (to: string, subject: string, body: string) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST as string,
        port: process.env.SMTP_PORT || 465,
        // secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    } as SMTPTransport.Options);

    await transporter.sendMail({
        from: `"Blocq Finance" <hello@demomailtrap.co>`,
        to,
        subject,
        html: body,
    });
};

export default EmailService;
