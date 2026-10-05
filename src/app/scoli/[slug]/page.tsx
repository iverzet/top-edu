import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSchool } from "@/lib/schools";

export const dynamicParams = true;

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const school = getSchool((await params).slug);
  if (!school) notFound();
  return <main><header className="site-header"><Link className="brand" href="/"><span>Top</span> Edu</Link><nav><Link href="/#director">Școli</Link><Link href="/metodologie">Metodologie</Link><Link href="/recenzii">Recenzii</Link></nav></header><section className="profile-hero"><div className="profile-photo"><Image src={school.image} alt="Ilustrație pentru unitatea de învățământ" fill priority sizes="(max-width: 900px) 100vw, 48vw" /></div><div className="profile-intro"><Link className="back-link" href="/#director">Înapoi la director</Link><p className="kicker">{school.type}</p><h1>{school.name}</h1><p className="profile-location">{school.city}, {school.county} · {school.ownership}</p><span className="demo-badge">Sursă oficială · import 2025–2026</span></div></section><section className="profile-layout"><article><div className="content-card"><p className="kicker">Prezentare</p><h2>Ce știm despre această școală</h2><p>{school.description}</p></div><div className="content-card"><p className="kicker">Recenzii și experiențe</p><h2>Nicio recenzie publicată încă</h2><p>Recenziile vor apărea numai după activarea moderării, verificarea criteriilor și a dreptului la răspuns. Nu afișăm scoruri de umplutură.</p><Link className="inline-link" href="/recenzii">Vezi regulile recenziilor</Link></div></article><aside className="facts-card"><h2>Date de bază</h2><dl><div><dt>Niveluri</dt><dd>{school.levels}</dd></div><div><dt>Proprietate</dt><dd>{school.ownership}</dd></div><div><dt>Localitate</dt><dd>{school.city}</dd></div><div><dt>Județ</dt><dd>{school.county}</dd></div><div><dt>Adresă</dt><dd>{school.address || "Nu este publicată"}</dd></div><div><dt>Cod SIIIR</dt><dd>{school.siiirCode}</dd></div><div><dt>Sursa</dt><dd>{school.source}</dd></div></dl></aside></section></main>;
}
