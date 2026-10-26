import type { MetadataRoute } from "next";
import { schools } from "@/lib/schools";
import { profileVariantKinds } from "@/lib/profile-variants";
import { getVerifiedSchoolImage } from "@/lib/school-images";

const SITE_URL = "https://www.top-edu.ro";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep lastmod stable between requests; update this when the official import changes.
  const updated = new Date("2026-10-26T00:00:00.000Z");
  return [
    { url: SITE_URL, lastModified: updated, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/metodologie`, lastModified: updated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/recenzii`, lastModified: updated, changeFrequency: "monthly", priority: 0.7 },
    ...profileVariantKinds.map((kind) => ({ url: `${SITE_URL}/profiluri/${kind}`, lastModified: updated, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...schools.map((school) => {
      const image = getVerifiedSchoolImage(school.siiirCode);
      return {
        url: `${SITE_URL}/scoli/${school.slug}`,
        lastModified: updated,
        changeFrequency: "monthly" as const,
        priority: 0.5,
        ...(image?.imageUrl ? { images: [`${SITE_URL}${image.imageUrl}`] } : {}),
      };
    }),
  ];
}
