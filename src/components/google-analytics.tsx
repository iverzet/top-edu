"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

type Choice = "granted" | "denied" | null;
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __ga4Initialized?: Record<string, boolean>;
  __ga4LastPage?: string;
};

const storageKey = "statistics-consent-v1";
let inMemoryChoice: Choice = null;

function readChoice(): Choice {
  if (inMemoryChoice !== null) return inMemoryChoice;
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

function subscribeChoice(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey) return;
    inMemoryChoice = null;
    onChange();
  };
  window.addEventListener("statistics-consent-change", onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("statistics-consent-change", onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function readCityChoice() {
  return /(?:^|;\s*)cookie-consent=(?:accepted|declined)(?:;|$)/.test(document.cookie);
}

function subscribeCityChoice(onChange: () => void) {
  window.addEventListener("cookie-consent-change", onChange);
  return () => window.removeEventListener("cookie-consent-change", onChange);
}

function clearAnalyticsCookies() {
  const domain = window.location.hostname.replace(/^www\./, "");
  for (const item of document.cookie.split(";")) {
    const name = item.trim().split("=")[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; Domain=.${domain}; Path=/; SameSite=Lax`;
  }
}

export function GoogleAnalytics({
  measurementId,
  siteName,
  medical = false,
  waitForCityChoice = false,
}: {
  measurementId: string;
  siteName: string;
  medical?: boolean;
  waitForCityChoice?: boolean;
}) {
  const pathname = usePathname();
  const choice = useSyncExternalStore<Choice | "loading">(subscribeChoice, readChoice, () => "loading");
  const cityReady = useSyncExternalStore(subscribeCityChoice, readCityChoice, () => false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (choice !== "granted") return;
    const analyticsWindow = window as AnalyticsWindow;
    const disableKey = `ga-disable-${measurementId}`;
    const disabledWindow = window as unknown as Record<string, unknown>;
    if (medical && pathname.startsWith("/admin")) {
      disabledWindow[disableKey] = true;
      return;
    }
    disabledWindow[disableKey] = false;

    const pageLocation = medical ? `${window.location.origin}/` : `${window.location.origin}${pathname}`;
    const pageTitle = medical ? siteName : document.title;
    const pageReferrer = medical ? `${window.location.origin}/` : undefined;
    if (!analyticsWindow.__ga4Initialized?.[measurementId]) {
      analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
      analyticsWindow.gtag = analyticsWindow.gtag || function (...args: unknown[]) {
        analyticsWindow.dataLayer?.push(args);
      };
      analyticsWindow.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      analyticsWindow.gtag("js", new Date());
      analyticsWindow.gtag("config", measurementId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: pageLocation,
        page_title: pageTitle,
        ...(pageReferrer ? { page_referrer: pageReferrer } : {}),
      });
      const script = document.createElement("script");
      script.async = true;
      script.dataset.ga4Id = measurementId;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
      analyticsWindow.__ga4Initialized = { ...analyticsWindow.__ga4Initialized, [measurementId]: true };
    }
    analyticsWindow.gtag?.("consent", "update", { analytics_storage: "granted" });
    const pageKey = `${measurementId}:${pageLocation}`;
    if (analyticsWindow.__ga4LastPage === pageKey) return;
    analyticsWindow.__ga4LastPage = pageKey;
    analyticsWindow.gtag?.("event", "page_view", {
      send_to: measurementId,
      page_location: pageLocation,
      page_title: pageTitle,
      ...(pageReferrer ? { page_referrer: pageReferrer } : {}),
    });
  }, [choice, medical, measurementId, pathname, siteName]);

  function choose(value: Exclude<Choice, null>) {
    inMemoryChoice = value;
    try { window.localStorage.setItem(storageKey, value); } catch { /* The choice still applies in this tab. */ }
    const analyticsWindow = window as AnalyticsWindow;
    analyticsWindow.__ga4LastPage = undefined;
    if (value === "denied") {
      (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = true;
      analyticsWindow.gtag?.("consent", "update", { analytics_storage: "denied" });
      clearAnalyticsCookies();
    }
    window.dispatchEvent(new Event("statistics-consent-change"));
    setSettingsOpen(false);
  }

  if (choice === "loading" || (waitForCityChoice && !cityReady)) return null;
  const showPanel = choice === null || settingsOpen;
  return <>
    {showPanel && <aside role="dialog" aria-label="Preferințe statistici" style={{ position: "fixed", zIndex: 60, bottom: 12, right: 12, left: 12, maxWidth: 430, marginLeft: "auto", padding: 18, border: "1px solid #cbd5e1", borderRadius: 16, background: "white", boxShadow: "0 12px 38px #0f172a25", color: "#0f172a", fontFamily: "system-ui, sans-serif" }}>
      <strong>Statistici opționale</strong>
      <p style={{ margin: "8px 0 12px", fontSize: 14, lineHeight: 1.5 }}>
        {medical ? "Cu acordul tău, folosim Google Analytics pentru a număra vizitele. Nu trimitem adresa paginii, căutări sau date din formulare." : "Cu acordul tău, folosim Google Analytics pentru a înțelege vizitele și paginile accesate. Nu trimitem date din formulare sau parametrii căutărilor."} <Link href="/confidentialitate" style={{ textDecoration: "underline" }}>Detalii</Link>
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button type="button" onClick={() => choose("granted")} style={{ border: 0, borderRadius: 8, padding: "9px 12px", background: "#0369a1", color: "white", cursor: "pointer" }}>Accept statisticile</button>
        <button type="button" onClick={() => choose("denied")} style={{ border: "1px solid #94a3b8", borderRadius: 8, padding: "9px 12px", background: "white", color: "#0f172a", cursor: "pointer" }}>Refuz statisticile</button>
      </div>
    </aside>}
    {choice !== null && !showPanel && <button type="button" onClick={() => setSettingsOpen(true)} style={{ position: "fixed", zIndex: 40, bottom: 12, left: 12, border: "1px solid #94a3b8", borderRadius: 8, padding: "7px 10px", background: "white", color: "#0f172a", fontSize: 12, cursor: "pointer" }}>Preferințe statistici</button>}
  </>;
}
