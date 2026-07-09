# Migration: add authentication models

This migration creates the initial set of authentication tables used by Auth.js with the Prisma adapter:
- User
- Account
- Session
- VerificationToken

Apply with:
  npx prisma migrate deploy

Notes:
- IDs for User and Session are stored as text (Prisma cuid()). Prisma client will generate IDs on the application side.
- If you prefer database-generated UUIDs, update the schema to use @default(uuid()) and adjust migration accordingly.
