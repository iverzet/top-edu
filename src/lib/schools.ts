export type School = {
  slug: string;
  name: string;
  city: string;
  county: string;
  type: string;
  ownership: "Publică" | "Privată";
  levels: string;
  image: string;
  description: string;
  source: string;
};

export const schools: School[] = [
  {
    slug: "colegiul-national-sfantul-sava-bucuresti",
    name: "Colegiul Național «Sfântul Sava»",
    city: "București",
    county: "București",
    type: "Colegiu național",
    ownership: "Publică",
    levels: "Liceal",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=1200&q=82",
    description: "Profil demonstrativ pentru structura viitoare a paginilor de școală. Datele vor fi validate înainte de publicarea registrului complet.",
    source: "Rețeaua școlară / SIIIR și registre ARACIP",
  },
  {
    slug: "scoala-centrala-bucuresti",
    name: "Școala Centrală",
    city: "București",
    county: "București",
    type: "Școală gimnazială",
    ownership: "Publică",
    levels: "Primar și gimnazial",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=82",
    description: "Profil demonstrativ. Fotografiile și informațiile editoriale vor fi publicate numai după verificarea sursei și a drepturilor de utilizare.",
    source: "Rețeaua școlară / SIIIR și registre ARACIP",
  },
  {
    slug: "colegiul-national-gheorghe-lazar-bucuresti",
    name: "Colegiul Național «Gheorghe Lazăr»",
    city: "București",
    county: "București",
    type: "Colegiu național",
    ownership: "Publică",
    levels: "Liceal",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=82",
    description: "Exemplu de profil pentru validarea produsului. Scorurile și recenziile nu sunt afișate până când sistemul de moderare nu este activ.",
    source: "Rețeaua școlară / SIIIR și registre ARACIP",
  },
];

export function getSchool(slug: string) {
  return schools.find((school) => school.slug === slug);
}
