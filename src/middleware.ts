import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth-token";

// Page gate for the admin area. The allowlist re-check happens in the API
// routes (requireAdmin); this edge middleware only verifies the session
// cookie, since it cannot read files.
export async function middleware(_request: NextRequest) {
  // TEMP: auth disabled
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
