#!/usr/bin/env python3
"""Merge verified school websites, staffing, finance and admission CSV data.

CSV columns: siiirCode, officialWebsite, vacanciesUrl, procurementUrl,
budgetUrl, admissionYear, specialization, lastAdmissionAverage, places.
One school can have multiple admission rows. Empty values are ignored.
"""

import argparse
import csv
import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src" / "data" / "school-enrichment.json"


def code(value):
    digits = re.sub(r"\D", "", str(value or ""))
    return digits.zfill(10) if digits else ""


def numeric(value):
    value = str(value or "").strip().replace(",", ".")
    try:
        return float(value) if value else None
    except ValueError:
        return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_file", type=Path)
    args = parser.parse_args()

    records = json.loads(TARGET.read_text(encoding="utf-8"))
    by_code = {item["siiirCode"]: item for item in records}
    with args.csv_file.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            siiir = code(row.get("siiirCode"))
            if siiir not in by_code:
                continue
            item = by_code[siiir]
            for key in ("officialWebsite", "vacanciesUrl", "procurementUrl", "budgetUrl"):
                value = (row.get(key) or "").strip()
                if value:
                    item[key] = value
            specialization = (row.get("specialization") or "").strip()
            if specialization:
                admission = {
                    "year": (row.get("admissionYear") or "").strip(),
                    "specialization": specialization,
                    "lastAverage": numeric(row.get("lastAdmissionAverage")),
                    "places": int(numeric(row.get("places"))) if numeric(row.get("places")) is not None else None,
                    "source": (row.get("admissionSource") or "").strip(),
                }
                item.setdefault("admission", []).append({k: v for k, v in admission.items() if v not in (None, "")})

    TARGET.write_text(json.dumps(records, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Actualizate {len(records)} profiluri; valorile goale au fost ignorate.")


if __name__ == "__main__":
    main()
