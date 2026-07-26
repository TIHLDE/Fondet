import { describe, it, expect } from "vitest";
import { RateLimiter, clientIp } from "./rate-limit";

describe("RateLimiter", () => {
  it("allows up to the limit and blocks after it", () => {
    const rl = new RateLimiter(3, 1000);
    expect(rl.check("a", 0)).toBe(true);
    expect(rl.check("a", 0)).toBe(true);
    expect(rl.check("a", 0)).toBe(true);
    expect(rl.check("a", 0)).toBe(false);
  });

  it("keeps separate buckets per key", () => {
    const rl = new RateLimiter(1, 1000);
    expect(rl.check("a", 0)).toBe(true);
    expect(rl.check("b", 0)).toBe(true);
    expect(rl.check("a", 0)).toBe(false);
  });

  it("resets once the window has passed", () => {
    const rl = new RateLimiter(1, 1000);
    expect(rl.check("a", 0)).toBe(true);
    expect(rl.check("a", 500)).toBe(false);
    expect(rl.check("a", 1000)).toBe(true);
  });

  it("prunes expired keys so the map cannot grow without bound", () => {
    const rl = new RateLimiter(1, 1000);
    for (let i = 0; i < 100; i++) rl.check(`ip-${i}`, 0);
    rl.check("later", 5000);
    // @ts-expect-error reaching into the private map to assert the pruning
    expect(rl.hits.size).toBe(1);
  });
});

describe("clientIp", () => {
  const req = (headers: Record<string, string>) =>
    new Request("https://example.com", { headers });

  it("takes only the first hop of x-forwarded-for", () => {
    expect(clientIp(req({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe(
      "1.2.3.4",
    );
  });

  it("falls back to x-real-ip, then to a shared bucket", () => {
    expect(clientIp(req({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(clientIp(req({}))).toBe("unknown");
  });
});
