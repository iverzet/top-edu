import schoolData from "@/data/schools.json";
import secondaryData from "@/data/school-secondary.json";

export type SecondaryContact = {
  sourceUrl: string;
  sourceDomain: string;
  sourceType: "autoritate_publica" | "director_educational" | "site_public_candidat";
  confidence: "candidate";
  address?: string;
  phone?: string;
  email?: string;
  levelsAndSpecializations?: string;
  facilities?: string;
};
export type School = {
  slug: string; name: string; city: string; county: string; type: string;
  ownership: "Publică" | "Privată"; levels: string; image: string;
  description: string; source: string; siiirCode: string; status: string;
  address: string; phone: string; email: string;
  secondaryContact?: SecondaryContact;
};

const secondaryBySiiir = new Map(
  (secondaryData as Array<SecondaryContact & { siiirCode: string }>).map((item) => [item.siiirCode, item]),
);

export const schools = (schoolData as School[]).map((school) => {
  const secondary = secondaryBySiiir.get(school.siiirCode);
  if (!secondary) return school;
  return {
    ...school,
    address: school.address || secondary.address || "",
    phone: school.phone || secondary.phone || "",
    email: school.email || secondary.email || "",
    secondaryContact: secondary,
  };
});
export function getSchool(slug: string) { return schools.find((school) => school.slug === slug); }
