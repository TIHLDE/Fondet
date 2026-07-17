import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { isAllowedEmail, normalizeEmail } from "./allowlist";

let tmp: string;

beforeEach(() => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "allowlist-"));
  process.env.DATA_DIR = tmp;
  delete process.env.ADMIN_EMAILS;
});

afterEach(() => {
  delete process.env.DATA_DIR;
  delete process.env.ADMIN_EMAILS;
  fs.rmSync(tmp, { recursive: true, force: true });
});

function writeAdmins(list: string[]) {
  fs.writeFileSync(path.join(tmp, "admins.json"), JSON.stringify(list));
}

describe("isAllowedEmail", () => {
  it("accepts a listed tihlde.org address", () => {
    writeAdmins(["forvalter@tihlde.org"]);
    expect(isAllowedEmail("forvalter@tihlde.org")).toBe(true);
  });

  it("is case- and whitespace-insensitive", () => {
    writeAdmins(["Forvalter@TIHLDE.org"]);
    expect(isAllowedEmail("  FORVALTER@tihlde.ORG ")).toBe(true);
  });

  it("rejects tihlde.org addresses not on the list", () => {
    writeAdmins(["forvalter@tihlde.org"]);
    expect(isAllowedEmail("annen@tihlde.org")).toBe(false);
  });

  it("rejects other domains even when listed", () => {
    writeAdmins(["someone@gmail.com"]);
    expect(isAllowedEmail("someone@gmail.com")).toBe(false);
  });

  it("rejects lookalike domains", () => {
    writeAdmins(["a@evil-tihlde.org", "a@tihlde.org.evil.com"]);
    expect(isAllowedEmail("a@tihlde.org.evil.com")).toBe(false);
  });

  it("falls back to ADMIN_EMAILS when admins.json is missing", () => {
    process.env.ADMIN_EMAILS = "en@tihlde.org, To@Tihlde.org";
    expect(isAllowedEmail("en@tihlde.org")).toBe(true);
    expect(isAllowedEmail("to@tihlde.org")).toBe(true);
    expect(isAllowedEmail("tre@tihlde.org")).toBe(false);
  });

  it("admins.json wins over the env var when both exist", () => {
    writeAdmins(["fil@tihlde.org"]);
    process.env.ADMIN_EMAILS = "env@tihlde.org";
    expect(isAllowedEmail("fil@tihlde.org")).toBe(true);
    expect(isAllowedEmail("env@tihlde.org")).toBe(false);
  });

  it("rejects everything when no list exists", () => {
    expect(isAllowedEmail("forvalter@tihlde.org")).toBe(false);
  });
});

describe("normalizeEmail", () => {
  it("lowercases and trims", () => {
    expect(normalizeEmail("  A@B.no ")).toBe("a@b.no");
  });
});
