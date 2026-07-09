# Password reset

This feature adds a secure password reset flow for credential users.

How it works
1. User requests a password reset by posting their email to /api/auth/password-reset/request.
2. If the email exists, the server creates a short-lived password reset entry with a hashed token and sends a reset link to the user's email.
3. The link points to /reset-password?pid={id}&token={rawToken}.
4. The user sets a new password via the reset page which posts to /api/auth/password-reset/reset with pid, token, and new password.
5. Server verifies token (by comparing hash), updates the user's password, revokes sessions, and deletes reset entries.

Security notes
- Tokens are hashed before storage and compared with bcrypt.compare to avoid leaking tokens from DB backups.
- Tokens expire after 1 hour.
- The request endpoint returns 200 regardless of whether the email exists to avoid leaking registered emails.
- Existing sessions are revoked after a successful password reset.

Apply migration
- Use Prisma migrate dev or deploy the included migration:
  npx prisma generate
  npx prisma migrate deploy
