// Edge-safe session tokens (jose HS256). No next/headers imports here —
// this module is also used from middleware (edge runtime).
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "dixize_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Role = "USER" | "ADMIN";

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}

function secretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    // Dev fallback so `npm run dev` works without .env; production should always set SESSION_SECRET.
    return new TextEncoder().encode("dixize-dev-secret-change-me!");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      sub: String(payload.sub),
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: payload.role === "ADMIN" ? "ADMIN" : "USER",
    };
  } catch {
    return null;
  }
}
