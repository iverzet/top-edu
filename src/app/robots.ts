import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://www.top-edu.ro/sitemap.xml",
    host: "https://www.top-edu.ro",
  };
}
