// Stateless auth tokens, edge-safe (no fs, runs in middleware too). Two uses:
// "login" is the short-lived magic-link token, "session" the cookie set after
// the link is clicked. Both are HS256 JWTs signed with AUTH_SECRET, so a
// login token can never be replayed as a session and vice versa.

import { SignJWT, jwtVerify } from "jose";

const ISSUER = "fondet";

export const SESSION_COOKIE = "fondet_session";
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export type TokenType = "login" | "session";

const TTL: Record<TokenType, string> = { login: "15m", session: "7d" };

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createToken(
  email: string,
  type: TokenType,
): Promise<string> {
  return new SignJWT({ email, use: type })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(TTL[type])
    .sign(secretKey());
}

// Returns the email, or null on any failure (bad signature, expired, wrong
// type, missing AUTH_SECRET). Never throws: middleware treats null as
// "not logged in".
export async function verifyToken(
  token: string,
  type: TokenType,
): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: ISSUER });
    if (payload.use !== type || typeof payload.email !== "string") return null;
    return payload.email;
  } catch {
    return null;
  }
}
