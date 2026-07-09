import { PrismaClient } from "@prisma/client";

declare global {
  // allow global prisma to prevent multiple instances in dev
  // eslint-disable-next-line no-var
  var __prisma?: PrismaClient;
}
export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV === "development") global.__prisma = prisma;
