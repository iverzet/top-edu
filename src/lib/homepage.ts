import { schools, type School } from "@/lib/schools";
import enrichmentData from "@/data/school-enrichment.json";
import examResultsData from "@/data/exam-results.json";
import imageData from "@/data/school-images.json";
import aracipData from "@/data/aracip-status.json";

type Enrichment = {
  siiirCode: string;
  enrollment?: unknown;
  enrollmentHistory?: unknown[];
  officialWebsite?: string;
};

type SchoolImage = { imageUrl: string };

const enrichmentBySiiir = new Map(
  (enrichmentData as Enrichment[]).map((item) => [item.siiirCode, item]),
);
const examCodes = new Set(
  (examResultsData as Array<{ siiirCode: string }>).map((item) => item.siiirCode),
);
const imagesBySiiir = imageData as Record<string, SchoolImage>;
const aracipBySiiir = aracipData as Record<string, unknown>;

function completenessScore(school: School) {
  const enrichment = enrichmentBySiiir.get(school.siiirCode);
  return (
    (imagesBySiiir[school.siiirCode] ? 5 : 0) +
    (enrichment?.officialWebsite ? 3 : 0) +
    (enrichment?.enrollment ? 2 : 0) +
    (enrichment?.enrollmentHistory?.length ? 1 : 0) +
    (examCodes.has(school.siiirCode) ? 2 : 0) +
    (aracipBySiiir[school.siiirCode] ? 1 : 0)
  );
}

function withVerifiedImage(school: School): School {
  const image = imagesBySiiir[school.siiirCode];
  return image ? { ...school, image: image.imageUrl } : school;
}

/** Homepage candidates: image plus a substantial public data profile. */
export function getHomepageSchools() {
  const ranked = schools
    .map((school) => ({ school, score: completenessScore(school) }))
    .filter(({ school, score }) => Boolean(imagesBySiiir[school.siiirCode]) && score >= 12)
    .sort((left, right) =>
      right.score - left.score || left.school.name.localeCompare(right.school.name, "ro"),
    )
    .map(({ school }) => withVerifiedImage(school));

  return {
    featured: ranked.slice(0, 3),
    searchable: ranked,
  };
}
