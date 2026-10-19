import statusData from "@/data/aracip-status.json";

export type AracipStatus = {
  siiirCode: string;
  schoolName: string;
  county: string;
  source: string;
  registerType?: string;
  accreditationOrder?: string;
  lastExternalEvaluation?: string | null;
  nextEvaluationSchoolYear?: string | null;
  sources: Array<{ registerType: string; updatedAt: string; contact?: string; order?: string; nextEvaluationSchoolYear?: string }>;
};

const statusBySiiir = statusData as unknown as Record<string, AracipStatus>;

export function getAracipStatus(siiirCode: string) {
  return statusBySiiir[siiirCode];
}
