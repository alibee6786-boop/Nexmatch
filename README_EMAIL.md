# Email (Gmail SMTP) Integration

This branch integrates Gmail (SMTP) as the email provider for magic links / verification via Auth.js Email provider.

Environment variables (add to .env):

- EMAIL_SERVER_HOST (default: smtp.gmail.com)
- EMAIL_SERVER_PORT (default: 465)
- EMAIL_SERVER_SECURE (true/false — default true for port 465)
- EMAIL_SERVER_USER (your Gmail address or service account email)
- EMAIL_SERVER_PASSWORD (an app password or SMTP password)
- EMAIL_FROM (optional, e.g., "NexMatch <no-reply@yourdomain.com>")

Notes
- For Gmail, using an app password is recommended for production. If using a regular Google account with 2FA enabled, create an app password in your Google Account and use it as EMAIL_SERVER_PASSWORD.
- If you have GSuite / Google Workspace, consider creating a service account or using a domain-wide SMTP relay.
- The implementation uses nodemailer under the hood and a custom HTML template for the magic link.

How Auth.js uses this
- Auth.js Email provider will call our custom sendVerificationRequest which uses the nodemailer helper in lib/mail.ts to send the magic link HTML email.

Testing
- The mail helper is unit-tested with mocked nodemailer in the tests folder.

Apply and verify locally
1. Install dependencies:
   npm install
2. Configure .env values
3. Run migrations (auth schema must exist):
   npx prisma generate
   npx prisma migrate dev --name auth
4. Run dev server:
   npm run dev
5. Use the sign-in page and choose "Sign in with Email" (Auth.js will send magic link to the provided email)
