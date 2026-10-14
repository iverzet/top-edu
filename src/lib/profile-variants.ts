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

export type ProfileVariantPresentation = {
  populationLabel: string;
  groupLabel: string;
  eyebrow: string;
  description: string;
  image: string;
  imageAlt: string;
  focusTitle: string;
  focusItems: readonly string[];
};

export const profileVariantPresentation: Record<ProfileVariantKind, ProfileVariantPresentation> = {
  gradinita: { populationLabel: "copii", groupLabel: "grupe", eyebrow: "Primii pași în educație", description: "Programul, grupele și serviciile care contează pentru familie.", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=85", imageAlt: "Imagine ilustrativă pentru educația preșcolară", focusTitle: "Ce verificăm la o grădiniță", focusItems: ["Program normal sau prelungit", "Grupe și efective", "Masă, activități și spații"] },
  cresa: { populationLabel: "copii", groupLabel: "grupe", eyebrow: "Îngrijire și educație timpurie", description: "Capacitate, program și servicii explicate simplu pentru părinți.", image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1400&q=85", imageAlt: "Imagine ilustrativă pentru o creșă", focusTitle: "Ce verificăm la o creșă", focusItems: ["Capacitate și grupe", "Program, masă și somn", "Înscriere și servicii medicale"] },
  "scoala-primara": { populationLabel: "elevi", groupLabel: "clase", eyebrow: "Un început bun", description: "Clasele, programul și activitățile pentru primii ani de școală.", image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=85", imageAlt: "Imagine ilustrativă pentru școala primară", focusTitle: "Ce verificăm la o școală primară", focusItems: ["Clase pregătitoare–IV", "Program și școală după școală", "Limbi străine și activități"] },
  "scoala-gimnaziala": { populationLabel: "elevi", groupLabel: "clase", eyebrow: "Date pentru alegerea potrivită", description: "Efective, activități și rezultate la Evaluarea Națională.", image: "/top-edu-family.png", imageAlt: "Elevi în curtea unei școli", focusTitle: "Ce verificăm la gimnaziu", focusItems: ["Rezultate la Evaluarea Națională", "Evoluția numărului de elevi", "Activități și facilități"] },
  "liceu-colegiu": { populationLabel: "elevi", groupLabel: "clase", eyebrow: "Următorul drum începe informat", description: "Specializări, admitere și rezultate la Bacalaureat puse în context.", image: "/top-edu-family.png", imageAlt: "Adolescenți în curtea unei școli din România", focusTitle: "Ce verificăm la un liceu", focusItems: ["Specializări și calificări", "Rezultate la Bacalaureat", "Admitere și ultimele medii"] },
  "scoala-profesionala": { populationLabel: "elevi", groupLabel: "clase", eyebrow: "Meserii și competențe", description: "Calificări, învățământ dual și informații despre practica profesională.", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85", imageAlt: "Imagine ilustrativă pentru învățământ profesional", focusTitle: "Ce verificăm la profesională", focusItems: ["Calificări disponibile", "Învățământ dual", "Practică și parteneri economici"] },
  "scoala-postliceala": { populationLabel: "cursanți", groupLabel: "clase", eyebrow: "Calificare după liceu", description: "Programe, acreditare și condiții de admitere pentru formarea postliceală.", image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=85", imageAlt: "Imagine ilustrativă pentru formare postliceală", focusTitle: "Ce verificăm la postliceală", focusItems: ["Programe și calificări", "Acreditare și durată", "Admitere, locuri și taxe"] },
  "invatamant-special": { populationLabel: "elevi", groupLabel: "grupe și clase", eyebrow: "Sprijin pentru fiecare copil", description: "Niveluri, servicii și accesibilitate prezentate cu grijă.", image: "https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=1400&q=85", imageAlt: "Imagine ilustrativă pentru educație incluzivă", focusTitle: "Ce verificăm la o unitate incluzivă", focusItems: ["Servicii educaționale", "Terapii și consiliere", "Accesibilitate și transport"] },
  "centru-excelenta": { populationLabel: "elevi", groupLabel: "grupe", eyebrow: "Curiozitatea devine performanță", description: "Discipline, selecție și rezultate pentru elevii cu performanțe înalte.", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=85", imageAlt: "Imagine ilustrativă pentru un centru de excelență", focusTitle: "Ce verificăm la centrul de excelență", focusItems: ["Discipline și grupe", "Selecție și calendar", "Olimpiade și rezultate"] },
  "club-sportiv-scolar": { populationLabel: "sportivi", groupLabel: "grupe", eyebrow: "Mișcare, echipă și încredere", description: "Ramuri sportive, baze, înscriere și rezultate competiționale.", image: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1400&q=85", imageAlt: "Imagine ilustrativă pentru un club sportiv școlar", focusTitle: "Ce verificăm la clubul sportiv", focusItems: ["Ramuri sportive și grupe", "Selecții și înscriere", "Baze și rezultate"] },
  "clubul-copiilor": { populationLabel: "copii", groupLabel: "cercuri", eyebrow: "Pasiuni care cresc împreună", description: "Cercuri, activități și înscriere pentru timpul liber al copiilor.", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85", imageAlt: "Imagine ilustrativă pentru activități ale copiilor", focusTitle: "Ce verificăm la clubul copiilor", focusItems: ["Cercuri și categorii de vârstă", "Program și înscriere", "Activități și participări"] },
  "centru-suport": { populationLabel: "beneficiari", groupLabel: "servicii", eyebrow: "Sprijin educațional public", description: "Servicii, acoperire și documente utile pentru elevi și profesioniști.", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=85", imageAlt: "Imagine ilustrativă pentru un centru educațional", focusTitle: "Ce verificăm la centrul de suport", focusItems: ["Servicii și aria de acoperire", "Program și contact public", "Documente și proceduri"] },
};

type CategorisableSchool = { name: string; type: string; levels?: string };
type CategorisableEnrichment = { enrollment?: { levels?: string[]; specialEducation?: boolean } };

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

export function resolveProfileVariant(school: CategorisableSchool, enrichment?: CategorisableEnrichment): ProfileVariantKind {
  const name = normalize(school.name);
  const type = normalize(school.type);
  const levels = normalize([school.levels, ...(enrichment?.enrollment?.levels ?? [])].filter(Boolean).join(" "));

  if (/CENTRU.*EXCELENTA/.test(`${name} ${type}`)) return "centru-excelenta";
  if (/CLUB SPORTIV/.test(`${name} ${type}`)) return "club-sportiv-scolar";
  if (/CLUBUL COPIILOR|PALATUL COPIILOR/.test(`${name} ${type}`)) return "clubul-copiilor";
  if (/CSEI|CENTRU SCOLAR.*EDUCATIE INCLUZIVA|SPECIAL|DEFICIENT|HIPOACUZIC|SURZI/.test(name)) return "invatamant-special";
  if (/CRESA/.test(name)) return "cresa";
  if (/GRADINITA/.test(name) || /EDUCATIE TIMPURIE/.test(type)) return "gradinita";
  if (/POSTLICEAL/.test(name)) return "scoala-postliceala";
  if (/SCOALA PROFESIONALA/.test(name)) return "scoala-profesionala";
  if (/LICEU|COLEGIU|SEMINAR/.test(name)) return "liceu-colegiu";
  if (/SCOALA GIMNAZIALA/.test(name)) return "scoala-gimnaziala";
  if (/SCOALA PRIMARA/.test(name)) return "scoala-primara";
  if (/CJRAE|CCD|CASA CORPULUI DIDACTIC|INSPECTORAT|CENTRU|COMISIE|MINISTER/.test(`${name} ${type}`)) return "centru-suport";
  if (enrichment?.enrollment?.specialEducation) return "invatamant-special";
  if (/POSTLICEAL/.test(levels)) return "scoala-postliceala";
  if (/LICEAL/.test(levels)) return "liceu-colegiu";
  if (/PROFESIONAL/.test(levels)) return "scoala-profesionala";
  if (/GIMNAZIAL/.test(levels)) return "scoala-gimnaziala";
  if (/PRIMAR/.test(levels)) return "scoala-primara";
  if (/PRESCOLAR/.test(levels)) return "gradinita";
  if (/ANTEPRESCOLAR/.test(levels)) return "cresa";
  return "scoala-gimnaziala";
}
