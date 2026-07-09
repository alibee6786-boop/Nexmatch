# Password reset migration

Adds the PasswordReset table which stores hashed tokens for password reset flows.

Apply with:
  npx prisma migrate deploy
