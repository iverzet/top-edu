import Link from "next/link";
import { SchoolSearch } from "@/components/school-search";
import { schools } from "@/lib/schools";

export default function Home() {
  return (
    <main>
      <header className="site-header"><Link className="brand" href="/"><span>Top</span> Edu</Link><nav aria-label="Navigație principală"><a href="#director">Școli</a><Link href="/metodologie">Metodologie</Link><Link href="/recenzii">Recenzii</Link></nav><a className="header-action" href="#director">Găsește o școală</a></header>
      <section className="hero"><div className="hero-copy"><p className="kicker">Date clare pentru alegeri importante</p><h1>Școlile din România, explicate pentru părinți.</h1><p className="hero-lead">Un director independent care aduce laolaltă date oficiale, localizare, fotografii și experiențe moderate — cu sursa fiecărei informații la vedere.</p><div className="hero-actions"><a className="primary-button" href="#director">Caută în director</a><Link className="secondary-button" href="/metodologie">Cum verificăm datele</Link></div><dl className="hero-stats"><div><dt>18.022</dt><dd>înregistrări în sursa recuperată</dd></div><div><dt>15.656</dt><dd>coordonate disponibile</dd></div><div><dt>SIIIR</dt><dd>identificatorul de bază</dd></div></dl></div><div className="hero-visual" aria-label="Caiet de orientare pentru alegerea școlii"><div className="notebook-card"><span>Fișa unei școli</span><strong>Date oficiale</strong><strong>Hartă și fotografii</strong><strong>Recenzii moderate</strong><small>Fiecare sursă rămâne separată.</small></div><div className="pencil" /></div></section>
      <SchoolSearch schools={schools} />
      <section className="trust-strip"><div><p className="kicker">Fără clasamente inventate</p><h2>Comparații construite pe proveniență, nu pe promisiuni.</h2></div><p>Datele oficiale, recenziile Top Edu și sursele externe vor fi afișate separat. O școală are drept la răspuns, iar comentariile despre copii sau acuzațiile neverificate nu se publică.</p></section>
      <footer><Link className="brand inverse" href="/"><span>Top</span> Edu</Link><p>Proiect independent pentru transparență în educație.</p><div><Link href="/metodologie">Metodologie</Link><Link href="/recenzii">Politica recenziilor</Link></div></footer>
    </main>
  );
}
