import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { GET } from "./route";
import { createToken, SESSION_COOKIE } from "@/lib/auth-token";

let tmp: string;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "auth-callback-"));
  process.env.DATA_DIR = tmp;
  process.env.AUTH_SECRET = "test-secret-for-vitest";
});

afterEach(() => {
  delete process.env.DATA_DIR;
  delete process.env.AUTH_SECRET;
  fs.rmSync(tmp, { recursive: true, force: true });
});

function writeAdmins(list: string[]) {
  fs.writeFileSync(path.join(tmp, "admins.json"), JSON.stringify(list));
}

function get(token: string) {
  return GET(
    new Request(
      `http://localhost:3000/api/auth/callback?token=${encodeURIComponent(token)}`,
    ),
  );
}

describe("GET /api/auth/callback", () => {
  it("sets a session cookie and redirects to /admin for a valid link", async () => {
    writeAdmins(["gyldig@tihlde.org"]);
    const token = await createToken("gyldig@tihlde.org", "login");
    const res = await get(token);
    expect(res.headers.get("location")).toContain("/admin");
    expect(res.headers.get("location")).not.toContain("feil");
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toContain(`${SESSION_COOKIE}=`);
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie.toLowerCase()).toContain("samesite=lax");
  });

  it("rejects a garbage token", async () => {
    const res = await get("garbage");
    expect(res.headers.get("location")).toContain("feil=ugyldig");
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("rejects a session token pasted into the callback", async () => {
    writeAdmins(["gyldig@tihlde.org"]);
    const token = await createToken("gyldig@tihlde.org", "session");
    const res = await get(token);
    expect(res.headers.get("location")).toContain("feil=ugyldig");
  });

  it("rejects when the address was removed from the allowlist", async () => {
    writeAdmins(["fjernet@tihlde.org"]);
    const token = await createToken("fjernet@tihlde.org", "login");
    writeAdmins([]);
    const res = await get(token);
    expect(res.headers.get("location")).toContain("feil=ugyldig");
    expect(res.headers.get("set-cookie")).toBeNull();
  });
});
