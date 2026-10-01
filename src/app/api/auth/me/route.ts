import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";

export async function GET() {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;

    console.log("[ME] cookie:", token ? "FOUND" : "NOT FOUND");

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const session = await verifySessionToken(token);

    console.log("[ME] session:", session);

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: session });
  } catch (error) {
    console.error("[ME ERROR]", error);

    return NextResponse.json(
      { user: null, error: "server_error" },
      { status: 500 }
    );
  }
}