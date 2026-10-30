import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/google-analytics";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.top-edu.ro"),
  title: { default: "Top Edu — Transparență în educație", template: "%s | Top Edu" },
  description: "Vezi date publice despre școlile din România: bugete, indicatori, contacte și metodologia Top Edu.",
  alternates: { canonical: "/" },
  keywords: ["școli România", "date publice școli", "rețeaua școlară 2025 2026", "SIIIR"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://www.top-edu.ro",
    siteName: "Top Edu",
    title: "Top Edu — Transparență în educație",
    description: "Date publice despre școlile din România, explicate clar și verificabil.",
    images: [{ url: "/top-edu-family.png", width: 1600, height: 900, alt: "Elevi și prieteni în curtea unei școli din România" }],
  },
  twitter: { card: "summary_large_image", title: "Top Edu — Transparență în educație", description: "Date publice despre școlile din România, explicate clar și verificabil.", images: ["/top-edu-family.png"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <GoogleAnalytics measurementId="G-9ZWW2XC9PL" siteName="Top Edu" />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", "@id": "https://www.top-edu.ro/#organization", name: "Top Edu", url: "https://www.top-edu.ro", logo: "https://www.top-edu.ro/icon.svg" },
            { "@type": "WebSite", "@id": "https://www.top-edu.ro/#website", url: "https://www.top-edu.ro", name: "Top Edu", publisher: { "@id": "https://www.top-edu.ro/#organization" }, inLanguage: "ro-RO", potentialAction: { "@type": "SearchAction", target: "https://www.top-edu.ro/?q={search_term_string}", "query-input": "required name=search_term_string" } }
          ]
        }) }} />
      </body>
    </html>
  );
}
