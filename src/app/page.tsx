import Link from "next/link";
import { SchoolSearch } from "@/components/school-search";
import { schools } from "@/lib/schools";

export default function Home() {
  return (
    <main>
      <div className="announcement">Nou: datele financiare 2026 intră în procesare în această lună. <a href="#date-in-pregatire">Află mai multe</a></div>
      <header className="site-header"><Link className="brand" href="/"><span>Top</span> Edu</Link><nav aria-label="Navigație principală"><a href="#scoli">Școli incluse</a><Link href="/metodologie">Metodologie</Link><Link href="/recenzii">Recenzii</Link></nav><a className="header-action" href="#scoli">Explorează datele</a></header>
      <section className="hero" id="continut"><div className="hero-copy"><p className="kicker">Transparență în educație</p><h1>Vezi ce se întâmplă cu banii pentru educație.</h1><p className="hero-lead">Top Edu transformă documentele oficiale ale școlilor din România — bugete, cheltuieli, contacte și eligibilitate — într-un index clar, ușor de navigat pentru părinți, profesori și donatori.</p><div className="hero-actions"><a className="primary-button" href="#scoli">Explorează datele</a><Link className="secondary-button" href="/metodologie">Cum lucrăm</Link></div></div><div className="hero-visual" aria-label="Ilustrație abstractă despre date deschise"><div className="hero-shape hero-shape-one"/><div className="hero-shape hero-shape-two"/><div className="data-note"><span>Top Edu</span><strong>Date publice.<br/>Pe înțelesul tuturor.</strong><i>✓ verificat</i></div></div></section>
      <section className="stats-band" aria-label="Cifre cheie"><div><strong>4.700+</strong><span>unități de învățământ monitorizate</span></div><div><strong>39</strong><span>de județe și municipiul București</span></div><div><strong>12</strong><span>indicatori publici verificați</span></div><div><strong>100%</strong><span>date din surse oficiale</span></div></section>
      <section id="scoli"><SchoolSearch schools={schools} /></section>
      <section className="preparing-data" aria-labelledby="preparing-data-title">
        <div>
          <p className="kicker">Următoarea etapă</p>
          <h2 id="preparing-data-title">Date în pregătire</h2>
          <p>Aceste câmpuri vor fi adăugate numai după ce sursa, drepturile de utilizare și metoda de actualizare sunt documentate.</p>
        </div>
        <ul className="preparing-list">
          <li><span aria-hidden="true">□</span><div><strong>Date financiare</strong><small>Bugete, proiecte și indicatori publicați în surse oficiale.</small></div><em>în lucru</em></li>
          <li><span aria-hidden="true">□</span><div><strong>Contact public</strong><small>Site, adresă instituțională și canale publice verificate.</small></div><em>în lucru</em></li>
          <li><span aria-hidden="true">□</span><div><strong>Eligibil 3,5%</strong><small>Informații despre eligibilitate, afișate doar după confirmarea sursei.</small></div><em>în lucru</em></li>
        </ul>
      </section>
      <section className="method-preview" id="metodologie"><p className="kicker">Metodologie</p><h2>Cum ajung datele publice la tine.</h2><div className="method-grid"><article><b>1</b><h3>Colectăm</h3><p>Extragem date din surse oficiale și portalurile de transparență.</p></article><article><b>2</b><h3>Verificăm</h3><p>Validăm fiecare indicator și notăm sursa, data și metoda de calcul.</p></article><article><b>3</b><h3>Publicăm</h3><p>Prezentăm datele în format clar, deschis și actualizat periodic.</p></article></div><Link className="inline-link" href="/metodologie">Citește metodologia completă →</Link></section>
      <section className="trust-strip"><div><p className="kicker">Fără clasamente inventate</p><h2>Comparații construite pe proveniență, nu pe promisiuni.</h2></div><p>Datele oficiale, recenziile Top Edu și sursele externe vor fi afișate separat. O școală are drept la răspuns, iar comentariile despre copii sau acuzațiile neverificate nu se publică.</p></section>
      <footer><Link className="brand inverse" href="/"><span>Top</span> Edu</Link><p>Proiect independent pentru transparență în educație.</p><div><Link href="/metodologie">Metodologie</Link><Link href="/recenzii">Politica recenziilor</Link></div></footer>
    </main>
  );
}
