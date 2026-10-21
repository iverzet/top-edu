import investmentData from "@/data/school-investments.json";

export type SchoolInvestment = {
  siiirCode: string;
  program: "PNDR" | "PNRR" | "PS PAC" | "alte fonduri publice";
  title: string;
  beneficiary: string;
  status?: string;
  year?: string;
  amountLei?: number;
  source: string;
};

const investmentsBySiiir = investmentData as Record<string, SchoolInvestment[]>;

/** Only records explicitly matched to this school's SIIIR code are returned. */
export function getSchoolInvestments(siiirCode: string) {
  return investmentsBySiiir[siiirCode] ?? [];
}
