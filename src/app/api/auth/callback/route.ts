import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createToken,
  verifyToken,
} from "@/lib/auth-token";
import { isAllowedEmail } from "@/lib/allowlist";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const email = await verifyToken(token, "login");
  // Re-check the allowlist: the address may have been removed between the
  // mail being sent and the link being clicked.
  if (!email || !isAllowedEmail(email)) {
    return NextResponse.redirect(new URL("/admin/login?feil=ugyldig", request.url));
  }
  const session = await createToken(email, "session");
  const res = NextResponse.redirect(new URL("/admin", request.url));
  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
