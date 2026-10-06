import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://top-edu.ro"),
  title: { default: "Top Edu — Transparență în educație", template: "%s | Top Edu" },
  description: "Vezi date publice despre școlile din România: bugete, indicatori, contacte și metodologia Top Edu.",
  alternates: { canonical: "/" },
  keywords: ["școli România", "date publice școli", "rețeaua școlară 2025 2026", "SIIIR"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://top-edu.ro",
    siteName: "Top Edu",
    title: "Top Edu — Transparență în educație",
    description: "Date publice despre școlile din România, explicate clar și verificabil.",
  },
  twitter: { card: "summary_large_image", title: "Top Edu — Transparență în educație", description: "Date publice despre școlile din România, explicate clar și verificabil." },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": "https://top-edu.ro/#organization", name: "Top Edu", url: "https://top-edu.ro", logo: "https://top-edu.ro/icon.svg" },
            { "@type": "WebSite", "@id": "https://top-edu.ro/#website", url: "https://top-edu.ro", name: "Top Edu", publisher: { "@id": "https://top-edu.ro/#organization" }, inLanguage: "ro-RO", potentialAction: { "@type": "SearchAction", target: "https://top-edu.ro/?q={search_term_string}", "query-input": "required name=search_term_string" } }
          ]
        }) }} />
      </body>
    </html>
  );
}
