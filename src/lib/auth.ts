import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const ADMIN_USERS = [
  {
    username: "admin",
    passwordHash:
      "$2b$10$k8XnE2LuPnTpkwPTjYun/eFTbRE7VuxGS7kdRf7vY06aF2BezphLG",
  },
];

export const COOKIE_NAME = "admin_token";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
}

export async function verifyPassword(username: string, password: string) {
  const user = ADMIN_USERS.find((u) => u.username === username);
  if (!user) return false;
  return bcrypt.compare(password, user.passwordHash);
}

export async function createToken(username: string) {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(getSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}
