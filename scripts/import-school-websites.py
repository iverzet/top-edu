#!/usr/bin/env python3
"""Merge public school URLs discovered by the Python collection script.

The input CSV must contain ``nume_scoala`` and ``url_site``.  A URL is merged
only when the normalized school name maps to exactly one SIIIR record.  Names
with multiple schools are skipped rather than guessed.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import unicodedata
from collections import defaultdict
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCHOOLS = ROOT / "src" / "data" / "schools.json"
ENRICHMENT = ROOT / "src" / "data" / "school-enrichment.json"


def norm(value: object) -> str:
    text = unicodedata.normalize("NFKD", str(value or "")).encode("ascii", "ignore").decode()
    return re.sub(r"\s+", " ", re.sub(r"[^A-Z0-9]+", " ", text.upper())).strip()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_file", type=Path)
    args = parser.parse_args()

    schools = json.loads(SCHOOLS.read_text(encoding="utf-8"))
    enrichment = json.loads(ENRICHMENT.read_text(encoding="utf-8"))
    by_name = defaultdict(list)
    for school in schools:
        by_name[norm(school.get("name"))].append(school)
    by_code = {item["siiirCode"]: item for item in enrichment}

    rows = urls = matched = skipped_ambiguous = skipped_invalid = 0
    with args.csv_file.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            rows += 1
            url = (row.get("url_site") or "").strip()
            if not url:
                continue
            urls += 1
            if not re.match(r"^https?://", url, re.IGNORECASE):
                skipped_invalid += 1
                continue
            candidates = by_name.get(norm(row.get("nume_scoala"))) or []
            if len(candidates) != 1:
                skipped_ambiguous += 1
                continue
            item = by_code.get(candidates[0].get("siiirCode"))
            if item is None:
                skipped_ambiguous += 1
                continue
            item["officialWebsite"] = url
            matched += 1

    ENRICHMENT.write_text(json.dumps(enrichment, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"rows={rows} urls={urls} matched={matched} skipped_ambiguous={skipped_ambiguous} skipped_invalid={skipped_invalid}")


if __name__ == "__main__":
    main()
