import schoolData from "@/data/schools.json";

export type School = {
  slug: string; name: string; city: string; county: string; type: string;
  ownership: "Publică" | "Privată"; levels: string; image: string;
  description: string; source: string; siiirCode: string; status: string;
  address: string; phone: string; email: string;
};

export const schools = schoolData as School[];
export function getSchool(slug: string) { return schools.find((school) => school.slug === slug); }
