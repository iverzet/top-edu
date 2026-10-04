import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://top-edu.ro/sitemap.xml",
    host: "https://top-edu.ro",
  };
}
