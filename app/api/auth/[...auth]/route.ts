import NextAuth from "@auth/nextjs";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
