import nodemailer from "nodemailer";

const host = process.env.EMAIL_SERVER_HOST || "smtp.gmail.com";
const port = Number(process.env.EMAIL_SERVER_PORT || 465);
const secure = process.env.EMAIL_SERVER_SECURE !== "false"; // default true for 465

const transporter = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
});

export async function sendVerificationEmail({ identifier, url, provider }: { identifier: string; url: string; provider: any }) {
  const { host } = new URL(url);
  const from = process.env.EMAIL_FROM || `no-reply@${host}`;
  const subject = `Sign in to ${host}`;
  const text = `Sign in to ${host}\n\n${url}\n\n`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111;">
      <h2 style="font-size:18px;">Sign in to ${host}</h2>
      <p>Click the button below to sign in.</p>
      <a href="${url}" style="display:inline-block;padding:10px 16px;background:#2563eb;color:white;border-radius:6px;text-decoration:none;">Sign in</a>
      <p style="font-size:12px;color:#666;margin-top:12px;">If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  const info = await transporter.sendMail({
    to: identifier,
    from,
    subject,
    text,
    html
  });

  return info;
}
