#!/usr/bin/env python3
"""Importă rezultate EN/Bac dintr-un CSV oficial în src/data/exam-results.json.

CSV-ul trebuie să aibă coloanele: siiirCode,exam,year,average,passRate,candidates,source.
Valorile lipsă rămân necompletate; scriptul nu inventează rezultate.
"""
from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src" / "data" / "exam-results.json"
REQUIRED = {"siiirCode", "exam", "year", "source"}


def number(value: str, integer: bool = False):
    if not value.strip():
        return None
    return int(value) if integer else float(value.replace(",", "."))


def main() -> int:
    if len(sys.argv) != 2:
        print("Utilizare: python scripts/import-exam-results.py rezultate.csv", file=sys.stderr)
        return 2
    source = Path(sys.argv[1])
    if not source.exists():
        print(f"Fișier inexistent: {source}", file=sys.stderr)
        return 2
    with source.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        fields = set(reader.fieldnames or [])
        missing = REQUIRED - fields
        if missing:
            print(f"Lipsesc coloanele: {', '.join(sorted(missing))}", file=sys.stderr)
            return 2
        rows = []
        for row in reader:
            if row["exam"] not in {"Evaluarea Națională", "Bacalaureat"}:
                continue
            item = {"siiirCode": row["siiirCode"].strip(), "exam": row["exam"].strip(), "year": int(row["year"]), "source": row["source"].strip()}
            for key in ("average", "passRate", "candidates"):
                value = number(row.get(key, ""), integer=key == "candidates")
                if value is not None:
                    item[key] = value
            rows.append(item)
    OUTPUT.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Importate {len(rows)} rezultate în {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
