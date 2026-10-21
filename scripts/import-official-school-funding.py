#!/usr/bin/env python3
"""Import official, school-level education funding records.

Only records whose applicant is an individual school are imported.  Lists in
which the applicant is a county or a commune (for example the electric
school-bus and broad equipment calls) are deliberately excluded: a county
beneficiary cannot safely be attributed to one school without a second official
allocation table.

Usage (from the repository root)::

    python scripts/import-official-school-funding.py \
      --smartlabs C:/path/SmartLabs.pdf \
      --pnras C:/path/PNRAS-scoli-mici.pdf

The default output is ``src/data/school-investments.json``.
"""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
SCHOOLS_PATH = ROOT / "src" / "data" / "schools.json"
DEFAULT_OUTPUT = ROOT / "src" / "data" / "school-investments.json"

SMARTLABS_SOURCE = (
    "https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2022/PNRR/"
    "Smartlabs/liste_beneficiari/Lista_refacuta_proiecte_selectate_finantare_SmartLabs_ME_26_05_2023.pdf"
)
PNRAS_SOURCE = (
    "https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2023/PNRR/"
    "PNRAS_II/Scoli_mici/liste/09_05_2024_Rezultate_lista_finala_beneficiari.pdf"
)

COUNTIES = {
    "AB": "ALBA", "AR": "ARAD", "AG": "ARGES", "BC": "BACAU", "BH": "BIHOR",
    "BN": "BISTRITA NASAUD", "BT": "BOTOSANI", "BV": "BRASOV", "BR": "BRAILA",
    "B": "BUCURESTI", "BZ": "BUZAU", "CS": "CARAS SEVERIN", "CL": "CALARASI",
    "CJ": "CLUJ", "CT": "CONSTANTA", "CV": "COVASNA", "DB": "DAMBOVITA",
    "DJ": "DOLJ", "GL": "GALATI", "GR": "GIURGIU", "GJ": "GORJ", "HR": "HARGHITA",
    "HD": "HUNEDOARA", "IL": "IALOMITA", "IS": "IASI", "IF": "ILFOV",
    "MM": "MARAMURES", "MH": "MEHEDINTI", "MS": "MURES", "NT": "NEAMT",
    "OT": "OLT", "PH": "PRAHOVA", "SM": "SATU MARE", "SJ": "SALAJ",
    "SB": "SIBIU", "SV": "SUCEAVA", "TR": "TELEORMAN", "TM": "TIMIS",
    "TL": "TULCEA", "VS": "VASLUI", "VL": "VALCEA", "VN": "VRANCEA",
}


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def norm(value: object) -> str:
    text = unicodedata.normalize("NFKD", clean(value)).encode("ascii", "ignore").decode()
    text = text.upper()
    text = re.sub(r"[^A-Z0-9]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def school_code(value: object) -> str:
    digits = re.sub(r"\D", "", clean(value))
    return digits.zfill(10) if digits else ""


def pdf_text(path: Path) -> str:
    return "\n".join(clean(page.extract_text() or "") for page in PdfReader(str(path)).pages)


def school_index():
    schools = json.loads(SCHOOLS_PATH.read_text(encoding="utf-8"))
    by_name = {}
    for school in schools:
        name = norm(school.get("name"))
        if not name or not school.get("siiirCode"):
            continue
        # Keep the longest spelling when a source contains duplicate aliases.
        by_name.setdefault(name, school)
    prepared = []
    for school in schools:
        name = norm(school.get("name"))
        county = norm(COUNTIES.get(school.get("county", ""), school.get("county", "")))
        if name and county and school.get("siiirCode"):
            prepared.append((name, county, school))
    return schools, by_name, prepared


def match_school(block: str, prepared: list[tuple[str, str, dict]]) -> dict | None:
    """Return a school only for a strong name + county match.

    The source PDFs have no SIIIR column.  We therefore require the complete
    normalized school name and its county name to occur in the same row block.
    This intentionally leaves ambiguous rows unmatched instead of guessing.
    """
    block_norm = norm(block)
    candidates = []
    for name, county, school in prepared:
        if name and name in block_norm and county and county in block_norm:
            candidates.append(school)
    if len(candidates) == 1:
        return candidates[0]
    return None


def amount_from_smartlabs(block: str) -> float | None:
    # The final amount is the largest comma-grouped currency value in the row.
    values = []
    for raw in re.findall(r"\d{1,3}(?:,\d{3})+(?:\.\d+)?", block):
        try:
            values.append(float(raw.replace(",", "")))
        except ValueError:
            pass
    return max(values) if values else None


def smartlabs_records(path: Path, prepared: list[tuple[str, str, dict]]) -> list[dict]:
    text = pdf_text(path)
    blocks = re.split(r"(?=F-PNRR-SmartLabs-\d+-\d+)", text)
    records = []
    for block in blocks:
        match = re.search(r"F-PNRR-SmartLabs-\d+-\d+", block)
        if not match:
            continue
        school = match_school(block, prepared)
        if not school:
            continue
        amount = amount_from_smartlabs(block)
        records.append({
            "siiirCode": school_code(school["siiirCode"]),
            "program": "PNRR",
            "title": "SmartLab — dotarea laboratorului inteligent",
            "beneficiary": clean(school["name"]),
            "status": "selectat pentru finanțare",
            "year": "2023",
            **({"amountLei": round(amount, 2)} if amount else {}),
            "source": SMARTLABS_SOURCE,
        })
    return records


def pnras_records(path: Path, prepared: list[tuple[str, str, dict]]) -> list[dict]:
    text = pdf_text(path)
    # Rows start with a numeric index.  Keeping the row block preserves names
    # split over multiple PDF lines.
    blocks = re.split(r"(?=\n?\d+\s+)", text)
    records = []
    for block in blocks:
        if "ADMIS" not in norm(block):
            continue
        school = match_school(block, prepared)
        if not school:
            continue
        records.append({
            "siiirCode": school_code(school["siiirCode"]),
            "program": "PNRR",
            "title": "PNRAS II — Școli mici",
            "beneficiary": clean(school["name"]),
            "status": "ADMIS",
            "year": "2024",
            "source": PNRAS_SOURCE,
        })
    return records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--smartlabs", type=Path)
    parser.add_argument("--pnras", type=Path)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    if not args.smartlabs and not args.pnras:
        parser.error("specify --smartlabs and/or --pnras")

    _, _, prepared = school_index()
    records = []
    if args.smartlabs:
        records.extend(smartlabs_records(args.smartlabs, prepared))
    if args.pnras:
        records.extend(pnras_records(args.pnras, prepared))

    grouped: dict[str, list[dict]] = {}
    for record in records:
        grouped.setdefault(record["siiirCode"], []).append(record)
    for values in grouped.values():
        values.sort(key=lambda item: (item.get("year", ""), item["title"]))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(grouped, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"matched_records={len(records)} schools={len(grouped)}")
    print(f"smartlabs={sum(r['title'].startswith('SmartLab') for r in records)}")
    print(f"pnras={sum(r['title'].startswith('PNRAS') for r in records)}")


if __name__ == "__main__":
    main()
