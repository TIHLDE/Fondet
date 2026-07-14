import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/content", () => {
  it("returns reports and nothing else that admin used to write", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.reports)).toBe(true);
    expect(body.reports.length).toBeGreaterThan(0);
    // søknader/vedtak live in SoknaderTable, not content.json
    expect(body.applications).toBeUndefined();
  });

  it("every report has title, url and type", async () => {
    const res = await GET();
    const body = await res.json();
    for (const report of body.reports) {
      expect(report.title).toBeTruthy();
      // external Drive links or files served from public/
      expect(report.url).toMatch(/^(https:\/\/|\/)/);
      expect(report.type).toBeTruthy();
    }
  });
});
