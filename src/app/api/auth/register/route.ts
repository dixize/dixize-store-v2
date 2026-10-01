import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { startSession, adminEmails } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const password = String(body.password || "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }
    if (name.length < 1) {
      return NextResponse.json({ error: "invalid_name" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "invalid_password" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "email_exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const role = adminEmails().includes(email) ? "ADMIN" : "USER";

    const user = await prisma.user.create({
      data: { email, name, passwordHash, role },
      select: { id: true, email: true, name: true, role: true },
    });

    await startSession(user);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
