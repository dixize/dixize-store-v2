import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { startSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    console.log("[LOGIN] email:", email);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("[LOGIN] user:", user ? "FOUND" : "NOT FOUND");

    if (!user) {
      return NextResponse.json(
        { error: "invalid_credentials" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, user.passwordHash);

    console.log("[LOGIN] password:", ok ? "OK" : "WRONG");

    if (!ok) {
      return NextResponse.json(
        { error: "invalid_credentials" },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "USER" | "ADMIN",
    };

    console.log("[LOGIN] starting session...");

    await startSession(sessionUser);

    console.log("[LOGIN] SUCCESS");

    return NextResponse.json({ user: sessionUser });
  } catch (error) {
    console.error("[LOGIN ERROR]", error);

    return NextResponse.json(
      {
        error: "server_error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}