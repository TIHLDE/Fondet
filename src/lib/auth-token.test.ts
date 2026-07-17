import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createToken, verifyToken } from "./auth-token";

beforeEach(() => {
  process.env.AUTH_SECRET = "test-secret-for-vitest";
});

afterEach(() => {
  delete process.env.AUTH_SECRET;
  vi.useRealTimers();
});

describe("auth tokens", () => {
  it("round-trips a login token", async () => {
    const token = await createToken("a@tihlde.org", "login");
    expect(await verifyToken(token, "login")).toBe("a@tihlde.org");
  });

  it("rejects a login token used as session and vice versa", async () => {
    const login = await createToken("a@tihlde.org", "login");
    const session = await createToken("a@tihlde.org", "session");
    expect(await verifyToken(login, "session")).toBeNull();
    expect(await verifyToken(session, "login")).toBeNull();
  });

  it("rejects an expired login token", async () => {
    vi.useFakeTimers();
    const token = await createToken("a@tihlde.org", "login");
    vi.setSystemTime(Date.now() + 16 * 60 * 1000);
    expect(await verifyToken(token, "login")).toBeNull();
  });

  it("accepts a session token within 7 days but not after", async () => {
    vi.useFakeTimers();
    const token = await createToken("a@tihlde.org", "session");
    vi.setSystemTime(Date.now() + 6 * 24 * 60 * 60 * 1000);
    expect(await verifyToken(token, "session")).toBe("a@tihlde.org");
    vi.setSystemTime(Date.now() + 2 * 24 * 60 * 60 * 1000);
    expect(await verifyToken(token, "session")).toBeNull();
  });

  it("rejects a tampered token", async () => {
    const token = await createToken("a@tihlde.org", "login");
    const parts = token.split(".");
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    payload.email = "b@tihlde.org";
    parts[1] = Buffer.from(JSON.stringify(payload)).toString("base64url");
    expect(await verifyToken(parts.join("."), "login")).toBeNull();
  });

  it("rejects a token signed with a different secret", async () => {
    const token = await createToken("a@tihlde.org", "login");
    process.env.AUTH_SECRET = "some-other-secret";
    expect(await verifyToken(token, "login")).toBeNull();
  });

  it("verify returns null instead of throwing when AUTH_SECRET is unset", async () => {
    const token = await createToken("a@tihlde.org", "login");
    delete process.env.AUTH_SECRET;
    expect(await verifyToken(token, "login")).toBeNull();
  });
});
