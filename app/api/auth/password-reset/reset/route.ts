import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const bodySchema = z.object({ pid: z.string(), token: z.string(), password: z.string().min(8) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bodySchema.parse(body);

    const pr = await prisma.passwordReset.findUnique({ where: { id: parsed.pid } });
    if (!pr) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    if (pr.expires < new Date()) {
      // expired
      await prisma.passwordReset.deleteMany({ where: { userId: pr.userId } });
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const matches = await bcrypt.compare(parsed.token, pr.token);
    if (!matches) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    const hashed = await bcrypt.hash(parsed.password, 10);
    await prisma.user.update({ where: { id: pr.userId }, data: { hashedPassword: hashed } });

    // revoke existing sessions
    await prisma.session.deleteMany({ where: { userId: pr.userId } });
    // remove all password reset tokens for user
    await prisma.passwordReset.deleteMany({ where: { userId: pr.userId } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
