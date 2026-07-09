-- Migration: add authentication models (User, Account, Session, VerificationToken)
-- Generated manually to reflect prisma/schema.prisma

CREATE TABLE "User" (
    "id" text NOT NULL PRIMARY KEY,
    "createdAt" timestamp(3) NOT NULL DEFAULT now(),
    "email" text NOT NULL,
    "name" text,
    "hashedPassword" text,
    "image" text
);

CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

CREATE TABLE "Account" (
    "id" serial PRIMARY KEY,
    "userId" text NOT NULL,
    "type" text NOT NULL,
    "provider" text NOT NULL,
    "providerAccountId" text NOT NULL,
    "refresh_token" text,
    "access_token" text,
    "expires_at" integer,
    "token_type" text,
    "scope" text,
    "id_token" text,
    "session_state" text,
    "oauth_token_secret" text,
    "oauth_token" text,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account" ("provider", "providerAccountId");

CREATE TABLE "Session" (
    "id" text NOT NULL PRIMARY KEY,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    "expires" timestamp(3) NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session" ("sessionToken");

CREATE TABLE "VerificationToken" (
    "identifier" text NOT NULL,
    "token" text NOT NULL PRIMARY KEY,
    "expires" timestamp(3) NOT NULL
);

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken" ("identifier", "token");
