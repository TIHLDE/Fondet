import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { createToken, SESSION_COOKIE } from "@/lib/auth-token";

const URL_ = "http://localhost:3000/api/admin/members";

async function sessionCookie(email: string): Promise<string> {
  return `${SESSION_COOKIE}=${await createToken(email, "session")}`;
}

beforeEach(() => {
  process.env.AUTH_SECRET = "test-secret";
  process.env.ADMIN_EMAILS = "forvalter@tihlde.org";
});

afterEach(() => {
  delete process.env.AUTH_SECRET;
  delete process.env.ADMIN_EMAILS;
});

describe("admin members auth gate", () => {
  it("rejects requests without a session cookie", async () => {
    expect((await GET(new NextRequest(URL_))).status).toBe(401);
    const res = await POST(new NextRequest(URL_, { method: "POST" }));
    expect(res.status).toBe(401);
  });

  it("rejects a session for an email no longer on the allowlist", async () => {
    const cookie = await sessionCookie("fjernet@tihlde.org");
    const res = await GET(new NextRequest(URL_, { headers: { cookie } }));
    expect(res.status).toBe(401);
  });

  it("rejects writes from a foreign origin even with a valid session", async () => {
    const cookie = await sessionCookie("forvalter@tihlde.org");
    const res = await POST(
      new NextRequest(URL_, {
        method: "POST",
        headers: { cookie, origin: "https://angriper.example" },
      }),
    );
    expect(res.status).toBe(401);
  });

  it("accepts writes when the Origin matches the Host header", async () => {
    const cookie = await sessionCookie("forvalter@tihlde.org");
    const res = await POST(
      new NextRequest(URL_, {
        method: "POST",
        // invalid body: reaching 400 proves the request passed the auth and
        // origin gates without writing anything
        body: "ikke json",
        headers: {
          cookie,
          origin: "http://localhost:3000",
          host: "localhost:3000",
        },
      }),
    );
    expect(res.status).toBe(400);
  });

  it("lets an allowlisted session read", async () => {
    const cookie = await sessionCookie("forvalter@tihlde.org");
    const res = await GET(new NextRequest(URL_, { headers: { cookie } }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data.allMembers)).toBe(true);
  });
});
