import { describe, it, expect } from "vitest";
import { withImages, resolveGroupImages } from "./member-images";
import type { Member } from "@/data/members";

function member(id: string, image = ""): Member {
  return { id, name: id, role: "Medlem", image } as Member;
}

describe("resolveGroupImages", () => {
  it("returns group.jpg first, then numbered images", () => {
    const images = resolveGroupImages("");
    expect(images[0]).toBe("/api/members/group.jpg");
    expect(images).toContain("/api/members/group-2.jpg");
    expect(images).toContain("/api/members/group-3.jpg");
    const numbered = images.slice(1);
    expect(numbered).toEqual([...numbered].sort());
  });

  it("only returns group images", () => {
    for (const img of resolveGroupImages("")) {
      expect(img).toMatch(/^\/api\/members\/group(-\d+)?\.(jpg|jpeg|png|webp)$/);
    }
  });
});

describe("withImages", () => {
  it("finds a portrait by member id convention", () => {
    const [m] = withImages([member("martine-lokstad")]);
    expect(m.image).toBe("/api/members/martine-lokstad.jpg");
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
