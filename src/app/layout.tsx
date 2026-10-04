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
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://top-edu.ro",
    siteName: "Top Edu",
    title: "Top Edu — Transparență în educație",
    description: "Date publice despre școlile din România, explicate clar și verificabil.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
