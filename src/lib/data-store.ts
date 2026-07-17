// Volume-first JSON storage. Reads prefer DATA_DIR (a mounted volume in
// production) and fall back to the committed files in src/data, so the site
// works with no volume and admin edits survive redeploys. Writes only ever go
// to the volume; the repo copies act as seed data and go stale by design.

import fs from "fs";
import path from "path";

const REPO_DIR = path.join(process.cwd(), "src", "data");

export function getDataDir(): string {
  return process.env.DATA_DIR || path.join(process.cwd(), "data");
}

export function readJson<T>(name: string): T {
  const volume = path.join(getDataDir(), `${name}.json`);
  const repo = path.join(REPO_DIR, `${name}.json`);
  const file = fs.existsSync(volume) ? volume : repo;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
}

// Atomic write: a crash mid-write leaves the old file intact, never a
// half-written one.
export function writeJson<T>(name: string, data: T): void {
  const dir = getDataDir();
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, `${name}.json`);
  const tmp = `${target}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n");
  fs.renameSync(tmp, target);
}
