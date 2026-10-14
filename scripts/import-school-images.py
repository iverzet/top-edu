#!/usr/bin/env python3
"""Find freely reusable school photos and verify them with DeepSeek Vision.

Sources:
  * Wikimedia Commons (works without a source token)
  * KartaView/OpenStreetCam (works without a source token)
  * Panoramax federated catalog (works without a source token)
  * Mapillary (optional, requires MAPILLARY_ACCESS_TOKEN)

The script never writes secrets. It stores only accepted image metadata in
src/data/school-images.json. Run small batches first and inspect the output.
"""

from __future__ import annotations

import argparse
import base64
import html
import json
import math
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SCHOOLS_PATH = ROOT / "src" / "data" / "schools.json"
ENRICHMENT_PATH = ROOT / "src" / "data" / "school-enrichment.json"
OUTPUT_PATH = ROOT / "src" / "data" / "school-images.json"
ATTEMPTS_PATH = ROOT / "src" / "data" / "school-image-attempts.json"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
DEEPSEEK_API = "https://api.deepseek.com/chat/completions"
DEEPSEEK_BALANCE_API = "https://api.deepseek.com/user/balance"
MAPILLARY_API = "https://graph.mapillary.com/images"
KARTAVIEW_API = "https://api.openstreetcam.org/1.0/list/nearby-photos/"
PANORAMAX_API = "https://api.panoramax.xyz/api/search"
ALLOWED_LICENSES = ("cc0", "public domain", "cc by", "cc-by", "cc by-sa", "cc-by-sa")
DEFAULT_HEADERS = {
    "Accept": "application/json",
    "User-Agent": "TopEduSchoolImageIndexer/1.0 (https://www.top-edu.ro; contact: admin@top-edu.ro)",
}
GENERIC_SCHOOL_WORDS = {
    "scoala", "gimnaziala", "liceul", "colegiul", "national", "nationala",
    "tehnologic", "tehnologica", "gradinita", "program", "normal", "prelungit",
    "centrul", "judetean", "educatie", "incluziva", "unitatea", "invatamant",
}


def request_json(url: str, *, headers: dict[str, str] | None = None, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    data = None if payload is None else json.dumps(payload).encode("utf-8")
    request_headers = {**DEFAULT_HEADERS, **(headers or {})}
    request = urllib.request.Request(url, data=data, headers=request_headers)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {error.code}: {body[:800]}") from error


def request_form_json(url: str, fields: dict[str, Any]) -> dict[str, Any]:
    data = urllib.parse.urlencode(fields).encode("utf-8")
    headers = {**DEFAULT_HEADERS, "Content-Type": "application/x-www-form-urlencoded"}
    request = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"HTTP {error.code}: {body[:800]}") from error


def strip_html(value: str | None) -> str:
    if not value:
        return ""
    return html.unescape(re.sub(r"<[^>]+>", "", value)).strip()


def normalized_words(value: str) -> set[str]:
    decomposed = unicodedata.normalize("NFD", value.lower())
    plain = "".join(char for char in decomposed if unicodedata.category(char) != "Mn")
    return {word for word in re.findall(r"[a-z0-9]+", plain) if len(word) >= 3}


def select_diverse_candidates(candidates: list[dict[str, Any]], limit: int) -> list[dict[str, Any]]:
    """Prefer name evidence, then avoid paying to inspect near-identical frames."""
    ordered = sorted(
        candidates,
        key=lambda item: (not bool(item.get("exactNameEvidence")), item["distanceMeters"]),
    )
    selected: list[dict[str, Any]] = []
    used_sources: set[str] = set()
    for candidate in ordered:
        if candidate["source"] in used_sources:
            continue
        selected.append(candidate)
        used_sources.add(candidate["source"])
        if len(selected) == limit:
            return selected
    for candidate in ordered:
        if candidate not in selected:
            selected.append(candidate)
            if len(selected) == limit:
                break
    return selected


def has_exact_name_evidence(school: dict[str, Any], title: str) -> bool:
    school_words = normalized_words(school["name"]) - GENERIC_SCHOOL_WORDS
    title_words = normalized_words(title)
    city_words = normalized_words(school["city"])
    if not school_words:
        return False
    required = 1 if len(school_words) == 1 else 2
    return len(school_words & title_words) >= required and bool(city_words & title_words)


def image_data_url(url: str) -> str:
    request = urllib.request.Request(url, headers=DEFAULT_HEADERS)
    with urllib.request.urlopen(request, timeout=60) as response:
        data = response.read(12 * 1024 * 1024 + 1)
        if len(data) > 12 * 1024 * 1024:
            raise RuntimeError("Imaginea candidată depășește limita locală de 12 MiB")
        content_type = response.headers.get_content_type()
    if content_type not in {"image/jpeg", "image/png", "image/gif", "image/webp"}:
        raise RuntimeError(f"Format de imagine nesuportat: {content_type}")
    encoded = base64.b64encode(data).decode("ascii")
    return f"data:{content_type};base64,{encoded}"


def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6_371_000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    return radius * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def bearing_degrees(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_lambda = math.radians(lon2 - lon1)
    y = math.sin(delta_lambda) * math.cos(phi2)
    x = math.cos(phi1) * math.sin(phi2) - math.sin(phi1) * math.cos(phi2) * math.cos(delta_lambda)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


def angle_difference(first: float, second: float) -> float:
    return abs((first - second + 180) % 360 - 180)


def commons_candidates(lat: float, lon: float, radius: int, limit: int) -> list[dict[str, Any]]:
    query = urllib.parse.urlencode({
        "action": "query",
        "format": "json",
        "generator": "geosearch",
        "ggsprimary": "all",
        "ggsnamespace": 6,
        "ggsradius": min(radius, 10_000),
        "ggscoord": f"{lat}|{lon}",
        "ggslimit": limit,
        "prop": "imageinfo|coordinates",
        "iiprop": "url|extmetadata",
        "iiurlwidth": 1600,
        "colimit": "max",
        "origin": "*",
    })
    response = request_json(f"{COMMONS_API}?{query}")
    candidates: list[dict[str, Any]] = []
    for page in response.get("query", {}).get("pages", {}).values():
        info = (page.get("imageinfo") or [{}])[0]
        metadata = info.get("extmetadata", {})
        license_name = strip_html(metadata.get("LicenseShortName", {}).get("value"))
        normalized_license = license_name.lower()
        if not any(item in normalized_license for item in ALLOWED_LICENSES):
            continue
        coordinates = (page.get("coordinates") or [{}])[0]
        image_lat = float(coordinates.get("lat", lat))
        image_lon = float(coordinates.get("lon", lon))
        candidates.append({
            "source": "wikimedia",
            "imageUrl": info.get("thumburl") or info.get("url"),
            "sourceUrl": info.get("descriptionurl") or f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(page['title'])}",
            "author": strip_html(metadata.get("Artist", {}).get("value")) or "Contribuitor Wikimedia Commons",
            "license": license_name,
            "licenseUrl": strip_html(metadata.get("LicenseUrl", {}).get("value")),
            "distanceMeters": round(haversine_meters(lat, lon, image_lat, image_lon)),
            "title": page.get("title", ""),
            "exactNameEvidence": False,
        })
    return sorted(candidates, key=lambda item: item["distanceMeters"])


def commons_name_candidates(school: dict[str, Any], lat: float, lon: float, limit: int) -> list[dict[str, Any]]:
    search_text = f'"{school["name"]}" {school["city"]}'
    query = urllib.parse.urlencode({
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": search_text,
        "gsrnamespace": 6,
        "gsrlimit": min(max(limit * 3, 6), 20),
        "prop": "imageinfo|coordinates",
        "iiprop": "url|extmetadata",
        "iiurlwidth": 1600,
        "colimit": "max",
        "origin": "*",
    })
    response = request_json(f"{COMMONS_API}?{query}")
    candidates: list[dict[str, Any]] = []
    for page in response.get("query", {}).get("pages", {}).values():
        title = page.get("title", "")
        if not has_exact_name_evidence(school, title):
            continue
        info = (page.get("imageinfo") or [{}])[0]
        metadata = info.get("extmetadata", {})
        license_name = strip_html(metadata.get("LicenseShortName", {}).get("value"))
        if not any(item in license_name.lower() for item in ALLOWED_LICENSES):
            continue
        coordinates = (page.get("coordinates") or [{}])[0]
        image_lat = float(coordinates.get("lat", lat))
        image_lon = float(coordinates.get("lon", lon))
        candidates.append({
            "source": "wikimedia",
            "imageUrl": info.get("thumburl") or info.get("url"),
            "sourceUrl": info.get("descriptionurl") or f"https://commons.wikimedia.org/wiki/{urllib.parse.quote(title)}",
            "author": strip_html(metadata.get("Artist", {}).get("value")) or "Contribuitor Wikimedia Commons",
            "license": license_name,
            "licenseUrl": strip_html(metadata.get("LicenseUrl", {}).get("value")),
            "distanceMeters": round(haversine_meters(lat, lon, image_lat, image_lon)),
            "title": title,
            "exactNameEvidence": True,
        })
    return sorted(candidates, key=lambda item: item["distanceMeters"])[:limit]


def mapillary_candidates(lat: float, lon: float, radius: int, limit: int, token: str) -> list[dict[str, Any]]:
    latitude_delta = radius / 111_320
    longitude_delta = radius / max(1, 111_320 * math.cos(math.radians(lat)))
    bbox = f"{lon - longitude_delta},{lat - latitude_delta},{lon + longitude_delta},{lat + latitude_delta}"
    query = urllib.parse.urlencode({
        "access_token": token,
        "bbox": bbox,
        "fields": "id,thumb_1024_url,computed_geometry,computed_compass_angle,camera_type,captured_at,creator,quality_score",
        "image_type": "flat",
        "limit": limit,
    })
    response = request_json(f"{MAPILLARY_API}?{query}")
    candidates: list[dict[str, Any]] = []
    for item in response.get("data", []):
        coordinates = item.get("computed_geometry", {}).get("coordinates", [lon, lat])
        creator = item.get("creator") or {}
        image_id = str(item.get("id", ""))
        image_url = item.get("thumb_1024_url")
        if not image_id or not image_url:
            continue
        image_lat = float(coordinates[1])
        image_lon = float(coordinates[0])
        compass_angle = item.get("computed_compass_angle")
        view_angle = None
        if compass_angle is not None:
            target_bearing = bearing_degrees(image_lat, image_lon, lat, lon)
            view_angle = round(angle_difference(float(compass_angle), target_bearing), 1)
        distance = round(haversine_meters(lat, lon, image_lat, image_lon))
        camera_type = str(item.get("camera_type") or "").lower()
        if distance > radius or (view_angle is not None and camera_type not in {"spherical", "fisheye"} and view_angle > 75):
            continue
        candidates.append({
            "source": "mapillary",
            "imageUrl": image_url,
            "sourceUrl": f"https://www.mapillary.com/app/?pKey={image_id}",
            "author": creator.get("username") or creator.get("name") or "Contribuitor Mapillary",
            "license": "CC BY-SA",
            "licenseUrl": "https://help.mapillary.com/hc/en-us/articles/115001770409-CC-BY-SA-license-for-open-data",
            "distanceMeters": distance,
            "title": f"Mapillary {image_id}",
            "mapillaryImageId": image_id,
            "qualityScore": item.get("quality_score"),
            "cameraType": camera_type,
            **({"viewAngleDifference": view_angle} if view_angle is not None else {}),
            "exactNameEvidence": False,
        })
    return sorted(candidates, key=lambda item: (
        item.get("viewAngleDifference", 181),
        -float(item.get("qualityScore") or 0),
        item["distanceMeters"],
    ))


def kartaview_candidates(lat: float, lon: float, radius: int, limit: int) -> list[dict[str, Any]]:
    response = request_form_json(KARTAVIEW_API, {
        "lat": f"{lat:.7f}",
        "lng": f"{lon:.7f}",
        "radius": min(radius, 2_000),
    })
    status = response.get("status") or {}
    if str(status.get("apiCode")) != "600":
        raise RuntimeError(f"KartaView: {status.get('apiMessage') or 'răspuns necunoscut'}")
    candidates: list[dict[str, Any]] = []
    for item in response.get("currentPageItems") or []:
        image_id = str(item.get("id") or "")
        relative_path = str(item.get("lth_name") or item.get("th_name") or item.get("name") or "").lstrip("/")
        if not image_id or "/" not in relative_path:
            continue
        storage_host, image_path = relative_path.split("/", 1)
        image_url = f"https://{storage_host}.openstreetcam.org/{image_path}"
        image_lat = float(item.get("lat") or lat)
        image_lon = float(item.get("lng") or lon)
        heading = float(item.get("heading") or 0)
        target_bearing = bearing_degrees(image_lat, image_lon, lat, lon)
        sequence_id = str(item.get("sequence_id") or "")
        sequence_index = str(item.get("sequence_index") or "0")
        distance = round(haversine_meters(lat, lon, image_lat, image_lon))
        if distance > radius:
            continue
        candidates.append({
            "source": "kartaview",
            "imageUrl": image_url,
            "sourceUrl": f"https://kartaview.org/details/{sequence_id}/{sequence_index}/track-info",
            "author": item.get("username") or "Contribuitor KartaView",
            "license": "CC BY-SA 4.0",
            "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
            "distanceMeters": distance,
            "title": f"KartaView {image_id}",
            "capturedAt": item.get("shot_date"),
            "kartaviewImageId": image_id,
            "viewAngleDifference": round(angle_difference(heading, target_bearing), 1),
            "exactNameEvidence": False,
        })
    return sorted(candidates, key=lambda item: (item["viewAngleDifference"], item["distanceMeters"]))[:limit]


def panoramax_candidates(lat: float, lon: float, radius: int, limit: int) -> list[dict[str, Any]]:
    latitude_delta = radius / 111_320
    longitude_delta = radius / max(1, 111_320 * math.cos(math.radians(lat)))
    bbox = f"{lon - longitude_delta},{lat - latitude_delta},{lon + longitude_delta},{lat + latitude_delta}"
    query = urllib.parse.urlencode({"bbox": bbox, "limit": min(max(limit * 4, 8), 30)})
    response = request_json(f"{PANORAMAX_API}?{query}")
    candidates: list[dict[str, Any]] = []
    for item in response.get("features") or []:
        image_id = str(item.get("id") or "")
        geometry = item.get("geometry") or {}
        coordinates = geometry.get("coordinates") or [lon, lat]
        assets = item.get("assets") or {}
        image_url = (assets.get("thumb") or assets.get("sd") or {}).get("href")
        properties = item.get("properties") or {}
        license_name = str(properties.get("license") or "")
        if not image_id or not image_url or license_name not in {"CC-BY-SA-4.0", "etalab-2.0"}:
            continue
        provider = next(iter(item.get("providers") or []), {})
        azimuth = properties.get("view:azimuth")
        view_angle = None
        if azimuth is not None:
            target_bearing = bearing_degrees(float(coordinates[1]), float(coordinates[0]), lat, lon)
            view_angle = round(angle_difference(float(azimuth), target_bearing), 1)
        distance = round(haversine_meters(lat, lon, float(coordinates[1]), float(coordinates[0])))
        if distance > radius:
            continue
        source_url = next((link.get("href") for link in item.get("links") or [] if link.get("rel") == "self"), "")
        license_url = next((link.get("href") for link in item.get("links") or [] if link.get("rel") == "license"), "")
        candidates.append({
            "source": "panoramax",
            "imageUrl": image_url,
            "sourceUrl": source_url or f"https://api.panoramax.xyz/api/search?ids={image_id}",
            "author": provider.get("name") or properties.get("geovisio:producer") or "Contribuitor Panoramax",
            "license": license_name,
            "licenseUrl": license_url,
            "distanceMeters": distance,
            "title": f"Panoramax {image_id}",
            "capturedAt": properties.get("datetime"),
            "panoramaxImageId": image_id,
            **({"viewAngleDifference": view_angle} if view_angle is not None else {}),
            "exactNameEvidence": False,
        })
    return sorted(candidates, key=lambda item: (item.get("viewAngleDifference", 181), item["distanceMeters"]))[:limit]


def verify_candidates(school: dict[str, Any], candidates: list[dict[str, Any]], api_key: str) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    usable: list[dict[str, Any]] = []
    image_blocks: list[dict[str, Any]] = []
    for candidate in candidates:
        try:
            inline_image = image_data_url(candidate["imageUrl"])
        except Exception as error:
            print(f"  imagine indisponibilă ({candidate['source']}): {error}")
            continue
        usable.append(candidate)
        image_blocks.append({"type": "image_url", "image_url": {"url": inline_image, "detail": "low"}})
    if not usable:
        raise RuntimeError("Nicio imagine candidată nu a putut fi descărcată")
    candidate_lines = "\n".join(
        f"{index}. {candidate['source']}, {candidate['distanceMeters']} m, diferență unghi cameră: {candidate.get('viewAngleDifference', 'necunoscut')}°, titlu: {candidate.get('title') or '-'}, potrivire nominală metadate: {bool(candidate.get('exactNameEvidence'))}"
        for index, candidate in enumerate(usable, start=1)
    )
    prompt = f"""Alege cel mult o fotografie pentru profilul școlii.
Școală: {school['name']}; localitate: {school['city']}; județ: {school['county']}; adresă: {school.get('address') or '-'}.
Candidați, în aceeași ordine ca imaginile:
{candidate_lines}

Respinge strada, locuințele, muzeele, universitățile sau alte clădiri. Nu identifica persoane. privacySafe=false dacă minorii identificabili sunt subiectul principal. Proximitatea singură nu dovedește identitatea. matchesTarget=true doar dacă există nume/indicator vizibil sau dovezi arhitecturale distinctive foarte puternice împreună cu distanță <=25 m. selectedIndex este 1..{len(usable)}, ori 0 dacă niciuna nu este sigură.
Răspunde numai JSON: selectedIndex, isSchoolExterior, matchesTarget, privacySafe, distinctiveEvidence, confidence (0..1), visibleSchoolName, reason, alt.
"""
    payload = {
        "model": "deepseek-flash",
        "thinking": {"type": "disabled"},
        "response_format": {"type": "json_object"},
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                *image_blocks,
            ],
        }],
        "temperature": 0,
        "max_tokens": 220,
    }
    response = request_json(DEEPSEEK_API, headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }, payload=payload)
    content = response["choices"][0]["message"]["content"].strip()
    content = re.sub(r"^```(?:json)?\s*|\s*```$", "", content, flags=re.IGNORECASE)
    return json.loads(content), usable


def accepted(verification: dict[str, Any], candidate: dict[str, Any], minimum: float) -> bool:
    confidence = float(verification.get("confidence", 0))
    direct_evidence = bool(
        str(verification.get("visibleSchoolName") or "").strip()
        or candidate.get("exactNameEvidence")
    )
    strong_location_evidence = bool(
        candidate["source"] in {"kartaview", "panoramax", "mapillary"}
        and candidate["distanceMeters"] <= 25
        and verification.get("distinctiveEvidence")
        and confidence >= 0.98
    )
    return bool(
        verification.get("isSchoolExterior")
        and verification.get("matchesTarget")
        and verification.get("privacySafe")
        and (direct_evidence or strong_location_evidence)
        and confidence >= minimum
    )


def deepseek_balance(api_key: str) -> float:
    response = request_json(DEEPSEEK_BALANCE_API, headers={"Authorization": f"Bearer {api_key}"})
    balances = response.get("balance_infos") or []
    usd = next((item for item in balances if item.get("currency") == "USD"), None)
    return float((usd or (balances[0] if balances else {})).get("total_balance") or 0)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--limit", type=int, default=25, help="Maximum schools to process in this run")
    parser.add_argument("--offset", type=int, default=0)
    parser.add_argument("--radius", type=int, default=180, help="Search radius in metres")
    parser.add_argument("--candidates", type=int, default=3, help="Maximum candidates per source")
    parser.add_argument("--batch-images", type=int, default=2, choices=(1, 2), help="Images sent in one verification call")
    parser.add_argument("--min-confidence", type=float, default=0.92)
    parser.add_argument("--source", choices=("all", "both", "wikimedia", "kartaview", "panoramax", "mapillary"), default="all")
    parser.add_argument("--min-balance", type=float, default=0.50, help="Hard stop before balance falls below this USD value")
    parser.add_argument("--check-balance-every", type=int, default=100)
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    return parser.parse_args()


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    args = parse_args()
    deepseek_key = os.environ.get("DEEPSEEK_API_KEY", "").strip()
    mapillary_token = os.environ.get("MAPILLARY_ACCESS_TOKEN", "").strip()
    if not deepseek_key:
        print("Lipsește DEEPSEEK_API_KEY. Setează cheia numai în mediul local.", file=sys.stderr)
        return 2
    if args.source in ("all", "both", "mapillary") and not mapillary_token:
        if args.source == "mapillary":
            print("Lipsește MAPILLARY_ACCESS_TOKEN.", file=sys.stderr)
            return 2
        print("MAPILLARY_ACCESS_TOKEN lipsește; rulez Wikimedia Commons, KartaView și Panoramax.")

    starting_balance = deepseek_balance(deepseek_key)
    print(f"Sold DeepSeek la pornire: {starting_balance:.2f} USD; oprire la {args.min_balance:.2f} USD.")
    if starting_balance <= args.min_balance:
        print("Soldul disponibil a ajuns la limita de siguranță.", file=sys.stderr)
        return 3

    schools = json.loads(SCHOOLS_PATH.read_text(encoding="utf-8-sig"))
    enrichment = json.loads(ENRICHMENT_PATH.read_text(encoding="utf-8-sig"))
    coordinates = {
        item["siiirCode"]: item.get("coordinates")
        for item in enrichment
        if item.get("coordinates")
    }
    existing: dict[str, Any] = json.loads(OUTPUT_PATH.read_text(encoding="utf-8-sig")) if OUTPUT_PATH.exists() else {}
    attempts: dict[str, Any] = json.loads(ATTEMPTS_PATH.read_text(encoding="utf-8-sig")) if ATTEMPTS_PATH.exists() else {}
    queue = [school for school in schools if coordinates.get(school["siiirCode"])]
    queue = queue[args.offset: args.offset + args.limit]

    processed = accepted_count = candidate_count = 0
    for school in queue:
        code = school["siiirCode"]
        if code in existing and not args.overwrite:
            continue
        if code in attempts and not args.overwrite:
            continue
        if processed and processed % max(1, args.check_balance_every) == 0:
            current_balance = deepseek_balance(deepseek_key)
            print(f"Sold după {processed} școli: {current_balance:.2f} USD")
            if current_balance <= args.min_balance:
                print("Oprire automată: limita de siguranță a soldului a fost atinsă.")
                break
        point = coordinates[code]
        lat, lon = float(point["latitude"]), float(point["longitude"])
        candidates: list[dict[str, Any]] = []
        selected_sources = {"wikimedia", "kartaview", "panoramax", "mapillary"} if args.source in {"all", "both"} else {args.source}
        source_loaders: list[tuple[str, Any]] = []
        if "wikimedia" in selected_sources:
            source_loaders.extend([
                ("wikimedia-name", lambda: commons_name_candidates(school, lat, lon, args.candidates)),
                ("wikimedia-geo", lambda: commons_candidates(lat, lon, args.radius, args.candidates)),
            ])
        if "kartaview" in selected_sources:
            source_loaders.append(("kartaview", lambda: kartaview_candidates(lat, lon, args.radius, args.candidates)))
        if "panoramax" in selected_sources:
            source_loaders.append(("panoramax", lambda: panoramax_candidates(lat, lon, args.radius, args.candidates)))
        if "mapillary" in selected_sources and mapillary_token:
            source_loaders.append(("mapillary", lambda: mapillary_candidates(lat, lon, args.radius, args.candidates, mapillary_token)))
        for source_name, loader in source_loaders:
            try:
                candidates.extend(loader())
            except Exception as error:
                print(f"[{code}] eroare {source_name}: {error}")

        deduplicated: dict[str, dict[str, Any]] = {candidate["imageUrl"]: candidate for candidate in candidates if candidate.get("imageUrl")}
        candidates = select_diverse_candidates(list(deduplicated.values()), args.batch_images)

        processed += 1
        print(f"[{code}] {school['name']}: {len(candidates)} candidate")
        attempts[code] = {
            "attemptedAt": datetime.now(timezone.utc).isoformat(),
            "candidateCount": len(candidates),
            "status": "no-candidate" if not candidates else "rejected",
        }
        if candidates:
            candidate_count += len(candidates)
            try:
                verification, usable_candidates = verify_candidates(school, candidates, deepseek_key)
            except Exception as error:
                print(f"  verificare eșuată: {error}")
                attempts[code]["status"] = "error"
                attempts[code]["error"] = str(error)[:300]
            else:
                selected_index = int(verification.get("selectedIndex") or 0)
                confidence = float(verification.get("confidence", 0))
                print(f"  selecție {selected_index}/{len(usable_candidates)} · scor {confidence:.2f} · {verification.get('reason', '')}")
                if 1 <= selected_index <= len(usable_candidates):
                    candidate = usable_candidates[selected_index - 1]
                    if accepted(verification, candidate, args.min_confidence):
                        accepted_count += 1
                        attempts[code]["status"] = "accepted"
                        image_url = candidate["imageUrl"]
                        if candidate["source"] == "mapillary":
                            image_url = f"/api/school-photo/{code}"
                        existing[code] = {
                            "siiirCode": code,
                            "imageUrl": image_url,
                            "source": candidate["source"],
                            "sourceUrl": candidate["sourceUrl"],
                            "author": candidate["author"],
                            "license": candidate["license"],
                            "licenseUrl": candidate.get("licenseUrl"),
                            "alt": verification.get("alt") or f"Clădirea {school['name']}",
                            "distanceMeters": candidate["distanceMeters"],
                            "confidence": round(confidence, 3),
                            "verifiedBy": "deepseek-flash",
                            "verifiedAt": datetime.now(timezone.utc).isoformat(),
                            **({"mapillaryImageId": candidate["mapillaryImageId"]} if candidate.get("mapillaryImageId") else {}),
                            **({"kartaviewImageId": candidate["kartaviewImageId"]} if candidate.get("kartaviewImageId") else {}),
                            **({"panoramaxImageId": candidate["panoramaxImageId"]} if candidate.get("panoramaxImageId") else {}),
                        }

    if not args.dry_run:
        OUTPUT_PATH.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        ATTEMPTS_PATH.write_text(json.dumps(attempts, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    ending_balance = deepseek_balance(deepseek_key)
    print(f"Sold DeepSeek la final: {ending_balance:.2f} USD; consum afișat: {starting_balance - ending_balance:.2f} USD")
    print(f"Procesate: {processed}; candidate verificate: {candidate_count}; fotografii acceptate: {accepted_count}; total registru: {len(existing)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
