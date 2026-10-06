export const profileVariantKinds = [
  "gradinita",
  "cresa",
  "scoala-primara",
  "scoala-gimnaziala",
  "liceu-colegiu",
  "scoala-profesionala",
  "scoala-postliceala",
  "invatamant-special",
  "centru-excelenta",
  "club-sportiv-scolar",
  "clubul-copiilor",
  "centru-suport",
] as const;

export type ProfileVariantKind = (typeof profileVariantKinds)[number];

export const profileVariantLabels: Record<ProfileVariantKind, string> = {
  gradinita: "Grădiniță",
  cresa: "Creșă",
  "scoala-primara": "Școală primară",
  "scoala-gimnaziala": "Școală gimnazială",
  "liceu-colegiu": "Liceu sau colegiu",
  "scoala-profesionala": "Școală profesională",
  "scoala-postliceala": "Școală postliceală",
  "invatamant-special": "Învățământ special",
  "centru-excelenta": "Centru de excelență",
  "club-sportiv-scolar": "Club sportiv școlar",
  "clubul-copiilor": "Clubul Copiilor",
  "centru-suport": "Centru de suport",
};
