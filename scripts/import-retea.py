"""Import the official Ministry of Education school network workbook into JSON."""
import json
import re
import unicodedata
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / "reteaua-scolara-2025-2026.xlsx"
target = ROOT / "src" / "data" / "schools.json"
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "unitate-de-invatamant"

def text_cell(cell, shared):
    value = cell.find("m:v", NS)
    if value is None or value.text is None:
        return ""
    return shared[int(value.text)] if cell.attrib.get("t") == "s" else value.text

with zipfile.ZipFile(source) as book:
    shared_root = ET.fromstring(book.read("xl/sharedStrings.xml"))
    shared = ["".join(t.text or "" for t in item.findall(".//m:t", NS)) for item in shared_root.findall("m:si", NS)]
    sheet = ET.fromstring(book.read("xl/worksheets/sheet1.xml"))
    rows = sheet.findall(".//m:sheetData/m:row", NS)

headers = [text_cell(c, shared).strip() for c in rows[1].findall("m:c", NS)]
records = []
seen = set()
for row in rows[2:]:
    values = [text_cell(c, shared).replace("\n", " ").strip() for c in row.findall("m:c", NS)]
    if len(values) < len(headers):
        values += [""] * (len(headers) - len(values))
    item = dict(zip(headers, values))
    code = item.get("Cod SIIIR unitate") or item.get("Cod SIIIR PJ")
    name = item.get("Denumire lunga unitate") or item.get("Denumire scurta unitate") or item.get("Denumire PJ")
    if not name or not code or code in seen:
        continue
    seen.add(code)
    city = item.get("Localitate unitate") or item.get("Localitate PJ")
    county = item.get("Judet PJ")
    ownership = "Privată" if "privat" in item.get("Forma proprietate", "").lower() or "particular" in item.get("Forma proprietate", "").lower() else "Publică"
    records.append({
        "slug": f"{slugify(name)}-{code[-6:]}",
        "name": name,
        "city": city,
        "county": county,
        "type": item.get("Tip unitate") or "Unitate de învățământ",
        "ownership": ownership,
        "levels": "Preuniversitar",
        "image": "/school-placeholder.svg",
        "description": "Înregistrare importată din rețeaua școlară oficială 2025–2026. Datele sunt prezentate cu sursa și data importului.",
        "source": "Ministerul Educației — Rețeaua școlară 2025–2026 (data.gov.ro)",
        "siiirCode": code,
        "status": item.get("Statut unitate"),
        "address": " ".join(filter(None, [item.get("Strada"), item.get("Numar"), item.get("Cod postal")])),
        "phone": item.get("Telefon"),
        "email": item.get("Email"),
    })

target.parent.mkdir(parents=True, exist_ok=True)
target.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Imported {len(records)} schools to {target}")
