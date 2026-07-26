import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { POST } from "./route";

let tmp: string;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "auth-request-"));
  process.env.DATA_DIR = tmp;
  process.env.AUTH_SECRET = "test-secret-for-vitest";
  delete process.env.PHOTON_API_URL;
  delete process.env.PHOTON_EMAIL_API_KEY;
});

afterEach(() => {
  delete process.env.DATA_DIR;
  delete process.env.AUTH_SECRET;
  fs.rmSync(tmp, { recursive: true, force: true });
  vi.restoreAllMocks();
});

function writeAdmins(list: string[]) {
  fs.writeFileSync(path.join(tmp, "admins.json"), JSON.stringify(list));
}

function post(body: unknown) {
  return POST(
    new Request("http://localhost:3000/api/auth/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

describe("POST /api/auth/request", () => {
  it("answers identically for allowed and unknown addresses", async () => {
    writeAdmins(["kjent@tihlde.org"]);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const allowed = await (await post({ email: "kjent@tihlde.org" })).json();
    const unknown = await (await post({ email: "ukjent@tihlde.org" })).json();
    const badDomain = await (await post({ email: "kjent@gmail.com" })).json();
    expect(unknown).toEqual(allowed);
    expect(badDomain).toEqual(allowed);
    // but only the allowed one got a link (console fallback without Photon-config)
    expect(log).toHaveBeenCalledTimes(1);
    expect(log.mock.calls[0].join(" ")).toContain("kjent@tihlde.org");
  });

  it("puts a signed token in the link", async () => {
    writeAdmins(["lenke@tihlde.org"]);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await post({ email: "lenke@tihlde.org" });
    const line = log.mock.calls[0].join(" ");
    expect(line).toMatch(/\/api\/auth\/callback\?token=/);
  });

  it("enforces the per-email cooldown", async () => {
    writeAdmins(["ivrig@tihlde.org"]);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    await post({ email: "ivrig@tihlde.org" });
    await post({ email: "ivrig@tihlde.org" });
    expect(log).toHaveBeenCalledTimes(1);
  });

  it("handles a malformed body", async () => {
    const res = await POST(
      new Request("http://localhost:3000/api/auth/request", {
        method: "POST",
        body: "not json",
      }),
    );
    expect(res.status).toBe(200);
  });
});
