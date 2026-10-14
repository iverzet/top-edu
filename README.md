# Top Edu

Director independent al școlilor din România, pregătit pentru publicare pe Vercel la `top-edu.ro`.

## Ce conține acum

- homepage cu căutare și filtrare în registrul oficial importat;
- profiluri de școală cu elevi, clase, ofertă, rezultate, hartă și evaluări ARACIP;
- metodologie pentru importul SIIIR / ARACIP;
- politică pentru recenzii moderate și surse externe separate;
- metadata, imagini optimizate și configurare Vercel.

Registrul inclus este „Rețeaua școlară 2025–2026”, publicat de Ministerul Educației pe data.gov.ro și importat la 8 octombrie 2025. Conține 18.022 de unități și codurile SIIIR aferente.

Profilurile sunt îmbogățite din surse publice oficiale cu:

- elevi, clase, niveluri, limbi de predare și calificări pentru 2025–2026;
- evoluția efectivelor față de 2024–2025;
- rezultate oficiale Evaluarea Națională și Bacalaureat pentru 2024, 2025 și 2026, agregate pe cod SIIIR;
- coordonate GPS pentru linkuri OpenStreetMap;
- evaluări externe periodice din registrul ARACIP;
- contextul PNRR la nivel de județ, marcat explicit ca nefiind o atribuire directă școlii.

Acoperirea curentă în registrul Top Edu: 17.898 profiluri cu cel puțin un strat suplimentar, 17.217 cu elevi și clase, 15.656 cu coordonate, 4.637 cu evaluare ARACIP și 8.150 cu cel puțin un rezultat la examene.

## Actualizarea datelor oficiale

Importul mare folosește `pandas` și `openpyxl`:

```bash
python scripts/import-official-enrichment.py \
  --students-current students-2025-2026.xlsx \
  --students-previous students-2024-2025.xlsx \
  --bac 2024=bac-2024-s1.xlsx \
  --bac 2025=bac-2025-s1.xlsx \
  --bac 2026=bac-2026-s1.xlsx \
  --en 2026=en-2026.xlsx \
  --coordinates coordinates.xlsx \
  --aracip-evaluated aracip-evaluated.xlsx
```

Site-urile oficiale, paginile de posturi, achizițiile, bugetele și mediile de admitere pot fi adăugate numai când există o asociere verificată cu unitatea. Se importă dintr-un CSV prin:

```bash
python scripts/import-school-supplements.py supplements.csv
```

Antetul CSV acceptat este `siiirCode,officialWebsite,vacanciesUrl,procurementUrl,budgetUrl,admissionYear,specialization,lastAdmissionAverage,places,admissionSource`.

## Fotografii reale verificate

Fotografiile sunt căutate în Wikimedia Commons, KartaView/OpenStreetCam și Panoramax; Mapillary este opțional. Primele trei surse funcționează fără cheie și furnizează numai imagini cu licență reutilizabilă. DeepSeek Vision verifică maximum două imagini într-un singur apel, fără recunoaștere facială. Sunt publicate automat doar imaginile cu dovadă nominală directă sau, pentru fotografia stradală, cu distanță de maximum 25 m, indicii distinctive și scor de minimum `0.98`.

Cheile rămân exclusiv în mediul local și nu se prefixează cu `NEXT_PUBLIC_`:

```powershell
$env:DEEPSEEK_API_KEY="cheia-ta"
$env:MAPILLARY_ACCESS_TOKEN="tokenul-gratuit-mapillary" # opțional
npm run images:import -- --limit 25 --source all --batch-images 2 --min-balance 0.50
```

Pentru o probă numai din Wikimedia:

```powershell
npm run images:import -- --limit 10 --source wikimedia --dry-run
```

Rezultatele acceptate sunt scrise în `src/data/school-images.json`, iar încercările sunt memorate în `src/data/school-image-attempts.json`, ca aceeași școală să nu consume repetat credit. Soldul DeepSeek este verificat periodic, iar rularea se oprește automat la pragul `--min-balance`. Fiecare fotografie păstrează autorul, licența, pagina sursă, distanța, scorul și data verificării. Dacă nu există o fotografie verificată, profilul păstrează ilustrația categoriei.

## Dezvoltare

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Publicare

Repository-ul poate fi importat direct în Vercel ca proiect Next.js. Variabilele viitoare sunt documentate în `.env.example`; secretele nu se salvează în Git.
