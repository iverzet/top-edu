'use client'

import { useState } from 'react'
import { ArrowDownRight, ArrowRight, ChevronDown, MapPin, Search, Sparkles } from 'lucide-react'

const schools = [
  {
    name: 'Colegiul Național „Gheorghe Lazăr”',
    city: 'București, Sector 5',
    type: 'Liceu teoretic',
    students: '1.184',
    score: '9,42',
    image: '/school-bucharest.png',
    color: 'coral',
  },
  {
    name: 'Liceul Teoretic „Avram Iancu”',
    city: 'Cluj-Napoca',
    type: 'Liceu teoretic',
    students: '864',
    score: '9,18',
    image: '/school-cluj.png',
    color: 'mint',
  },
  {
    name: 'Școala Gimnazială „Elena Cuza”',
    city: 'Iași',
    type: 'Școală gimnazială',
    students: '642',
    score: '8,96',
    image: '/school-iasi.png',
    color: 'yellow',
  },
]

export function TopEduHome() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('Prezentare')
  const [showResults, setShowResults] = useState(false)

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
            {showResults && <div className="search-result">Am găsit școli pentru „{query}” <ArrowRight /></div>}
          </div>
          <div className="hero-art-wrap">
            <img src="/top-edu-family.png" alt="Patru elevi români se joacă în curtea unei școli românești" className="hero-art" />
          </div>
        </section>

        <section className="featured-section" id="scoli">
          <div className="section-heading"><div><span className="section-kicker">DESCOPERĂ</span><h2>Școli care <em>inspiră.</em></h2></div><a href="#date">Vezi toate școlile <ArrowRight /></a></div>
          <div className="school-grid">{schools.map((school) => <article className="school-card" key={school.name}>
            <div className="school-photo"><img src={school.image} alt={`Clădirea ${school.name}`} /><span className={`photo-dot ${school.color}`} /></div>
            <div className="school-content"><div className="school-meta"><span>{school.type}</span><span><MapPin /> {school.city}</span></div><h3>{school.name}</h3><div className="school-stats"><div><strong>{school.students}</strong><span>elevi</span></div><div><strong>{school.score}</strong><span>medie Bac</span></div><button aria-label={`Vezi profilul ${school.name}`}><ArrowDownRight /></button></div></div>
          </article>)}</div>
        </section>

        <section className="data-banner" id="date"><div className="banner-orbit" /><div><span className="section-kicker">TRANSPARENȚĂ, PAS CU PAS</span><h2>Unele date sunt încă<br /><em>în pregătire.</em></h2></div><p>Lucrăm cu instituții din toată țara pentru ca fiecare familie să aibă acces la informații complete, corecte și actualizate.</p><button>Vezi cum lucrăm <ArrowRight /></button></section>

        <section className="profile-section" id="cum-lucram"><div className="section-heading"><div><span className="section-kicker">UN PROFIL, TOATE RĂSPUNSURILE</span><h2>Vezi școala <em>altfel.</em></h2></div><span className="source-badge">● Date verificate public</span></div>
          <div className="profile-card"><div className="profile-image"><img src={schools[0].image} alt="Clădirea Colegiului Național Gheorghe Lazăr" /><span className="profile-type">Liceu teoretic</span></div><div className="profile-info"><div className="location"><MapPin /> București, Sector 5</div><h3>Colegiul Național<br /><span>„Gheorghe Lazăr”</span></h3><p>O comunitate cu tradiție, curiozitate și rezultate care se văd.</p><div className="profile-stats"><div><strong>1.184</strong><span>elevi</span></div><div><strong>84</strong><span>profesori</span></div><div><strong>9,42</strong><span>medie Bac</span></div></div><div className="profile-tabs">{['Prezentare', 'Rezultate', 'Comunitate', 'Facilități'].map((tab) => <button className={activeTab === tab ? 'active' : ''} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><div className="profile-foot"><span><span className="check">✓</span> Actualizat în mai 2024</span><button>Vezi profilul complet <ArrowRight /></button></div></div></div></section>
      </main>
      <footer><span className="brand">top<span className="brand-blue">edu</span></span><span>Educația începe cu o alegere informată.</span><span>© 2024 Top Edu</span></footer>
    </div>
  )
}

export default TopEduHome
