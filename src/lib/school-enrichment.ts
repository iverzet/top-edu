import enrichmentData from "@/data/school-enrichment.json";
import countyInvestmentData from "@/data/county-investments.json";

export type EnrollmentSnapshot = {
  schoolYear: string;
  students?: number;
  classes?: number;
  source: string;
};

export type SchoolEnrichment = {
  siiirCode: string;
  enrollment?: EnrollmentSnapshot & {
    levels?: string[];
    languages?: string[];
    specializations?: string[];
    studyForms?: string[];
    dual?: boolean;
    specialEducation?: boolean;
  };
  enrollmentHistory?: EnrollmentSnapshot[];
  coordinates?: {
    latitude: number;
    longitude: number;
    source: string;
  };
  quality?: {
    lastExternalEvaluation?: string;
    nextEvaluationSchoolYear?: string;
    registerType: string;
    source: string;
  };
  officialWebsite?: string;
  vacanciesUrl?: string;
  procurementUrl?: string;
  budgetUrl?: string;
  admission?: Array<{
    year?: string;
    specialization: string;
    lastAverage?: number;
    places?: number;
    source?: string;
  }>;
};

export type CountyInvestment = {
  totalEuro?: number;
  totalLei?: number;
  scope: "județean";
  source: string;
  investments: Array<{
    numeProiect: string;
    proiecteDepuse?: number;
    unitatiBeneficiare?: number;
    valoareEur?: number;
    valoareLei?: number;
  }>;
};

const enrichment = enrichmentData as SchoolEnrichment[];
const enrichmentBySiiir = new Map(enrichment.map((item) => [item.siiirCode, item]));
const countyInvestments = countyInvestmentData as Record<string, CountyInvestment>;

export function getSchoolEnrichment(siiirCode: string) {
  return enrichmentBySiiir.get(siiirCode);
}

export function getCountyInvestment(countyCode: string) {
  return countyInvestments[countyCode];
}
