import { describe, it, expect } from "vitest";
import {
  withImages,
  resolveGroupImages,
  resolveArchiveGroupImages,
} from "./member-images";
import type { Member } from "@/data/members";

function member(id: string, image = ""): Member {
  return { id, name: id, role: "Medlem", image } as Member;
}

describe("resolveGroupImages", () => {
  it("returns group.jpg first, then numbered images", () => {
    const images = resolveGroupImages("");
    expect(images[0]).toBe("/members/group.jpg");
    expect(images).toContain("/members/group-2.jpg");
    expect(images).toContain("/members/group-3.jpg");
    const numbered = images.slice(1);
    expect(numbered).toEqual([...numbered].sort());
  });

  it("only returns group images", () => {
    for (const img of resolveGroupImages("")) {
      expect(img).toMatch(/^\/members\/group(-\d+)?\.(jpg|jpeg|png|webp)$/);
    }
  });
});

describe("resolveArchiveGroupImages", () => {
  it("returns year tagged images, newest year first", () => {
    const archive = resolveArchiveGroupImages();
    expect(archive.length).toBeGreaterThan(0);
    for (const { src, year } of archive) {
      expect(src).toMatch(/^\/members\/group-\d{4}-\d+\.(jpg|jpeg|png|webp)$/);
      expect(year).toMatch(/^\d{4}$/);
    }
    const years = archive.map((a) => a.year);
    expect(years).toEqual([...years].sort().reverse());
  });

  it("keeps current group images out of the archive", () => {
    const current = resolveGroupImages("");
    const archive = resolveArchiveGroupImages().map((a) => a.src);
    for (const src of archive) {
      expect(current).not.toContain(src);
    }
  });
});

describe("withImages", () => {
  it("finds a portrait by member id convention", () => {
    const [m] = withImages([member("martine-lokstad")]);
    expect(m.image).toBe("/members/martine-lokstad.jpg");
  });

  it("leaves members without a portrait empty", () => {
    const [m] = withImages([member("finnes-ikke")]);
    expect(m.image).toBe("");
  });

  it("keeps an explicit image url", () => {
    const [m] = withImages([member("martine-lokstad", "https://x/y.jpg")]);
    expect(m.image).toBe("https://x/y.jpg");
  });
});
