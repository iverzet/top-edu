#!/usr/bin/env python3
"""Import locally reviewed school photos into the Top Edu static site.

The input manifest is produced by selecteaza_imagini.py. Only rows marked
acceptata_automat or revizuire_manuala are imported. Images are resized and
converted to WebP so the repository does not contain the original downloads.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import unicodedata
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SCHOOLS_PATH = ROOT / "src" / "data" / "schools.json"
OUTPUT_PATH = ROOT / "src" / "data" / "school-images.json"
DEFAULT_ASSET_DIR = ROOT / "public" / "school-images"
ALLOWED_DECISIONS = {"acceptata_automat", "revizuire_manuala"}


def normalized(value: str) -> str:
    value = unicodedata.normalize("NFD", value.lower())
    value = "".join(char for char in value if unicodedata.category(char) != "Mn")
    return re.sub(r"[^a-z0-9]+", "", value)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", type=Path)
    parser.add_argument("--quality", type=int, default=82)
    parser.add_argument("--max-width", type=int, default=1800)
    parser.add_argument("--max-height", type=int, default=1200)
    parser.add_argument("--asset-dir", type=Path, default=DEFAULT_ASSET_DIR)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    schools = json.loads(SCHOOLS_PATH.read_text(encoding="utf-8"))
    schools_by_name = {normalized(school["name"]): school for school in schools}
    rows = list(csv.DictReader(args.manifest.open(encoding="utf-8-sig", newline="")))
    selected = [
        row for row in rows
        if row.get("decizie") in ALLOWED_DECISIONS and row.get("imagine_selectata")
    ]
    args.asset_dir.mkdir(parents=True, exist_ok=True)
    def process(row: dict[str, str]) -> tuple[str, dict[str, object] | None, str | None]:
        school = schools_by_name.get(normalized(row["nume_scoala"]))
        if not school:
            return "", None, f"școală: {row['nume_scoala']}"
        source_path = Path(row["imagine_selectata"])
        if not source_path.is_file():
            return "", None, str(source_path)
        try:
            with Image.open(source_path) as original:
                image = ImageOps.exif_transpose(original).convert("RGB")
                image.thumbnail((args.max_width, args.max_height), Image.Resampling.LANCZOS)
                destination = args.asset_dir / f"{school['siiirCode']}.webp"
                # method=4 keeps the one-time import practical on a normal desktop;
                # the output is still substantially smaller than the source files.
                image.save(destination, "WEBP", quality=args.quality, method=4)
                width, height = image.size
        except Exception as error:  # keep the batch moving, report at the end
            return "", None, f"{source_path}: {error}"

        score = float(row.get("scor_final") or 0)
        return school["siiirCode"], {
            "siiirCode": school["siiirCode"],
            "imageUrl": f"/school-images/{school['siiirCode']}.webp",
            "source": "school-site",
            "sourceUrl": row.get("sursa_url") or "",
            "author": "Site public al unității de învățământ",
            "license": "Sursă publică — drepturile de reutilizare trebuie verificate",
            "licenseUrl": row.get("sursa_url") or "",
            "alt": f"Clădirea și spațiul educațional al {school['name']}",
            "distanceMeters": 0,
            "confidence": round(score, 4),
            "verifiedBy": "local-clip",
            "reviewStatus": row["decizie"],
            "verifiedAt": datetime.now(timezone.utc).isoformat(),
            "width": width,
            "height": height,
        }, None

    imported: dict[str, dict[str, object]] = {}
    missing: list[str] = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        for code, item, error in executor.map(process, selected):
            if error:
                missing.append(error)
            elif code and item:
                imported[code] = item

    OUTPUT_PATH.write_text(
        json.dumps(imported, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Importate: {len(imported)} / {len(selected)}")
    print(f"Automat: {sum(1 for item in imported.values() if item['reviewStatus'] == 'acceptata_automat')}")
    print(f"Manual: {sum(1 for item in imported.values() if item['reviewStatus'] == 'revizuire_manuala')}")
    print(f"Manifest: {OUTPUT_PATH}")
    if missing:
        print(f"Neimportate: {len(missing)}")
        for item in missing[:20]:
            print(f"  - {item}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
