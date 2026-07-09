import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "@auth/core/providers/credentials";
import GitHubProvider from "@auth/core/providers/github";
import GoogleProvider from "@auth/core/providers/google";
import EmailProvider from "@auth/core/providers/email";
import { AuthOptions } from "@auth/core";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "./mail";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.hashedPassword) return null;
        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isValid) return null;
        // Return the user object expected by Auth.js
        return { id: user.id, email: user.email, name: user.name };
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || ""
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || ""
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
        port: Number(process.env.EMAIL_SERVER_PORT || 465),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM || undefined,
      // Use a custom sendVerificationRequest so we can use our template via nodemailer
      sendVerificationRequest: async ({ identifier, url, provider, token, site }) => {
        try {
          await sendVerificationEmail({ identifier, url, provider });
        } catch (err) {
          console.error("Error sending verification email", err);
        }
      }
    })
  ],
  session: {
    strategy: "database"
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    signOut: "/",
    error: "/sign-in"
  }
};
