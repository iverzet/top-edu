import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodologie și surse",
  description: "Află cum colectează, verifică și actualizează Top Edu datele publice despre școlile din România.",
  alternates: { canonical: "/metodologie" },
  openGraph: { title: "Metodologia Top Edu", description: "Sursele și pașii prin care verificăm datele despre școli.", url: "https://top-edu.ro/metodologie", type: "article" },
};
export default function Methodology(){return <main><header className="site-header"><Link className="brand" href="/"><span>Top</span> Edu</Link></header><article className="text-page"><p className="kicker">Metodologie</p><h1>Cum devin datele publice un profil clar de școală</h1><p className="lead">Reconstruim pipeline-ul vechi fără să pierdem proveniența fiecărui câmp.</p><ol><li><strong>Identificare.</strong> Codul SIIIR rămâne cheia principală pentru deduplicare.</li><li><strong>Surse oficiale.</strong> Rețeaua școlară și registrele ARACIP sunt păstrate separat, cu data colectării și linkul sursei.</li><li><strong>Localizare.</strong> Coordonatele vechi sunt reverificate înainte de afișarea pe hartă.</li><li><strong>Îmbogățire.</strong> Fotografii și date editoriale se publică numai cu sursă și drepturi clare.</li><li><strong>Actualizare.</strong> Importurile vor produce rapoarte de diferențe, nu suprascrieri opace.</li></ol><Link className="primary-button" href="/#director">Înapoi la director</Link></article></main>}
