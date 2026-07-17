import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth-token";
import { isAllowedEmail, normalizeEmail } from "@/lib/allowlist";
import { sendLoginEmail } from "@/lib/send-email";

const COOLDOWN_MS = 60_000;
const lastRequest = new Map<string, number>();

// Same response no matter what, so nobody can probe which addresses are on
// the admin list.
const RESPONSE = {
  message: "Hvis adressen er autorisert, er en innloggingslenke sendt.",
};

function baseUrl(request: Request): string {
  const url = new URL(request.url);
  const proto = request.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  return `${proto}://${url.host}`;
}

export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = normalizeEmail(String(body?.email ?? ""));
  } catch {
    // malformed body gets the generic response too
  }
  if (!email || !isAllowedEmail(email)) return NextResponse.json(RESPONSE);

  const now = Date.now();
  if (now - (lastRequest.get(email) ?? 0) < COOLDOWN_MS) {
    return NextResponse.json(RESPONSE);
  }
  lastRequest.set(email, now);

  try {
    const token = await createToken(email, "login");
    const link = `${baseUrl(request)}/api/auth/callback?token=${encodeURIComponent(token)}`;
    await sendLoginEmail(email, link);
  } catch (err) {
    // still the generic response; the failure is for the server log
    console.error("[auth] kunne ikke sende innloggingslenke:", err);
  }
  return NextResponse.json(RESPONSE);
}
