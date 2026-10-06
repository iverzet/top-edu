'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { schools as officialSchools } from '@/lib/schools'
import { ArrowDownRight, ArrowRight, MapPin, Search, Sparkles } from 'lucide-react'

const schools = officialSchools

export function TopEduHome() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Prezentare')
  const [showResults, setShowResults] = useState(false)
  const normalizedQuery = query.trim().toLocaleLowerCase('ro-RO')
  const results = normalizedQuery ? schools.filter((school) => [school.name, school.city, school.county].join(' ').toLocaleLowerCase('ro-RO').includes(normalizedQuery)).slice(0, 6) : []

  const handleSearch = (value = query) => {
    setQuery(value)
    setShowResults(Boolean(value.trim()))
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Top Edu acasă">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>top<span className="brand-blue">edu</span></span>
        </a>
        <nav className="nav-links" aria-label="Navigație principală">
          <a href="#scoli">Școli</a>
          <a href="#date">Date publice</a>
          <a href="#cum-lucram">Cum lucrăm</a>
        </nav>
        <button className="nav-cta" onClick={() => document.getElementById('scoli')?.scrollIntoView({ behavior: 'smooth' })}>Explorează școlile <ArrowRight /></button>
        <button className="menu-button" aria-label="Deschide meniul"><span /><span /></button>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles /> EDUCAȚIA, MAI APROAPE DE TINE</div>
            <h1>Găsește școala<br /><span>potrivită.</span></h1>
            <p className="hero-lede">Date publice. <strong>Pe înțelesul tuturor.</strong></p>
            <p className="hero-description">Descoperă școli, compară informații și ia decizii cu încredere. Tot ce trebuie să știi, într-un singur loc.</p>
            <div className="search-wrap" role="search">
              <Search />
              <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && event.keyCode !== 229) handleSearch() }} placeholder="Caută după nume, localitate sau județ" aria-label="Caută o școală" />
              <button onClick={() => handleSearch()}>Caută</button>
            </div>
            <div className="quick-searches"><span>Caută rapid:</span>{['București', 'Cluj', 'Iași', 'Brașov'].map((city) => <button key={city} onClick={() => handleSearch(city)}>{city}</button>)}</div>
            {showResults && <div className="search-result" aria-live="polite">{results.length ? `Am găsit ${results.length} școli pentru „${query}”` : `Nu am găsit școli pentru „${query}”`} <ArrowRight /></div>}
            {showResults && results.length > 0 && <div className="search-results-list">{results.map((school) => <Link key={school.slug} href={`/scoli/${school.slug}`}><span>{school.name}</span><small>{school.city} · {school.county}</small><ArrowRight /></Link>)}</div>}
          </div>
          <div className="hero-art-wrap">
            <Image src="/top-edu-family.png" alt="Patru elevi români se joacă în curtea unei școli românești" className="hero-art" fill priority sizes="(max-width: 800px) 100vw, 53vw" />
          </div>
        </section>

        <section className="featured-section" id="scoli">
          <div className="section-heading"><div><span className="section-kicker">DESCOPERĂ</span><h2>Școli care <em>inspiră.</em></h2></div><a href="#date">Vezi toate școlile <ArrowRight /></a></div>
          <div className="school-grid">{schools.slice(0, 3).map((school, index) => <article className="school-card" key={school.slug}>
            <div className="school-photo"><Image src={school.image || '/school-placeholder.svg'} alt={`Clădirea ${school.name}`} fill sizes="(max-width: 800px) 100vw, 33vw" /><span className={`photo-dot ${['coral', 'mint', 'yellow'][index]}`} /></div>
            <div className="school-content"><div className="school-meta"><span>{school.ownership}</span><span><MapPin /> {school.city}, {school.county}</span></div><h3>{school.name}</h3><div className="school-stats"><div><strong>{school.status}</strong><span>status</span></div><div><strong>{school.siiirCode}</strong><span>cod SIIIR</span></div><Link href={`/scoli/${school.slug}`} aria-label={`Vezi profilul ${school.name}`}><ArrowDownRight /></Link></div></div>
          </article>)}</div>
        </section>

        <section className="data-banner" id="date"><div className="banner-orbit" /><div><span className="section-kicker">TRANSPARENȚĂ, PAS CU PAS</span><h2>Unele date sunt încă<br /><em>în pregătire.</em></h2></div><p>Lucrăm cu instituții din toată țara pentru ca fiecare familie să aibă acces la informații complete, corecte și actualizate.</p><button>Vezi cum lucrăm <ArrowRight /></button></section>

        <section className="profile-section" id="cum-lucram"><div className="section-heading"><div><span className="section-kicker">UN PROFIL, TOATE RĂSPUNSURILE</span><h2>Vezi școala <em>altfel.</em></h2></div><span className="source-badge">● Date verificate public</span></div>
          <div className="profile-card"><div className="profile-image"><Image src={schools[0].image || '/school-placeholder.svg'} alt={`Clădirea ${schools[0].name}`} fill sizes="(max-width: 800px) 100vw, 46vw" /><span className="profile-type">{schools[0].ownership}</span></div><div className="profile-info"><div className="location"><MapPin /> {schools[0].city}, {schools[0].county}</div><h3>{schools[0].name}</h3><p>{schools[0].description}</p><div className="profile-stats"><div><strong>{schools[0].status}</strong><span>status</span></div><div><strong>{schools[0].siiirCode}</strong><span>cod SIIIR</span></div><div><strong>{schools[0].levels}</strong><span>nivel</span></div></div><div className="profile-tabs">{['Prezentare', 'Date oficiale', 'Contact public'].map((tab) => <button className={activeTab === tab ? 'active' : ''} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><div className="profile-foot"><span><span className="check">✓</span> Sursă oficială verificată</span><Link href={`/scoli/${schools[0].slug}`}>Vezi profilul complet <ArrowRight /></Link></div></div></div></section>
      </main>
      <footer><span className="brand">top<span className="brand-blue">edu</span></span><span>Educația începe cu o alegere informată.</span><span>© 2024 Top Edu</span></footer>
    </div>
  )
}

export default TopEduHome
