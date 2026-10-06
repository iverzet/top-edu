import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica recenziilor",
  description: "Regulile Top Edu pentru recenzii utile, moderate și protejarea copiilor.",
  alternates: { canonical: "/recenzii" },
  openGraph: { title: "Politica recenziilor Top Edu", description: "Cum moderăm recenziile despre școli.", url: "https://top-edu.ro/recenzii", type: "article" },
};
export default function Reviews(){return <main><header className="site-header"><Link className="brand" href="/"><span>Top</span> Edu</Link></header><article className="text-page"><p className="kicker">Politica recenziilor</p><h1>Experiențe utile, cu reguli pentru protejarea copiilor.</h1><p className="lead">Top Edu va publica recenzii proprii moderate și va eticheta separat eventualele surse externe.</p><div className="criteria-grid"><section><h2>Criterii</h2><p>Siguranță, comunicare, profesori, infrastructură și transparență.</p></section><section><h2>Moderare</h2><p>Comentariile sunt verificate înainte de publicare; școala are drept la răspuns.</p></section><section><h2>Protecție</h2><p>Nu publicăm date despre copii, profesori nominalizați sau acuzații neverificate.</p></section><section><h2>Surse separate</h2><p>Google, Facebook și Top Edu nu sunt amestecate într-un scor opac.</p></section></div><Link className="primary-button" href="/#director">Explorează școlile</Link></article></main>}
