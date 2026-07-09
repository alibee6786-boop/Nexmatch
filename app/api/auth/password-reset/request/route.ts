import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rateLimiter";

const bodySchema = z.object({ email: z.string().email(), recaptchaToken: z.string() });

async function verifyRecaptcha(token: string, ip?: string) {
  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) return false;
  const resp = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}${ip ? `&remoteip=${encodeURIComponent(ip)}` : ""}`
  });
  const json = await resp.json();
  // For v3, we may check score >= 0.5; for v2, success===true
  if (typeof json.success === "boolean" && json.success === true) return true;
  if (typeof json.score === "number" && json.score >= 0.5) return true;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.parse(body);

    const ip = req.headers.get("x-forwarded-for") || req.ip || req.headers.get("host") || undefined;

    // Rate limit by IP
    const rl = await rateLimit(`pwreset:${ip ?? parsed.email}`, 5, 60 * 60); // 5 requests per hour
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(rl.reset) } });
    }

    // Verify reCAPTCHA
    const recaptchaOk = await verifyRecaptcha(parsed.recaptchaToken, ip ?? undefined);
    if (!recaptchaOk) {
      return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
    }

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
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
