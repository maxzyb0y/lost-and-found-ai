"""Google Gemini integration: image analysis and natural-language search parsing.

Both functions degrade gracefully when no API key is configured (or the call
fails) so the application remains fully demonstrable offline. The fallbacks use
simple heuristics rather than a real model.
"""
import json
import re

from ..config import settings

CATEGORIES = ["Electronics", "Bags", "Keys", "Bottles", "Stationery", "Clothing", "Other"]

_ANALYSIS_PROMPT = (
    "You are the cataloguing assistant for a lost & found app. Look at the image of a "
    "found object and return STRICT JSON (no markdown) with exactly these keys:\n"
    '{\n'
    '  "object_name": string,            // short human name, e.g. "Water Bottle"\n'
    '  "category": string,               // one of: ' + ", ".join(CATEGORIES) + "\n"
    '  "color": string,                  // dominant color, e.g. "Silver"\n'
    '  "brand": string | null,           // brand if visibly identifiable, else null\n'
    '  "features": string[],             // distinguishing marks, e.g. ["Blue sticker", "Small dent"]\n'
    '  "confidence_score": number        // 0-100, your confidence in the identification\n'
    "}\n"
    "Pick the closest category from the allowed list. Respond with JSON only."
)

_SEARCH_PROMPT = (
    "Extract structured search filters from a person's lost & found query. "
    "Return STRICT JSON (no markdown) with exactly these keys, using null when unknown:\n"
    '{ "object": string|null, "color": string|null, "location": string|null, "category": string|null }\n'
    "category must be one of: " + ", ".join(CATEGORIES) + " (or null).\n"
    "Query: "
)


# --------------------------------------------------------------------------- #
# Public API
# --------------------------------------------------------------------------- #
def analyze_image(data: bytes, mime_type: str) -> dict:
    """Return AI metadata for an item photo."""
    if not settings.ai_enabled:
        return _stub_analysis()
    try:
        raw = _gemini_image_json(data, mime_type)
        return _normalize_analysis(raw)
    except Exception as exc:  # noqa: BLE001 - never break upload on AI failure
        return _stub_analysis(note=f"AI analysis unavailable ({exc.__class__.__name__})")


def extract_search_filters(query: str) -> dict:
    """Return {object, color, location, category} extracted from a search query."""
    if not settings.ai_enabled:
        return _heuristic_filters(query)
    try:
        raw = _gemini_text_json(_SEARCH_PROMPT + query)
        return {
            "object": _clean(raw.get("object")),
            "color": _clean(raw.get("color")),
            "location": _clean(raw.get("location")),
            "category": _match_category(raw.get("category")),
        }
    except Exception:  # noqa: BLE001
        return _heuristic_filters(query)


# --------------------------------------------------------------------------- #
# Gemini calls
# --------------------------------------------------------------------------- #
def _client():
    from google import genai  # imported lazily

    return genai.Client(api_key=settings.gemini_api_key)


def _gemini_image_json(data: bytes, mime_type: str) -> dict:
    from google.genai import types

    response = _client().models.generate_content(
        model=settings.gemini_model,
        contents=[
            types.Part.from_bytes(data=data, mime_type=mime_type),
            _ANALYSIS_PROMPT,
        ],
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )
    return _loads(response.text)


def _gemini_text_json(prompt: str) -> dict:
    from google.genai import types

    response = _client().models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )
    return _loads(response.text)


# --------------------------------------------------------------------------- #
# Normalization helpers
# --------------------------------------------------------------------------- #
def _loads(text: str | None) -> dict:
    if not text:
        raise ValueError("empty model response")
    text = text.strip()
    # strip ```json fences if the model added them
    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\n?|\n?```$", "", text).strip()
    data = json.loads(text)
    if not isinstance(data, dict):
        raise ValueError("model did not return a JSON object")
    return data


def _normalize_analysis(raw: dict) -> dict:
    features = raw.get("features") or []
    if isinstance(features, str):
        features = [features]
    try:
        confidence = float(raw.get("confidence_score"))
    except (TypeError, ValueError):
        confidence = None
    if confidence is not None:
        confidence = max(0.0, min(100.0, confidence))
    return {
        "object_name": _clean(raw.get("object_name")) or "Unknown item",
        "category": _match_category(raw.get("category")) or "Other",
        "color": _clean(raw.get("color")),
        "brand": _clean(raw.get("brand")),
        "features": [str(f).strip() for f in features if str(f).strip()],
        "confidence_score": confidence,
    }


def _clean(value: object) -> str | None:
    if value is None:
        return None
    text = str(value).strip()
    if not text or text.lower() in ("null", "none", "n/a", "unknown"):
        return None
    return text


def _match_category(value: object) -> str | None:
    text = _clean(value)
    if not text:
        return None
    for cat in CATEGORIES:
        if cat.lower() == text.lower():
            return cat
    return text  # keep model's value if it's outside the canonical list


# --------------------------------------------------------------------------- #
# Offline fallbacks (no API key)
# --------------------------------------------------------------------------- #
def _stub_analysis(note: str | None = None) -> dict:
    features = ["AI analysis disabled — add GEMINI_API_KEY to enable"]
    if note:
        features = [note]
    return {
        "object_name": "Unidentified item",
        "category": "Other",
        "color": None,
        "brand": None,
        "features": features,
        "confidence_score": 0.0,
    }


_COLORS = [
    "black", "white", "gray", "grey", "silver", "gold", "red", "orange", "yellow",
    "green", "blue", "navy", "purple", "pink", "brown", "beige", "tan", "teal",
]

_CATEGORY_KEYWORDS = {
    "Electronics": ["phone", "iphone", "laptop", "charger", "earbud", "earbuds", "airpods",
                    "headphone", "headphones", "tablet", "camera", "watch", "mouse", "keyboard"],
    "Bags": ["bag", "backpack", "handbag", "purse", "tote", "luggage", "suitcase", "wallet"],
    "Keys": ["key", "keys", "keychain", "fob"],
    "Bottles": ["bottle", "flask", "tumbler", "thermos", "hydro"],
    "Stationery": ["pen", "pencil", "notebook", "stationery", "folder", "book", "calculator"],
    "Clothing": ["jacket", "coat", "shirt", "hoodie", "sweater", "scarf", "glove", "gloves",
                 "hat", "cap", "umbrella", "clothing"],
}


def _heuristic_filters(query: str) -> dict:
    text = query.lower()
    color = next((c for c in _COLORS if re.search(rf"\b{c}\b", text)), None)

    obj = None
    category = None
    for cat, words in _CATEGORY_KEYWORDS.items():
        for word in words:
            if re.search(rf"\b{re.escape(word)}\b", text):
                obj = obj or word
                category = category or cat
                break
        if category:
            break

    location = None
    loc_match = re.search(r"\b(?:near|at|in|by|around)\s+(?:the\s+)?([a-z][a-z\s]{1,30})", text)
    if loc_match:
        location = loc_match.group(1).strip().split(",")[0].strip() or None

    return {
        "object": obj,
        "color": color,
        "location": location,
        "category": category,
    }
