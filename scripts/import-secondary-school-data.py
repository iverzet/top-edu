"""Build conservative contact fallbacks from a bot-generated school CSV.

The CSV has no SIIIR key, so records are matched by normalized school name.
Only unique URLs, non-social sources, and values missing from the official
school record are retained. The result is intentionally a small, auditable
fallback dataset rather than a replacement for official data.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlparse


RISKY_DOMAINS = {
    "facebook.com",
    "bing.com",
    "schoolandcollegelistings.com",
    "findglocal.com",
    "govserv.org",
    "firmania.ro",
    "wikipedia.org",
    "ro.wikipedia.org",
    "en.wikipedia.org",
    "sites.google.com",
    "scoli.didactic.ro",
}
PLACEHOLDER = re.compile(r"^(?:n/?a|na|necunoscut|nu este publicat|-)\s*$", re.I)


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(char for char in value if not unicodedata.combining(char))
    value = re.sub(r"[^a-z0-9]+", " ", value.lower())
    return re.sub(r"\s+", " ", value).strip()


def clean(value: str | None) -> str:
    return (value or "").strip()


def source_type(domain: str) -> str:
    if any(token in domain for token in ("primaria", "primarii", "primar", "isj", "invatamant", "eduhr", "bucuresti")):
        return "autoritate_publica"
    if domain in {"scoalaeco.ro", "aiparte.ro", "infotescu.ro", "scolionline.ro", "scolile.ro", "orasul.vostru.ro", "gradinitalumina.ro"}:
        return "director_educational"
    return "site_public_candidat"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", required=True, type=Path)
    parser.add_argument("--schools", default=Path("src/data/schools.json"), type=Path)
    parser.add_argument("--output", default=Path("src/data/school-secondary.json"), type=Path)
    args = parser.parse_args()

    schools = json.loads(args.schools.read_text(encoding="utf-8"))
    with args.csv.open(encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))

    by_name: defaultdict[str, list[int]] = defaultdict(list)
    for index, school in enumerate(schools):
        by_name[normalize(school["name"])].append(index)

    url_counts = Counter(clean(row.get("url_site")) for row in rows)
    output: list[dict[str, object]] = []
    seen_codes: set[str] = set()

    for row in rows:
        matches = by_name.get(normalize(clean(row.get("nume_scoala"))), [])
        url = clean(row.get("url_site"))
        if len(matches) != 1 or not url or url_counts[url] != 1:
            continue

        parsed = urlparse(url)
        domain = parsed.netloc.lower().removeprefix("www.")
        if domain in RISKY_DOMAINS:
            continue

        school = schools[matches[0]]
        fallback: dict[str, str] = {}

        address = clean(row.get("adresa"))
        if not school.get("address") and len(address) >= 8 and not PLACEHOLDER.match(address) and "n/a" not in address.lower():
            fallback["address"] = address

        phone = clean(row.get("telefon"))
        if not school.get("phone") and len(re.sub(r"\D", "", phone)) >= 9 and not PLACEHOLDER.match(phone):
            fallback["phone"] = phone

        email = clean(row.get("email"))
        if not school.get("email") and re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
            fallback["email"] = email

        if not fallback or school["siiirCode"] in seen_codes:
            continue
        seen_codes.add(school["siiirCode"])
        output.append({
            "siiirCode": school["siiirCode"],
            "schoolName": school["name"],
            "sourceUrl": url,
            "sourceDomain": domain,
            "sourceType": source_type(domain),
            "confidence": "candidate",
            **fallback,
        })

    output.sort(key=lambda item: str(item["siiirCode"]))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(output)} conservative secondary records to {args.output}")


if __name__ == "__main__":
    main()
