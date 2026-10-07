#!/usr/bin/env python3
"""Build school-level enrichment datasets from official Romanian public data.

Required: pandas and openpyxl.
The importer deliberately joins only by SIIIR, except ARACIP where the public
register has no SIIIR and a conservative exact name + county match is used.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import unicodedata
import urllib.request
from collections import defaultdict
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "src" / "data"

STUDENT_SOURCES = {
    "2025-2026": "https://data.gov.ro/dataset/5c5a2c88-57fb-42c8-8d3a-a2d8666d6a55",
    "2024-2025": "https://data.gov.ro/dataset/3cedeed4-ead1-46f7-bc9f-fbe45f4430d7",
}

BAC_SOURCES = {
    2025: "https://data.gov.ro/dataset/b3af0e55-19ff-4e6c-8b1c-6a715c10cb04",
    2024: "https://data.gov.ro/dataset/c23424d9-2367-44ee-a19f-2405277ed9ec",
}

COORDINATES_SOURCE = "https://data.gov.ro/dataset/a37f4344-d4fe-40e1-bba7-125e1fea8137"
ARACIP_SOURCE = "https://aracip.eu/categorii-documente/info-unitati-invatamant-registre"
PNRR_SOURCE = "https://pnrr.edu.ro/harta-uat/"

COUNTY_SLUGS = {
    "AB": "alba", "AR": "arad", "AG": "arges", "BC": "bacau", "BH": "bihor",
    "BN": "bistrita-nasaud", "BT": "botosani", "BV": "brasov", "BR": "braila",
    "B": "bucuresti", "BZ": "buzau", "CS": "caras-severin", "CL": "calarasi",
    "CJ": "cluj", "CT": "constanta", "CV": "covasna", "DB": "dambovita",
    "DJ": "dolj", "GL": "galati", "GR": "giurgiu", "GJ": "gorj", "HR": "harghita",
    "HD": "hunedoara", "IL": "ialomita", "IS": "iasi", "IF": "ilfov",
    "MM": "maramures", "MH": "mehedinti", "MS": "mures", "NT": "neamt",
    "OT": "olt", "PH": "prahova", "SM": "satu-mare", "SJ": "salaj",
    "SB": "sibiu", "SV": "suceava", "TR": "teleorman", "TM": "timis",
    "TL": "tulcea", "VS": "vaslui", "VL": "valcea", "VN": "vrancea",
}


def clean(value) -> str:
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()


def code(value) -> str:
    digits = re.sub(r"\D", "", clean(value).split(".")[0])
    return digits.zfill(10) if digits else ""


def number(value):
    try:
        result = float(value)
        return result if math.isfinite(result) else None
    except (TypeError, ValueError):
        return None


def unique(values, limit=20):
    result = []
    seen = set()
    for value in values:
        item = clean(value)
        if not item or item.casefold() in {"nan", "nu", "-"}:
            continue
        key = item.casefold()
        if key not in seen:
            seen.add(key)
            result.append(item)
    return sorted(result, key=str.casefold)[:limit]


def normalized_name(value: str) -> str:
    text = unicodedata.normalize("NFKD", clean(value)).encode("ascii", "ignore").decode()
    text = text.upper().replace("Ş", "S").replace("Ţ", "T")
    text = re.sub(r"\b(SCOALA CU CLASELE [IVX\-]+|UNITATEA DE INVATAMANT)\b", "SCOALA", text)
    return re.sub(r"[^A-Z0-9]+", " ", text).strip()


def read_json(path: Path, fallback):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else fallback


def write_json(path: Path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def enrollment(path: Path, school_year: str, current: bool):
    frame = pd.read_excel(path, sheet_name="export" if current else "Export")
    code_col = "Cod SIIIR unitate" if current else "Cod Unitate Plan"
    students_col = "Nr. elevi distincti" if current else "Elevi exist anterior-asoc"
    classes_col = "Clase existente" if current else "Clase exist anterior-formatiun"
    result = {}
    for raw_code, rows in frame.groupby(code_col, dropna=True):
        siiir = code(raw_code)
        if not siiir:
            continue
        students = pd.to_numeric(rows[students_col], errors="coerce").sum(min_count=1)
        classes = pd.to_numeric(rows[classes_col], errors="coerce").sum(min_count=1)
        item = {
            "schoolYear": school_year,
            "students": int(round(students)) if pd.notna(students) else None,
            "classes": round(float(classes), 2) if pd.notna(classes) else None,
            "source": STUDENT_SOURCES[school_year],
        }
        if current:
            item.update({
                "levels": unique(rows.get("Nivel invatamant", [])),
                "languages": unique(rows.get("Limba predare", []), 10),
                "specializations": unique(
                    list(rows.get("Spec/Calif niv.4", [])) + list(rows.get("Calif niv.3", [])), 16
                ),
                "studyForms": unique(rows.get("Forma invatamant", []), 8),
                "dual": any(clean(v).casefold() == "da" for v in rows.get("Dual", [])),
                "specialEducation": any(bool(clean(v)) for v in rows.get("Deficiente", [])),
            })
        result[siiir] = {k: v for k, v in item.items() if v not in (None, [], "")}
    return result


def bac_results(path: Path, year: int):
    frame = pd.read_excel(path, sheet_name="export")
    result = []
    for raw_code, rows in frame.groupby("Unitate (SIIIR)", dropna=True):
        siiir = code(raw_code)
        if not siiir:
            continue
        statuses = rows["STATUS"].fillna("").astype(str).str.strip().str.casefold()
        averages = pd.to_numeric(rows["Medie"], errors="coerce")
        valid = averages.dropna()
        result.append({
            "siiirCode": siiir,
            "exam": "Bacalaureat",
            "year": year,
            "average": round(float(valid.mean()), 2) if not valid.empty else None,
            "passRate": round(float((statuses == "promovat").mean() * 100), 1),
            "candidates": int(len(rows)),
            "source": BAC_SOURCES[year],
            "session": "Sesiunea I",
        })
    return result


def coordinates(path: Path):
    frame = pd.read_excel(path, sheet_name="Sheet1")
    result = {}
    for _, row in frame.iterrows():
        siiir = code(row.get("Cod_SIIIR"))
        lat, lon = number(row.get("LAT")), number(row.get("LONG"))
        if siiir and lat and lon and 43 <= lat <= 49 and 20 <= lon <= 30:
            result[siiir] = {
                "latitude": round(lat, 6), "longitude": round(lon, 6),
                "source": COORDINATES_SOURCE,
            }
    return result


def aracip_evaluations(path: Path, schools):
    frame = pd.read_excel(path, header=2)
    by_key = defaultdict(list)
    for school in schools:
        by_key[(clean(school.get("county")).upper(), normalized_name(school.get("name", "")))].append(school)
    result = {}
    matched = 0
    for _, row in frame.iterrows():
        county = clean(row.get("Judeţ")).upper()
        raw_name = clean(row.get("Denumirea unității de învățământ"))
        candidates = []
        for variant in reversed(re.split(r"\s*/\s*|\n", raw_name)):
            candidates.extend(by_key.get((county, normalized_name(variant)), []))
        unique_candidates = {candidate["siiirCode"]: candidate for candidate in candidates}
        if len(unique_candidates) != 1:
            continue
        school = next(iter(unique_candidates.values()))
        result[school["siiirCode"]] = {
            "lastExternalEvaluation": clean(row.get("Anul evaluării")),
            "nextEvaluationSchoolYear": clean(row.get("Anul școlar \nîn care se va solicita \nurmătoarea evaluare \nperiodică")),
            "registerType": "Evaluare externă periodică",
            "source": ARACIP_SOURCE,
        }
        matched += 1
    print(f"ARACIP: {matched} evaluări asociate conservator prin denumire + județ")
    return result


def pnrr_counties():
    result = {}
    for county, slug in COUNTY_SLUGS.items():
        url = f"https://pnrr.edu.ro/wp-json/cds/v1/investments/{slug}"
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "TopEduDataImporter/1.0"})
            with urllib.request.urlopen(request, timeout=20) as response:
                payload = json.load(response)
            investments = payload.get("investments") or payload.get("investitii") or []
            result[county] = {
                "totalEuro": payload.get("valoareTotalaEur"),
                "totalLei": payload.get("valoareTotalaLei"),
                "investments": investments,
                "scope": "județean",
                "source": PNRR_SOURCE,
            }
        except Exception as exc:  # keep the build usable if one endpoint is temporarily unavailable
            print(f"PNRR {county}: {exc}")
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--students-current", type=Path, required=True)
    parser.add_argument("--students-previous", type=Path)
    parser.add_argument("--bac", action="append", default=[], metavar="YEAR=FILE")
    parser.add_argument("--coordinates", type=Path)
    parser.add_argument("--aracip-evaluated", type=Path)
    parser.add_argument("--skip-pnrr", action="store_true")
    args = parser.parse_args()

    schools = read_json(DATA_DIR / "schools.json", [])
    existing_enrichment = {
        item["siiirCode"]: item for item in read_json(DATA_DIR / "school-enrichment.json", [])
    }
    current = enrollment(args.students_current, "2025-2026", True)
    previous = enrollment(args.students_previous, "2024-2025", False) if args.students_previous else {}
    coords = coordinates(args.coordinates) if args.coordinates else {}
    quality = aracip_evaluations(args.aracip_evaluated, schools) if args.aracip_evaluated else {}

    records = []
    known_codes = {school["siiirCode"] for school in schools}
    all_codes = sorted((set(current) | set(previous) | set(coords) | set(quality)) & known_codes)
    for siiir in all_codes:
        record = {"siiirCode": siiir}
        for key in ("officialWebsite", "vacanciesUrl", "procurementUrl", "budgetUrl", "admission"):
            if key in existing_enrichment.get(siiir, {}):
                record[key] = existing_enrichment[siiir][key]
        history = []
        for item in (previous.get(siiir), current.get(siiir)):
            if item:
                history.append({
                    key: item[key] for key in ("schoolYear", "students", "classes", "source") if key in item
                })
        if current.get(siiir):
            record["enrollment"] = current[siiir]
        if history:
            record["enrollmentHistory"] = history
        if coords.get(siiir):
            record["coordinates"] = coords[siiir]
        if quality.get(siiir):
            record["quality"] = quality[siiir]
        records.append(record)
    write_json(DATA_DIR / "school-enrichment.json", records)

    if not args.skip_pnrr:
        write_json(DATA_DIR / "county-investments.json", pnrr_counties())

    exam_path = DATA_DIR / "exam-results.json"
    existing = read_json(exam_path, [])
    imported = []
    imported_years = set()
    for value in args.bac:
        year_text, file_text = value.split("=", 1)
        year = int(year_text)
        imported_years.add(year)
        imported.extend(bac_results(Path(file_text), year))
    if imported:
        kept = [r for r in existing if not (r.get("exam") == "Bacalaureat" and r.get("year") in imported_years)]
        write_json(exam_path, sorted(kept + imported, key=lambda r: (r["siiirCode"], r["exam"], -r["year"])))

    print(f"Îmbogățire: {len(records)} unități; înscrieri curente: {len(current)}; coordonate: {len(coords)}")
    print(f"BAC importat: {len(imported)} înregistrări")


if __name__ == "__main__":
    main()
