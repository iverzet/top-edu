import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();
  return [
    { url: "https://top-edu.ro", lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: "https://top-edu.ro/metodologie", lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://top-edu.ro/recenzii", lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
  ];
}
