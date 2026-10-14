import imageData from "@/data/school-images.json";

export type VerifiedSchoolImage = {
  siiirCode: string;
  imageUrl: string;
  source: "wikimedia" | "mapillary" | "kartaview" | "panoramax";
  sourceUrl: string;
  author: string;
  license: string;
  licenseUrl?: string;
  alt: string;
  distanceMeters: number;
  confidence: number;
  verifiedBy: "deepseek-flash";
  verifiedAt: string;
  mapillaryImageId?: string;
  kartaviewImageId?: string;
  panoramaxImageId?: string;
};

const imagesBySiiir = imageData as Record<string, VerifiedSchoolImage>;

export function getVerifiedSchoolImage(siiirCode: string) {
  return imagesBySiiir[siiirCode];
}
