import type { MetadataRoute } from "next";
import { schools } from "@/lib/schools";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date();
  return [
    { url: "https://top-edu.ro", lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: "https://top-edu.ro/metodologie", lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://top-edu.ro/recenzii", lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    ...schools.map((school) => ({ url: `https://top-edu.ro/scoli/${school.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
