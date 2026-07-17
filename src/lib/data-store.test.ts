import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { readJson, writeJson, getDataDir } from "./data-store";

let tmp: string;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "data-store-"));
  process.env.DATA_DIR = tmp;
});

afterEach(() => {
  delete process.env.DATA_DIR;
  fs.rmSync(tmp, { recursive: true, force: true });
});

describe("data-store", () => {
  it("uses DATA_DIR when set", () => {
    expect(getDataDir()).toBe(tmp);
  });

  it("defaults to ./data when DATA_DIR is unset", () => {
    delete process.env.DATA_DIR;
    expect(getDataDir()).toBe(path.join(process.cwd(), "data"));
  });

  it("reads from the volume when the file exists there", () => {
    fs.writeFileSync(path.join(tmp, "members.json"), '{"volume":true}');
    expect(readJson<{ volume: boolean }>("members").volume).toBe(true);
  });

  it("falls back to src/data when the volume copy is missing", () => {
    const fromRepo = readJson<{ reports: unknown[] }>("content");
    expect(Array.isArray(fromRepo.reports)).toBe(true);
  });

  it("throws when neither copy exists", () => {
    expect(() => readJson("does-not-exist")).toThrow();
  });

  it("writeJson lands in the volume and reads back", () => {
    writeJson("roundtrip", { a: 1 });
    expect(readJson<{ a: number }>("roundtrip").a).toBe(1);
    expect(fs.existsSync(path.join(tmp, "roundtrip.json"))).toBe(true);
  });

  it("writeJson leaves no tmp file behind", () => {
    writeJson("clean", [1, 2, 3]);
    expect(fs.readdirSync(tmp)).toEqual(["clean.json"]);
  });

  it("writeJson creates the volume dir when missing", () => {
    process.env.DATA_DIR = path.join(tmp, "nested", "deep");
    writeJson("made", {});
    expect(fs.existsSync(path.join(tmp, "nested", "deep", "made.json"))).toBe(
      true,
    );
  });
});
