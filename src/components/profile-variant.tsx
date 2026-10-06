"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react";
import type { ProfileVariantKind } from "@/lib/profile-variants";

export type { ProfileVariantKind } from "@/lib/profile-variants";
type Profile = {
  type: string;
  title: string;
  place: string;
  description: string;
  image: string;
  imageAlt: string;
  callout: string;
  stats: readonly (readonly [string, string])[];
  tabs: readonly {
    label: string;
    heading: string;
    facts: readonly (readonly [string, string])[];
    note: string;
    cta: string;
  }[];
};

const profiles: Record<ProfileVariantKind, Profile> = {
  gradinita: {
    type: "Grădiniță",
    title: "Profil de grădiniță.",
    place: "Localitate în pregătire",
    description:
      "Un început plin de curiozitate. Grupe, program și informații utile pentru cei mici și familiile lor, într-un singur loc.",
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Copii la o activitate educațională",
    callout: "Loc pentru joacă și descoperire.",
    stats: [
      ["În pregătire", "Număr copii"],
      ["În pregătire", "Grupe"],
      ["Normal / prelungit", "Program"],
    ],
    tabs: [
      {
        label: "Despre grădiniță",
        heading: "Despre grădiniță",
        facts: [
          ["Număr copii", "În pregătire"],
          ["Grupe", "În pregătire"],
          ["Vârste", "În pregătire"],
          ["Masă", "În pregătire"],
        ],
        note: "Datele grădiniței sunt în pregătire. Fotografia este ilustrativă.",
        cta: "Vezi programul",
      },
      {
        label: "Program și activități",
        heading: "Program și activități",
        facts: [
          ["Program normal", "În pregătire"],
          ["Program prelungit", "În pregătire"],
          ["Activități", "În pregătire"],
          ["Înscrieri", "În pregătire"],
        ],
        note: "Publicăm numai informații confirmate de unitate sau din surse oficiale.",
        cta: "Vezi activitățile",
      },
      {
        label: "Contact și facilități",
        heading: "Contact și facilități",
        facts: [
          ["Adresă", "În pregătire"],
          ["Telefon", "În pregătire"],
          ["Masă", "În pregătire"],
          ["Curte de joacă", "În pregătire"],
        ],
        note: "Datele de contact vor fi afișate după verificare.",
        cta: "Vezi contactul",
      },
    ],
  },
  cresa: {
    type: "Creșă",
    title: "Profil de creșă.",
    place: "Localitate în pregătire",
    description:
      "Program, grupe, capacitate și servicii pentru cei mai mici copii, explicate clar pentru fiecare familie.",
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Jucării educaționale colorate pentru copii mici",
    callout: "Primii pași într-un loc sigur și prietenos.",
    stats: [
      ["În pregătire", "Locuri"],
      ["În pregătire", "Grupe"],
      ["Antepreșcolar", "Nivel"],
    ],
    tabs: [
      {
        label: "Despre creșă",
        heading: "Despre creșă",
        facts: [
          ["Capacitate", "În pregătire"],
          ["Grupe", "În pregătire"],
          ["Vârste", "În pregătire"],
          ["Administrare", "În pregătire"],
        ],
        note: "Profilul este completat numai din surse publice sau informații confirmate de unitate.",
        cta: "Vezi prezentarea",
      },
      {
        label: "Program și servicii",
        heading: "Program și servicii",
        facts: [
          ["Program", "În pregătire"],
          ["Masă", "În pregătire"],
          ["Somn", "În pregătire"],
          ["Asistență medicală", "În pregătire"],
        ],
        note: "Serviciile vor apărea după verificarea programului oficial.",
        cta: "Vezi serviciile",
      },
      {
        label: "Înscriere și contact",
        heading: "Înscriere și contact",
        facts: [
          ["Înscrieri", "În pregătire"],
          ["Adresă", "În pregătire"],
          ["Telefon", "În pregătire"],
          ["Email", "În pregătire"],
        ],
        note: "Datele de înscriere și contact sunt publicate după verificare.",
        cta: "Vezi contactul",
      },
    ],
  },
  "scoala-primara": {
    type: "Școală primară",
    title: "Profil de școală primară.",
    place: "Localitate în pregătire",
    description:
      "Clase, program, activități și informații practice pentru începutul parcursului școlar, într-un singur profil.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Elevi de școală primară într-o clasă luminoasă",
    callout: "Un început bun pentru fiecare copil.",
    stats: [
      ["În pregătire", "Elevi"],
      ["În pregătire", "Clase"],
      ["Primar", "Nivel"],
    ],
    tabs: [
      {
        label: "Despre școală",
        heading: "Despre școala primară",
        facts: [
          ["Clase", "Pregătitoare–IV"],
          ["Elevi", "În pregătire"],
          ["Formațiuni", "În pregătire"],
          ["Proprietate", "În pregătire"],
        ],
        note: "Unitatea și nivelurile sunt corelate cu rețeaua școlară oficială.",
        cta: "Vezi prezentarea",
      },
      {
        label: "Program și activități",
        heading: "Program și activități",
        facts: [
          ["Program", "În pregătire"],
          ["Școală după școală", "În pregătire"],
          ["Limbi străine", "În pregătire"],
          ["Activități", "În pregătire"],
        ],
        note: "Afișăm doar programele confirmate public de unitate.",
        cta: "Vezi activitățile",
      },
      {
        label: "Contact și facilități",
        heading: "Contact și facilități",
        facts: [
          ["Adresă", "În pregătire"],
          ["Telefon", "În pregătire"],
          ["Masă", "În pregătire"],
          ["Spații de joacă", "În pregătire"],
        ],
        note: "Contactul și facilitățile sunt în curs de verificare.",
        cta: "Vezi contactul",
      },
    ],
  },
  "scoala-gimnaziala": {
    type: "Școală gimnazială",
    title: "Profil de școală gimnazială.",
    place: "Localitate în pregătire",
    description:
      "Date clare despre clase, profesori, activități și rezultatele la Evaluarea Națională, pentru o alegere informată.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Elevi într-un campus școlar",
    callout: "Informații clare pentru fiecare familie.",
    stats: [
      ["În pregătire", "Număr elevi"],
      ["În pregătire", "Clase"],
      ["În pregătire", "Cadre didactice"],
    ],
    tabs: [
      {
        label: "Despre școală",
        heading: "Despre școală",
        facts: [
          ["Niveluri", "Primar și gimnazial"],
          ["Elevi", "În pregătire"],
          ["Clase", "În pregătire"],
          ["Proprietate", "Publică"],
        ],
        note: "Profil construit din rețeaua școlară oficială 2025–2026.",
        cta: "Vezi prezentarea",
      },
      {
        label: "Rezultate și activități",
        heading: "Rezultate și activități",
        facts: [
          ["Evaluare Națională 2025", "În pregătire"],
          ["Medie", "În pregătire"],
          ["Proiecte", "În pregătire"],
          ["Cluburi", "În pregătire"],
        ],
        note: "Rezultatele sunt afișate numai când pot fi asociate sigur unității.",
        cta: "Vezi rezultatele",
      },
      {
        label: "Contact și facilități",
        heading: "Contact și facilități",
        facts: [
          ["Adresă", "În pregătire"],
          ["Telefon", "În pregătire"],
          ["Laboratoare", "În pregătire"],
          ["Sală de sport", "În pregătire"],
        ],
        note: "Contactul public și facilitățile sunt în curs de verificare.",
        cta: "Vezi contactul",
      },
    ],
  },
  "liceu-colegiu": {
    type: "Liceu / colegiu",
    title: "Profil de liceu sau colegiu.",
    place: "Localitate în pregătire",
    description:
      "Specializări, admitere și rezultate la Bacalaureat, puse în context pentru elevii care își aleg următorul drum.",
    image: "/top-edu-family.png",
    imageAlt: "Adolescenți în curtea unei școli din România",
    callout: "Alege informat următorul tău drum.",
    stats: [
      ["În pregătire", "Elevi"],
      ["În pregătire", "Specializări"],
      ["2025", "Rezultate BAC"],
    ],
    tabs: [
      {
        label: "Despre liceu",
        heading: "Despre liceu sau colegiu",
        facts: [
          ["Filieră", "În pregătire"],
          ["Profiluri", "În pregătire"],
          ["Elevi", "În pregătire"],
          ["Proprietate", "În pregătire"],
        ],
        note: "Tipul, profilurile și specializările sunt asociate cu datele oficiale disponibile.",
        cta: "Vezi prezentarea",
      },
      {
        label: "Admitere și BAC",
        heading: "Admitere și rezultate",
        facts: [
          ["Ultima medie 2025", "În pregătire"],
          ["Promovare BAC 2025", "În pregătire"],
          ["Medie BAC 2025", "În pregătire"],
          ["Candidați", "În pregătire"],
        ],
        note: "Rezultatele apar numai când asocierea cu unitatea este sigură.",
        cta: "Vezi rezultatele",
      },
      {
        label: "Contact și facilități",
        heading: "Contact și facilități",
        facts: [
          ["Adresă", "În pregătire"],
          ["Website", "În pregătire"],
          ["Internat", "În pregătire"],
          ["Laboratoare", "În pregătire"],
        ],
        note: "Datele de contact și facilitățile sunt verificate înainte de publicare.",
        cta: "Vezi contactul",
      },
    ],
  },
  "scoala-profesionala": {
    type: "Școală profesională",
    title: "Profil de școală profesională.",
    place: "Localitate în pregătire",
    description:
      "Calificări, practică și parteneri economici, pentru elevii care vor să învețe o meserie cerută pe piața muncii.",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Elevi într-un atelier tehnic de practică",
    callout: "Meserii reale, competențe pentru viitor.",
    stats: [
      ["În pregătire", "Calificări"],
      ["În pregătire", "Locuri"],
      ["Profesional", "Nivel"],
    ],
    tabs: [
      {
        label: "Calificări",
        heading: "Calificări și specializări",
        facts: [
          ["Domenii", "În pregătire"],
          ["Calificări", "În pregătire"],
          ["Locuri", "În pregătire"],
          ["Durată", "În pregătire"],
        ],
        note: "Oferta educațională este preluată din documentele oficiale de școlarizare.",
        cta: "Vezi calificările",
      },
      {
        label: "Practică și admitere",
        heading: "Practică și admitere",
        facts: [
          ["Parteneri de practică", "În pregătire"],
          ["Învățământ dual", "În pregătire"],
          ["Bursă", "În pregătire"],
          ["Admitere", "În pregătire"],
        ],
        note: "Parteneriatele sunt afișate numai când există o sursă publică verificabilă.",
        cta: "Vezi admiterea",
      },
      {
        label: "Contact și dotări",
        heading: "Contact și dotări",
        facts: [
          ["Adresă", "În pregătire"],
          ["Telefon", "În pregătire"],
          ["Ateliere", "În pregătire"],
          ["Internat", "În pregătire"],
        ],
        note: "Contactul și dotările sunt în curs de verificare.",
        cta: "Vezi contactul",
      },
    ],
  },
  "scoala-postliceala": {
    type: "Școală postliceală",
    title: "Profil de școală postliceală.",
    place: "Localitate în pregătire",
    description:
      "Calificări, durată, costuri și condiții de admitere pentru programele de formare de după liceu.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Cursanți într-un laborator de formare medicală",
    callout: "O calificare clară pentru pasul următor.",
    stats: [
      ["În pregătire", "Calificări"],
      ["În pregătire", "Locuri"],
      ["Postliceal", "Nivel"],
    ],
    tabs: [
      {
        label: "Programe",
        heading: "Programe și calificări",
        facts: [
          ["Domenii", "În pregătire"],
          ["Calificări", "În pregătire"],
          ["Durată", "În pregătire"],
          ["Acreditare", "În pregătire"],
        ],
        note: "Acreditarea și calificările vor avea sursa oficială indicată.",
        cta: "Vezi programele",
      },
      {
        label: "Admitere și costuri",
        heading: "Admitere și costuri",
        facts: [
          ["Condiții", "În pregătire"],
          ["Locuri", "În pregătire"],
          ["Taxă", "În pregătire"],
          ["Perioadă înscrieri", "În pregătire"],
        ],
        note: "Taxele și calendarul sunt publicate numai pentru anul curent confirmat.",
        cta: "Vezi admiterea",
      },
      {
        label: "Practică și contact",
        heading: "Practică și contact",
        facts: [
          ["Practică", "În pregătire"],
          ["Parteneri", "În pregătire"],
          ["Adresă", "În pregătire"],
          ["Website", "În pregătire"],
        ],
        note: "Informațiile despre practică și contact sunt în curs de verificare.",
        cta: "Vezi contactul",
      },
    ],
  },
  "invatamant-special": {
    type: "Învățământ special / CSEI",
    title: "Profil de unitate incluzivă.",
    place: "Localitate în pregătire",
    description:
      "Servicii educaționale, terapii, niveluri și accesibilitate, prezentate cu grijă pentru copii și familii.",
    image:
      "https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Copii lucrând împreună la o activitate educațională",
    callout: "Sprijin potrivit pentru fiecare copil.",
    stats: [
      ["În pregătire", "Servicii"],
      ["În pregătire", "Niveluri"],
      ["Incluziv", "Profil"],
    ],
    tabs: [
      {
        label: "Despre unitate",
        heading: "Despre unitate",
        facts: [
          ["Tip", "În pregătire"],
          ["Niveluri", "În pregătire"],
          ["Beneficiari", "În pregătire"],
          ["Arie deservită", "În pregătire"],
        ],
        note: "Formulările urmează denumirile oficiale ale serviciilor și unității.",
        cta: "Vezi prezentarea",
      },
      {
        label: "Servicii și terapii",
        heading: "Servicii și terapii",
        facts: [
          ["Evaluare", "În pregătire"],
          ["Terapii", "În pregătire"],
          ["Consiliere", "În pregătire"],
          ["Transport", "În pregătire"],
        ],
        note: "Serviciile sunt afișate după confirmarea informațiilor publice.",
        cta: "Vezi serviciile",
      },
      {
        label: "Acces și contact",
        heading: "Acces și contact",
        facts: [
          ["Accesibilitate", "În pregătire"],
          ["Înscriere", "În pregătire"],
          ["Adresă", "În pregătire"],
          ["Telefon", "În pregătire"],
        ],
        note: "Datele de acces și contact sunt în curs de verificare.",
        cta: "Vezi contactul",
      },
    ],
  },
  "centru-excelenta": {
    type: "Centru de excelență",
    title: "Profil de centru de excelență.",
    place: "Județ în pregătire",
    description:
      "Discipline, selecție, grupe și rezultate pentru elevii care vor să își dezvolte performanța.",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Elevi lucrând într-un laborator de științe",
    callout: "Curiozitatea devine performanță.",
    stats: [
      ["În pregătire", "Discipline"],
      ["În pregătire", "Grupe"],
      ["Județean", "Nivel"],
    ],
    tabs: [
      {
        label: "Despre centru",
        heading: "Despre centrul de excelență",
        facts: [
          ["Discipline", "În pregătire"],
          ["Grupe", "În pregătire"],
          ["Elevi", "În pregătire"],
          ["Acoperire", "Județeană"],
        ],
        note: "Profilul este corelat cu rețeaua oficială a centrelor de excelență.",
        cta: "Vezi prezentarea",
      },
      {
        label: "Selecție și rezultate",
        heading: "Selecție și rezultate",
        facts: [
          ["Selecție", "În pregătire"],
          ["Calendar", "În pregătire"],
          ["Olimpiade", "În pregătire"],
          ["Rezultate", "În pregătire"],
        ],
        note: "Rezultatele și calendarele vor avea surse publice directe.",
        cta: "Vezi rezultatele",
      },
      {
        label: "Program și contact",
        heading: "Program și contact",
        facts: [
          ["Program", "În pregătire"],
          ["Locații", "În pregătire"],
          ["Email", "În pregătire"],
          ["Website", "În pregătire"],
        ],
        note: "Programul și contactul sunt în curs de verificare.",
        cta: "Vezi contactul",
      },
    ],
  },
  "club-sportiv-scolar": {
    type: "Club sportiv școlar",
    title: "Profil de club sportiv școlar.",
    place: "Localitate în pregătire",
    description:
      "Ramuri sportive, grupe, baze și rezultate pentru copiii care vor să transforme mișcarea în pasiune.",
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Tineri sportivi pregătindu-se pe un teren de atletism",
    callout: "Mișcare, echipă și încredere.",
    stats: [
      ["În pregătire", "Ramuri sportive"],
      ["În pregătire", "Grupe"],
      ["Școlar", "Tip club"],
    ],
    tabs: [
      {
        label: "Sporturi și grupe",
        heading: "Sporturi și grupe",
        facts: [
          ["Ramuri sportive", "În pregătire"],
          ["Grupe", "În pregătire"],
          ["Vârste", "În pregătire"],
          ["Antrenori", "În pregătire"],
        ],
        note: "Oferta sportivă este afișată după verificarea programului clubului.",
        cta: "Vezi sporturile",
      },
      {
        label: "Înscriere și rezultate",
        heading: "Înscriere și rezultate",
        facts: [
          ["Selecții", "În pregătire"],
          ["Înscriere", "În pregătire"],
          ["Competiții", "În pregătire"],
          ["Rezultate", "În pregătire"],
        ],
        note: "Competițiile și rezultatele vor avea sursa indicată.",
        cta: "Vezi rezultatele",
      },
      {
        label: "Baze și contact",
        heading: "Baze și contact",
        facts: [
          ["Baze sportive", "În pregătire"],
          ["Program", "În pregătire"],
          ["Adresă", "În pregătire"],
          ["Telefon", "În pregătire"],
        ],
        note: "Bazele sportive și contactul sunt în curs de verificare.",
        cta: "Vezi contactul",
      },
    ],
  },
  "clubul-copiilor": {
    type: "Clubul Copiilor",
    title: "Profil de club pentru copii.",
    place: "Localitate în pregătire",
    description:
      "Cercuri, activități, categorii de vârstă și informații despre înscriere, într-un format simplu pentru familii.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Copii participând la o activitate de grup",
    callout: "Pasiuni care cresc împreună.",
    stats: [
      ["În pregătire", "Cercuri"],
      ["6–18 ani", "Vârste"],
      ["Gratuită", "Înscriere"],
    ],
    tabs: [
      {
        label: "Despre club",
        heading: "Despre club",
        facts: [
          ["Tip", "Clubul Copiilor"],
          ["Cercuri", "În pregătire"],
          ["Vârste", "6–18 ani"],
          ["Înscriere", "Gratuită"],
        ],
        note: "Activitățile sunt prezentate după confirmarea programului oficial.",
        cta: "Vezi cercurile",
      },
      {
        label: "Activități și rezultate",
        heading: "Activități și rezultate",
        facts: [
          ["Arte", "În pregătire"],
          ["Știință și tehnică", "În pregătire"],
          ["Sport", "În pregătire"],
          ["Participări", "În pregătire"],
        ],
        note: "Rezultatele și participările vor avea sursa indicată.",
        cta: "Vezi activitățile",
      },
      {
        label: "Program și contact",
        heading: "Program și contact",
        facts: [
          ["Program", "În pregătire"],
          ["Adresă", "În pregătire"],
          ["Telefon", "În pregătire"],
          ["Website", "În pregătire"],
        ],
        note: "Datele de contact sunt în curs de verificare.",
        cta: "Vezi programul",
      },
    ],
  },
  "centru-suport": {
    type: "Centru de suport",
    title: "Profil de centru educațional.",
    place: "Localitate în pregătire",
    description:
      "Servicii publice, aria de acoperire, program și documente utile pentru elevi, familii și profesioniști.",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Bibliotecă și spațiu educațional",
    callout: "Sprijin educațional, mai aproape.",
    stats: [
      ["În pregătire", "Servicii"],
      ["Județeană", "Acoperire"],
      ["Publică", "Instituție"],
    ],
    tabs: [
      {
        label: "Despre centru",
        heading: "Despre centru",
        facts: [
          ["Tip", "CJRAE / Inspectorat / CCD"],
          ["Servicii", "În pregătire"],
          ["Acoperire", "Județeană"],
          ["Statut", "Instituție publică"],
        ],
        note: "Tipul exact și aria de acoperire sunt preluate din surse oficiale.",
        cta: "Vezi serviciile",
      },
      {
        label: "Servicii și documente",
        heading: "Servicii și documente",
        facts: [
          ["Consiliere", "În pregătire"],
          ["Orientare", "În pregătire"],
          ["Formare", "În pregătire"],
          ["Documente publice", "În pregătire"],
        ],
        note: "Documentele vor fi legate direct către instituția emitentă.",
        cta: "Vezi documentele",
      },
      {
        label: "Program și contact",
        heading: "Program și contact",
        facts: [
          ["Program public", "În pregătire"],
          ["Adresă", "În pregătire"],
          ["Email", "În pregătire"],
          ["Website", "În pregătire"],
        ],
        note: "Publicăm datele de contact după verificare.",
        cta: "Vezi contactul",
      },
    ],
  },
};

const statIcons = [Search, Sparkles, MapPin];
export function ProfileVariant({ kind }: { kind: ProfileVariantKind }) {
  const p = profiles[kind];
  const [active, setActive] = useState(0);
  const panel = p.tabs[active];
  return (
    <main className="lovable-profile">
      <header className="topbar profile-topbar">
        <Link className="brand" href="/" aria-label="Top Edu acasă">
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <span>
            top<span className="brand-blue">edu</span>
          </span>
        </Link>
        <nav className="nav-links">
          <Link href="/#scoli">Școli</Link>
          <Link href="/#date">Date publice</Link>
          <Link href="/metodologie">Cum lucrăm</Link>
        </nav>
        <Link className="profile-nav-cta" href="/#director">
          Explorează școlile <ArrowRight />
        </Link>
      </header>
      <section className="lp-shell">
        <Link className="lp-back" href="/#director">
          ← Înapoi la școli
        </Link>
        <div className="lp-hero">
          <div className="lp-photo">
            <Image
              src={p.image}
              alt={p.imageAlt}
              fill
              priority
              sizes="(max-width: 820px) 100vw, 51vw"
            />
          </div>
          <div className="lp-copy">
            <span className="lp-type">{p.type}</span>
            <p className="lp-location">
              <MapPin /> {p.place}
            </p>
            <h1>
              {p.title.slice(0, -1)}
              <span>.</span>
            </h1>
            <p className="lp-description">{p.description}</p>
            <a className="lp-primary" href="#informatii">
              Explorează profilul <ArrowRight />
            </a>
          </div>
        </div>
        <div className="lp-stats">
          {p.stats.map(([value, label], i) => {
            const Icon = statIcons[i];
            return (
              <article key={label}>
                <span className={`lp-stat-icon tone-${i}`}>
                  <Icon />
                </span>
                <div>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              </article>
            );
          })}
        </div>
        <section className="lp-information" id="informatii">
          <div
            className="lp-tabs"
            role="tablist"
            aria-label={`Informații despre ${p.type.toLowerCase()}`}
          >
            {p.tabs.map((tab, i) => (
              <button
                key={tab.label}
                className={active === i ? "active" : ""}
                onClick={() => setActive(i)}
                role="tab"
                aria-selected={active === i}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="lp-panel">
            <article className="lp-facts">
              <p className="lp-kicker">
                <Sparkles /> Date publice verificate
              </p>
              <h2>{panel.heading}</h2>
              <dl>
                {panel.facts.map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="lp-note">{panel.note}</p>
            </article>
            <article className="lp-callout">
              <span>
                <Sparkles />
              </span>
              <h2>{p.callout}</h2>
              <p>
                Datele esențiale sunt organizate clar și completate pe măsură ce
                sursele sunt verificate.
              </p>
              <button onClick={() => setActive((active + 1) % p.tabs.length)}>
                {panel.cta} <ArrowRight />
              </button>
            </article>
          </div>
        </section>
      </section>
      <footer className="lp-footer">
        <div>
          <Link className="brand" href="/">
            <span className="brand-mark">
              <span />
              <span />
              <span />
            </span>
            <span>
              top<span className="brand-blue">edu</span>
            </span>
          </Link>
          <p>
            Top Edu este o inițiativă independentă, nonprofit, dedicată
            transparenței în educația românească.
          </p>
          <strong>Date publice. Pe înțelesul tuturor.</strong>
        </div>
        <div>
          <h3>Explorează</h3>
          <Link href="/#director">Școli</Link>
          <Link href="/#date">Date în pregătire</Link>
          <Link href="/metodologie">Cum lucrăm</Link>
        </div>
        <div>
          <h3>Contact public</h3>
          <a href="mailto:contact@top-edu.ro">contact@top-edu.ro</a>
          <p>Str. Vasile Lascăr 21, București</p>
          <p>Organizație neguvernamentală</p>
        </div>
        <small>
          © 2026 Top Edu. Date publice, prezentate în interes public.
        </small>
      </footer>
    </main>
  );
}
