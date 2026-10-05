# Top Edu

Director independent al școlilor din România, pregătit pentru publicare pe Vercel la `top-edu.ro`.

## Ce conține acum

- homepage cu căutare și filtrare în registrul oficial importat;
- profiluri statice de școală;
- metodologie pentru importul SIIIR / ARACIP;
- politică pentru recenzii moderate și surse externe separate;
- metadata, imagini optimizate și configurare Vercel.

Registrul inclus este „Rețeaua școlară 2025–2026”, publicat de Ministerul Educației pe data.gov.ro și importat la 8 octombrie 2025. Conține 18.022 de unități și codurile SIIIR aferente. Datele financiare, coordonatele și indicatorii suplimentari se adaugă separat, numai după documentarea sursei.

## Dezvoltare

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Publicare

Repository-ul poate fi importat direct în Vercel ca proiect Next.js. Variabilele viitoare sunt documentate în `.env.example`; secretele nu se salvează în Git.
