import resultsData from "@/data/exam-results.json";

export type ExamResult = {
  siiirCode: string;
  exam: "Evaluarea Națională" | "Bacalaureat";
  year: number;
  average?: number | null;
  passRate?: number | null;
  candidates?: number;
  source: string;
};

const results = resultsData as ExamResult[];

export function getExamResults(siiirCode: string) {
  return results.filter((result) => result.siiirCode === siiirCode).sort((a, b) => b.year - a.year);
}
