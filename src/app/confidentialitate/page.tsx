import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confidențialitate",
  description: "Cum folosim statisticile opționale pe Top Edu.",
};

export default function PrivacyPage() {
  return <main id="continut" style={{ maxWidth: 780, margin: "0 auto", padding: "48px 20px", lineHeight: 1.7 }}>
    <h1>Confidențialitate</h1>
    <p>Actualizat la 26 octombrie 2026. Pentru întrebări, scrie la <a href="mailto:contact@top-edu.ro">contact@top-edu.ro</a>.</p>
    <h2>Statistici opționale</h2>
    <p>Încărcăm Google Analytics 4 numai după ce alegi „Accept statisticile”. Măsurăm vizitele și paginile accesate pentru a înțelege utilizarea site-ului. Trimiterea exclude parametrii de căutare și datele din formulare. Google poate stoca cookie-uri <code>_ga</code> și <code>_ga_*</code>. Nu activăm Google Signals sau personalizarea publicității prin această integrare.</p>
    <p>Poți refuza sau retrage acordul din butonul „Preferințe statistici”. La retragere oprim măsurarea și ștergem cookie-urile Analytics accesibile pe domeniu. Datele transmise anterior nu sunt șterse automat. Alegerea este păstrată local în browser.</p>
    <h2>Date publice</h2>
    <p>Informațiile despre școli afișate de Top Edu provin din sursele publice menționate în <a href="/metodologie">metodologie</a>.</p>
  </main>;
}
