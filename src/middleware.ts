import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth-token";

// Page gate for the admin area. The allowlist re-check happens in the API
// routes (requireAdmin); this edge middleware only verifies the session
// cookie, since it cannot read files.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const email = token ? await verifyToken(token, "session") : null;
  if (!email) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
