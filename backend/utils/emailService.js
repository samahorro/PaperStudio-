const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendVerificationEmail = async (toEmail, code) => {
  await transporter.sendMail({
    from: `"PaperStudio" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: 'Verify your PaperStudio account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Welcome to PaperStudio ✉️</h2>
        <p>Use the code below to verify your email address. It expires in <strong>15 minutes</strong>.</p>
        <div style="background: #f4f4f4; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e;">${code}</span>
        </div>
        <p style="color: #888; font-size: 13px;">If you didn't create a PaperStudio account, you can safely ignore this email.</p>
      </div>
    `
  });
};

const sendLoginOtpEmail = async (toEmail, code) => {
  await transporter.sendMail({
    from: `"PaperStudio" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: 'Your PaperStudio login code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">PaperStudio Login Code 🔐</h2>
        <p>Enter this code to complete your login. It expires in <strong>10 minutes</strong>.</p>
        <div style="background: #f4f4f4; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e;">${code}</span>
        </div>
        <p style="color: #888; font-size: 13px;">If you didn't try to log in, please change your password immediately.</p>
      </div>
    `
  });
};

const sendPasswordResetEmail = async (toEmail, code) => {
  await transporter.sendMail({
    from: `"PaperStudio" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: 'Reset your PaperStudio password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1a1a2e;">Password Reset Request 🔑</h2>
        <p>Use the code below to reset your password. It expires in <strong>15 minutes</strong>.</p>
        <div style="background: #f4f4f4; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e;">${code}</span>
        </div>
        <p style="color: #888; font-size: 13px;">If you didn't request a password reset, please ignore this email.</p>
      </div>
    `
  });
};

module.exports = { sendVerificationEmail, sendLoginOtpEmail, sendPasswordResetEmail };
