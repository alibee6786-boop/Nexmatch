-- Migration: add PasswordReset model for password reset tokens

CREATE TABLE "PasswordReset" (
    "id" text NOT NULL PRIMARY KEY,
    "token" text NOT NULL,
    "userId" text NOT NULL,
    "expires" timestamp(3) NOT NULL,
    "createdAt" timestamp(3) NOT NULL DEFAULT now(),
    CONSTRAINT "PasswordReset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "PasswordReset_token_key" ON "PasswordReset" ("token");
