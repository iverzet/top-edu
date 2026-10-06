"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MapPin, Search, Sparkles } from "lucide-react";

export type ProfileVariantKind =
  "gradinita" | "scoala-gimnaziala" | "clubul-copiilor" | "centru-suport";
type Profile = {
  type: string;
  title: string;
  place: string;
  description: string;
  image: string;
  imageAlt: string;
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
  "scoala-gimnaziala": {
    type: "Școală gimnazială",
    title: "Profil de școală gimnazială.",
    place: "Localitate în pregătire",
    description:
      "Date clare despre clase, profesori, activități și rezultatele la Evaluarea Națională, pentru o alegere informată.",
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Elevi într-un campus școlar",
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
  "clubul-copiilor": {
    type: "Clubul Copiilor",
    title: "Profil de club pentru copii.",
    place: "Localitate în pregătire",
    description:
      "Cercuri, activități, categorii de vârstă și informații despre înscriere, într-un format simplu pentru familii.",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Copii participând la o activitate de grup",
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
              <h2>
                {kind === "gradinita"
                  ? "Loc pentru joacă și descoperire."
                  : kind === "scoala-gimnaziala"
                    ? "Informații clare pentru fiecare familie."
                    : kind === "clubul-copiilor"
                      ? "Pasiuni care cresc împreună."
                      : "Sprijin educațional, mai aproape."}
              </h2>
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
