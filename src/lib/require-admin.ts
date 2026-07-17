import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth-token";
import { isAllowedEmail } from "@/lib/allowlist";

// Gate for the admin API routes. Middleware already guards the /admin pages,
// but routes re-check here because the allowlist lives on disk and middleware
// (edge) cannot read it: removing someone from admins.json locks them out
// immediately instead of when their cookie expires. Non-GET requests must
// also come from our own origin (cheap CSRF guard on top of SameSite=Lax).
export async function requireAdmin(
  request: NextRequest,
): Promise<string | null> {
  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host !== request.nextUrl.host) return null;
      } catch {
        return null;
      }
    }
  }
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const email = await verifyToken(token, "session");
  if (!email || !isAllowedEmail(email)) return null;
  return email;
}
