"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { School } from "@/lib/schools";

export function SchoolSearch({ schools }: { schools: School[] }) {
  const [query, setQuery] = useState("");
  const [ownership, setOwnership] = useState("Toate");
  const results = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("ro");
    return schools.filter((school) => {
      const matchesTerm = !term || `${school.name} ${school.city} ${school.county} ${school.type}`.toLocaleLowerCase("ro").includes(term);
      const matchesOwnership = ownership === "Toate" || school.ownership === ownership;
      return matchesTerm && matchesOwnership;
    });
  }, [ownership, query, schools]);

  return (
    <section className="directory" id="director">
      <div className="directory-heading">
        <div><p className="kicker">Directorul școlilor</p><h2>Începe cu o școală, o localitate sau un județ</h2></div>
        <p className="dataset-note">Versiune de reconstrucție · importul complet de 18.022 înregistrări urmează după validarea surselor</p>
      </div>
      <div className="search-panel">
        <label className="search-field"><span>Caută în rețea</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Numele școlii, localitate sau județ" /></label>
        <label className="select-field"><span>Proprietate</span><select value={ownership} onChange={(event) => setOwnership(event.target.value)}><option>Toate</option><option>Publică</option><option>Privată</option></select></label>
      </div>
      <div className="results-meta"><strong>{results.length}</strong> profiluri demonstrative găsite</div>
      <div className="school-grid">
        {results.map((school) => (
          <article className="school-card" key={school.slug}>
            <div className="school-image"><Image src={school.image} alt="Sală de clasă" fill sizes="(max-width: 760px) 100vw, 33vw" /></div>
            <div className="school-card-body"><span className="school-type">{school.type}</span><h3>{school.name}</h3><p>{school.city}, {school.county} · {school.ownership}</p><div className="card-footer"><span>{school.levels}</span><Link href={`/scoli/${school.slug}`}>Vezi profilul</Link></div></div>
          </article>
        ))}
      </div>
      {!results.length && <div className="empty-state">Nu există încă un profil demonstrativ pentru această căutare.</div>}
    </section>
  );
}
