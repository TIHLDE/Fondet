import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { GET } from "./route";

let dir: string;

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "fondet-reports-"));
  process.env.DATA_DIR = dir;
  fs.mkdirSync(path.join(dir, "reports"));
  fs.writeFileSync(
    path.join(dir, "reports", "arsrapport-2025.pdf"),
    "%PDF-1.4 test",
  );
});

afterEach(() => {
  delete process.env.DATA_DIR;
  fs.rmSync(dir, { recursive: true, force: true });
});

function get(file: string) {
  return GET(new Request("http://localhost/api/reports/x"), {
    params: Promise.resolve({ file }),
  });
}

describe("GET /api/reports/[file]", () => {
  it("serves an uploaded pdf", async () => {
    const res = await get("arsrapport-2025.pdf");
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(await res.text()).toContain("%PDF");
  });

  it("404s for missing files and non-pdf names", async () => {
    expect((await get("finnes-ikke.pdf")).status).toBe(404);
    expect((await get("arsrapport-2025.txt")).status).toBe(404);
  });

  it("blocks path traversal", async () => {
    fs.writeFileSync(path.join(dir, "hemmelig.pdf"), "%PDF topp hemmelig");
    expect((await get("../hemmelig.pdf")).status).toBe(404);
    expect((await get("..%2Fhemmelig.pdf")).status).toBe(404);
    expect((await get("%2e%2e/hemmelig.pdf")).status).toBe(404);
  });
});
