import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowUpRight, BookOpen, Building2, ExternalLink, GraduationCap,
  MapPin, School, ShieldCheck, Sparkles, TrendingUp, Users,
} from "lucide-react";
import { getSchool } from "@/lib/schools";
import { getExamResults } from "@/lib/exam-results";
import { getSchoolEnrichment } from "@/lib/school-enrichment";
import { getAracipStatus } from "@/lib/aracip";
import { getSchoolInvestments } from "@/lib/school-investments";
import { getVerifiedSchoolImage } from "@/lib/school-images";
import { profileVariantLabels, profileVariantPresentation, resolveProfileVariant } from "@/lib/profile-variants";

export const dynamicParams = true;
const numberFormatter = new Intl.NumberFormat("ro-RO");
const SCHOOL_NETWORK_SOURCE = "https://data.gov.ro/dataset/retea-scolara-2025-2026";
const AFIR_BENEFICIARIES_SOURCE = "https://www.afir.ro/rapoarte/beneficiari-de-fonduri-europene/date-deschise/";
const formatNumber = (value?: number) => value === undefined ? "—" : numberFormatter.format(value);
const formatClasses = (value?: number) => value === undefined ? "—" : value.toLocaleString("ro-RO");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const school = getSchool((await params).slug);
  if (!school) return { title: "Școală negăsită", robots: { index: false, follow: false } };
  const enrichment = getSchoolEnrichment(school.siiirCode);
  const students = enrichment?.enrollment?.students;
  const categoryLabel = profileVariantLabels[resolveProfileVariant(school, enrichment)];
  const verifiedImage = getVerifiedSchoolImage(school.siiirCode);
  const socialImage = verifiedImage?.imageUrl ? `https://www.top-edu.ro${verifiedImage.imageUrl}` : undefined;
  const description = students
    ? `${school.name} din ${school.city}: profil ${categoryLabel.toLowerCase()}, ${formatNumber(students)} elevi, rezultate și date oficiale.`
    : `${school.name}, ${school.city}: profil ${categoryLabel.toLowerCase()}, date publice verificate și cod SIIIR.`;
  return {
    title: `${school.name} — date, rezultate și profil`, description,
    alternates: { canonical: `/scoli/${school.slug}` },
    openGraph: { title: `${school.name} — Top Edu`, description, url: `https://www.top-edu.ro/scoli/${school.slug}`, type: "article", ...(socialImage ? { images: [{ url: socialImage, alt: verifiedImage?.alt ?? school.name }] } : {}) },
    twitter: { card: "summary_large_image", title: `${school.name} — Top Edu`, description, ...(socialImage ? { images: [socialImage] } : {}) },
  };
}

export default async function SchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const school = getSchool((await params).slug);
  if (!school) notFound();

  const examResults = getExamResults(school.siiirCode);
  const enrichment = getSchoolEnrichment(school.siiirCode);
  const aracipStatus = getAracipStatus(school.siiirCode);
  const enrollment = enrichment?.enrollment;
  const profileKind = resolveProfileVariant(school, enrichment);
  const category = profileVariantPresentation[profileKind];
  const categoryLabel = profileVariantLabels[profileKind];
  const verifiedImage = getVerifiedSchoolImage(school.siiirCode);
  const profileImage = verifiedImage?.imageUrl ?? (school.image && !school.image.includes("placeholder") ? school.image : category.image);
  const profileImageAlt = verifiedImage?.alt ?? `${category.imageAlt}: ${school.name}`;
  const history = enrichment?.enrollmentHistory ?? [];
  const coordinates = enrichment?.coordinates;
  const quality = aracipStatus ?? enrichment?.quality;
  const schoolInvestments = getSchoolInvestments(school.siiirCode);
  const secondaryContact = school.secondaryContact;
  const hasSecondaryContact = Boolean(secondaryContact?.address || secondaryContact?.phone || secondaryContact?.email);
  const mapUrl = coordinates
    ? `https://www.openstreetmap.org/?mlat=${coordinates.latitude}&mlon=${coordinates.longitude}#map=17/${coordinates.latitude}/${coordinates.longitude}`
    : undefined;
  const currentStudents = enrollment?.students;
  const previousStudents = history.find((item) => item.schoolYear === "2024-2025")?.students;
  const studentChange = currentStudents !== undefined && previousStudents !== undefined ? currentStudents - previousStudents : undefined;
  const jsonLd = {
    "@context": "https://schema.org", "@type": "EducationalOrganization", name: school.name,
    url: `https://www.top-edu.ro/scoli/${school.slug}`,
    address: { "@type": "PostalAddress", addressLocality: school.city, addressRegion: school.county, streetAddress: school.address },
    ...(coordinates && { geo: { "@type": "GeoCoordinates", latitude: coordinates.latitude, longitude: coordinates.longitude } }),
    identifier: { "@type": "PropertyValue", propertyID: "SIIIR", value: school.siiirCode },
    description: school.description, ...(school.phone && { telephone: school.phone }), ...(school.email && { email: school.email }),
  };

  return (
    <>
      <main className={`school-profile-page kind-${profileKind}`} data-profile-kind={profileKind}>
        <header className="site-header">
          <Link className="brand" href="/" aria-label="topedu — pagina principală">
            <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
            <span><span className="brand-blue">top</span>edu</span>
          </Link>
          <nav aria-label="Navigație principală"><Link href="/#director">Școli</Link><Link href="/metodologie">Metodologie</Link><Link href="/recenzii">Recenzii</Link></nav>
          <Link className="header-action" href="/#director">Caută o școală</Link>
        </header>

        <section className="profile-hero">
          <div className="profile-photo">
            <Image src={profileImage} alt={profileImageAlt} fill priority sizes="(max-width: 900px) 100vw, 48vw" />
            {verifiedImage ? (
              <a className="illustrative-note photo-attribution" href={verifiedImage.sourceUrl} target="_blank" rel="noreferrer">
                Foto reală · {verifiedImage.author} · {verifiedImage.license}
              </a>
            ) : <span className="illustrative-note">Imagine ilustrativă</span>}
          </div>
          <div className="profile-intro">
            <Link className="back-link" href="/#director">← Înapoi la școli</Link>
            <p className="kicker"><Sparkles aria-hidden="true" /> {category.eyebrow}</p>
            <h1>{school.name}</h1>
            <p className="profile-location"><MapPin aria-hidden="true" /> {school.city} · {school.county}</p>
            <div className="profile-badges"><span className="category-badge">{categoryLabel}</span><span className="demo-badge"><ShieldCheck aria-hidden="true" /> Rețea oficială 2025–2026</span></div>
            <p className="profile-category-copy">{category.description}</p>
          </div>
        </section>

        <section className="profile-metrics" aria-label="Indicatori principali">
          <div><Users aria-hidden="true" /><strong>{formatNumber(currentStudents)}</strong><span>{category.populationLabel} · {enrollment?.schoolYear ?? "date indisponibile"}</span></div>
          <div><School aria-hidden="true" /><strong>{formatClasses(enrollment?.classes)}</strong><span>{category.groupLabel}</span></div>
          <div><GraduationCap aria-hidden="true" /><strong>{examResults.length}</strong><span>rezultate oficiale publicate</span></div>
          <div><Building2 aria-hidden="true" /><strong>{school.ownership}</strong><span>tip de proprietate</span></div>
        </section>

        <nav className="profile-tabs" aria-label="Cuprinsul profilului">
          <a href="#prezentare">Prezentare</a>{enrollment && <a href="#elevi">Elevi și ofertă</a>}{(secondaryContact?.levelsAndSpecializations || secondaryContact?.facilities) && <a href="#informatii-suplimentare">Informații suplimentare</a>}{enrichment?.admission && <a href="#admitere">Admitere</a>}{examResults.length > 0 && <a href="#rezultate">Rezultate</a>}{quality && <a href="#calitate">ARACIP</a>}{schoolInvestments.length > 0 && <a href="#investitii">Investiții</a>}<a href="#surse">Surse</a>
        </nav>

        <section className="profile-layout">
          <article>
            <section className="content-card" id="prezentare">
              <p className="kicker">Despre unitate</p><h2>O imagine clară, din surse publice</h2><p>{school.description}</p>
              {studentChange !== undefined && <div className={`trend-note ${studentChange >= 0 ? "positive" : "negative"}`}><TrendingUp aria-hidden="true" /><span><strong>{studentChange >= 0 ? "+" : ""}{formatNumber(studentChange)} elevi</strong> față de anul școlar 2024–2025</span></div>}
            </section>

            <section className="content-card category-focus-card">
              <p className="kicker">Profil {categoryLabel.toLowerCase()}</p><h2>{category.focusTitle}</h2>
              <div className="category-focus-grid">{category.focusItems.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}</div>
            </section>

            {enrollment && <section className="content-card" id="elevi">
              <p className="kicker">Anul școlar {enrollment.schoolYear}</p><h2>Elevi și ofertă educațională</h2>
              <div className="data-pair-grid"><div><span>Elevi înscriși</span><strong>{formatNumber(enrollment.students)}</strong></div><div><span>Clase / formațiuni</span><strong>{formatClasses(enrollment.classes)}</strong></div></div>
              {enrollment.levels && enrollment.levels.length > 0 && <div className="tag-group"><h3>Niveluri</h3><div>{enrollment.levels.map((item) => <span key={item}>{item}</span>)}</div></div>}
              {enrollment.specializations && enrollment.specializations.length > 0 && <div className="tag-group"><h3>Specializări și calificări</h3><div>{enrollment.specializations.map((item) => <span key={item}>{item}</span>)}</div></div>}
              <div className="offer-flags">{enrollment.languages?.map((item) => <span key={item}><BookOpen aria-hidden="true" /> {item}</span>)}{enrollment.studyForms?.map((item) => <span key={item}><School aria-hidden="true" /> {item}</span>)}{enrollment.dual && <span><ShieldCheck aria-hidden="true" /> Învățământ dual</span>}{enrollment.specialEducation && <span><ShieldCheck aria-hidden="true" /> Educație specială</span>}</div>
              <a className="source-link" href={enrollment.source} target="_blank" rel="noreferrer">Setul oficial de date <ArrowUpRight /></a>
            </section>}

            {(secondaryContact?.levelsAndSpecializations || secondaryContact?.facilities) && <section className="content-card" id="informatii-suplimentare">
              <p className="kicker">Sursă publică secundară</p><h2>Informații suplimentare despre unitate</h2><p className="card-intro">Aceste detalii completează profilul și sunt afișate separat de datele oficiale.</p>
              {secondaryContact.levelsAndSpecializations && <div className="tag-group"><h3>Niveluri și specializări raportate</h3><p>{secondaryContact.levelsAndSpecializations}</p></div>}
              {secondaryContact.facilities && <div className="tag-group"><h3>Facilități raportate</h3><p>{secondaryContact.facilities}</p></div>}
              <a className="source-link" href={secondaryContact.sourceUrl} target="_blank" rel="noreferrer">Vezi sursa publică <ArrowUpRight /></a>
            </section>}

            {enrichment?.admission && enrichment.admission.length > 0 && <section className="content-card" id="admitere">
              <p className="kicker">Admitere la liceu</p><h2>Specializări și ultimele medii</h2>
              <div className="admission-table">{enrichment.admission.map((item, index) => <div key={`${item.specialization}-${index}`}><span><strong>{item.specialization}</strong>{item.year && <small>{item.year}</small>}</span><span>{item.lastAverage !== undefined ? `${item.lastAverage.toLocaleString("ro-RO")} ultima medie` : "medie nepublicată"}</span>{item.places !== undefined && <span>{item.places} locuri</span>}{item.source && <a href={item.source} target="_blank" rel="noreferrer" aria-label="Sursa oficială pentru admitere"><ArrowUpRight /></a>}</div>)}</div>
            </section>}

            {examResults.length > 0 && <section className="content-card" id="rezultate">
              <p className="kicker">Performanță școlară</p><h2>Rezultate la examenele naționale</h2><p className="card-intro">Indicatorii sunt calculați din înregistrările anonimizate publicate de Ministerul Educației.</p>
              <div className="exam-results-grid">{examResults.map((result) => <div className="exam-result" key={`${result.exam}-${result.year}`}>
                <span className="exam-year">{result.year}{result.session ? ` · ${result.session}` : ""}</span><strong>{result.exam}</strong>
                {result.average != null && <b>{result.average.toFixed(2).replace(".", ",")} <small>medie</small></b>}
                {result.exam === "Evaluarea Națională" && (result.aboveFiveRate ?? result.passRate) != null && <span>{(result.aboveFiveRate ?? result.passRate)!.toLocaleString("ro-RO")}% medii ≥ 5</span>}
                {result.exam === "Bacalaureat" && result.passRate != null && <span>{result.passRate.toLocaleString("ro-RO")}% promovare</span>}
                {result.candidates !== undefined && <span>{formatNumber(result.candidates)} candidați{result.gradedCandidates !== undefined && result.gradedCandidates !== result.candidates ? ` · ${formatNumber(result.gradedCandidates)} cu medie` : ""}</span>}
                <a href={result.source} target="_blank" rel="noreferrer">Sursa oficială <ArrowUpRight /></a>
              </div>)}</div>
            </section>}

            {quality && <section className="content-card quality-card" id="calitate"><div className="quality-icon"><ShieldCheck aria-hidden="true" /></div><div>
              <p className="kicker">Registrul ARACIP</p><h2>{"registerType" in quality && quality.registerType === "acreditata" ? "Unitate acreditată" : "Evaluare externă periodică"}</h2>
              {quality.lastExternalEvaluation && <p>Ultima evaluare identificată în registru: <strong>{quality.lastExternalEvaluation.replace(".0", "")}</strong>.</p>}
              {quality.nextEvaluationSchoolYear && <p>Anul indicat în registru pentru următoarea evaluare: <strong>{quality.nextEvaluationSchoolYear}</strong>.</p>}
              <a className="source-link" href={quality.source} target="_blank" rel="noreferrer">Consultă registrul ARACIP <ArrowUpRight /></a>
            </div></section>}

            {schoolInvestments.length > 0 && <section className="content-card" id="investitii">
              <p className="kicker">Finanțare confirmată la această unitate</p><h2>Investiții și proiecte publice</h2><p className="card-intro">Sunt afișate numai proiecte asociate explicit codului SIIIR al școlii și păstrate cu sursa publică.</p>
              <div className="investment-list">{schoolInvestments.map((item, index) => <div key={`${item.program}-${item.title}-${item.amountLei ?? ""}-${index}`}><strong>{item.title}</strong><span>{item.program}{item.year ? ` · ${item.year}` : ""}{item.status ? ` · ${item.status}` : ""}{item.amountLei ? ` · ${formatNumber(item.amountLei)} lei` : ""}</span><small>Beneficiar: {item.beneficiary}</small></div>)}</div>
              <a className="source-link" href={schoolInvestments[0].source} target="_blank" rel="noreferrer">Sursa proiectului <ArrowUpRight /></a>
            </section>}
          </article>

          <aside>
            <section className="facts-card"><h2>{hasSecondaryContact ? "Date publice de contact" : "Date oficiale"}</h2>{hasSecondaryContact && <p className="card-intro">Contact completat dintr-o sursă publică secundară; verificarea oficială rămâne în curs.</p>}<dl>
              <div><dt>Niveluri</dt><dd>{enrollment?.levels?.join(", ") || school.levels}</dd></div><div><dt>Proprietate</dt><dd>{school.ownership}</dd></div><div><dt>Localitate</dt><dd>{school.city}</dd></div><div><dt>Județ</dt><dd>{school.county}</dd></div><div><dt>Adresă</dt><dd>{school.address || "Nu este publicată"}</dd></div><div><dt>Telefon</dt><dd>{school.phone ? <a href={`tel:${school.phone}`}>{school.phone}</a> : "Nu este publicat"}</dd></div><div><dt>Email</dt><dd>{school.email ? <a href={`mailto:${school.email}`}>{school.email}</a> : "Nu este publicat"}</dd></div><div><dt>Cod SIIIR</dt><dd>{school.siiirCode}</dd></div>
            </dl>{mapUrl && <a className="map-button" href={mapUrl} target="_blank" rel="noreferrer"><MapPin /> Vezi pe hartă <ExternalLink /></a>}</section>

            {history.length > 1 && <section className="facts-card history-card"><h2>Evoluția efectivelor</h2>{history.map((item) => <div className="history-row" key={item.schoolYear}><span>{item.schoolYear}</span><strong>{formatNumber(item.students)} elevi</strong><small>{formatClasses(item.classes)} clase</small></div>)}</section>}

            <section className="facts-card source-card" id="surse"><h2>Surse și verificare</h2><p>Fiecare indicator păstrează legătura spre setul public din care provine. Datele județene sunt marcate separat.</p>
              <a href={SCHOOL_NETWORK_SOURCE} target="_blank" rel="noreferrer">Rețeaua școlară <ArrowUpRight /></a>{enrollment && <a href={enrollment.source} target="_blank" rel="noreferrer">Elevi și clase <ArrowUpRight /></a>}{quality && <a href={quality.source} target="_blank" rel="noreferrer">Registrul ARACIP <ArrowUpRight /></a>}{coordinates && <a href={coordinates.source} target="_blank" rel="noreferrer">Coordonate școli <ArrowUpRight /></a>}
              <a href={AFIR_BENEFICIARIES_SOURCE} target="_blank" rel="noreferrer">AFIR · date deschise FEADR/PNDR <ArrowUpRight /></a>
              {enrichment?.officialWebsite && <a href={enrichment.officialWebsite} target="_blank" rel="noreferrer">Site-ul oficial al școlii <ArrowUpRight /></a>}
              {secondaryContact && <a href={secondaryContact.sourceUrl} target="_blank" rel="noreferrer">Sursa secundară pentru contact <ArrowUpRight /></a>}
              {enrichment?.procurementUrl && <a href={enrichment.procurementUrl} target="_blank" rel="noreferrer">Achizițiile acestei unități <ArrowUpRight /></a>}
              {enrichment?.budgetUrl && <a href={enrichment.budgetUrl} target="_blank" rel="noreferrer">Buget și execuție <ArrowUpRight /></a>}
              {enrichment?.vacanciesUrl && <a href={enrichment.vacanciesUrl} target="_blank" rel="noreferrer">Posturi disponibile <ArrowUpRight /></a>}
            </section>
          </aside>
        </section>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
