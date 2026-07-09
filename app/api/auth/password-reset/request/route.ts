import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "@/lib/mail";

const bodySchema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) {
      // Return 200 to avoid leaking valid emails
      return NextResponse.json({ ok: true });
    }

    const rawToken = randomBytes(32).toString("hex");
    const hashed = await bcrypt.hash(rawToken, 10);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const pr = await prisma.passwordReset.create({
      data: {
        token: hashed,
        userId: user.id,
        expires
      }
    });

    try {
      await sendPasswordResetEmail({ email: user.email, token: rawToken, pid: pr.id });
    } catch (err) {
      // log but don't reveal to client
      console.error("Failed to send password reset email", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
