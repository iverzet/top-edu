import type { MetadataRoute } from "next";
import { schools } from "@/lib/schools";
import { profileVariantKinds } from "@/lib/profile-variants";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep lastmod stable between requests; update this when the official import changes.
  const updated = new Date("2026-10-06T00:00:00.000Z");
  return [
    { url: "https://top-edu.ro", lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: "https://top-edu.ro/metodologie", lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://top-edu.ro/recenzii", lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    ...profileVariantKinds.map((kind) => ({ url: `https://top-edu.ro/profiluri/${kind}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...schools.map((school) => ({ url: `https://top-edu.ro/scoli/${school.slug}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
