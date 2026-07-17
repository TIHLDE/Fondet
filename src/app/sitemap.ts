import type { MetadataRoute } from "next";

const BASE = "https://fondet.tihlde.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/about",
    "/apply",
    "/apply/skjema",
    "/group",
    "/group/tidligere",
    "/reports",
  ];
  return paths.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "" || path === "/reports" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
