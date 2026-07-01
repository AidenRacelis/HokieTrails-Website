"""Virginia hiking trail catalog service.

Endpoints (prefixed with ``/api/trails``):

* ``GET  /``              - list/filter trails
* ``GET  /<id>``          - fetch a single trail
* ``GET  /towns``         - list distinct towns
* ``POST /``              - create a trail (admin/seed use)
* ``PUT  /<id>``          - update a trail
* ``DELETE /<id>``        - delete a trail

Query parameters for the list endpoint:
    ``q`` (search name/town/description), ``difficulty`` (easy|medium|hard),
    ``town``, ``min_rating``, ``max_length``, ``sort`` (rating|length|name),
    ``limit``.
"""

from __future__ import annotations

from flask import Blueprint, current_app, jsonify, request

from ..security import login_required
from ..seed_data import TRAIL_SEED
from ..storage import get_collection

trails_bp = Blueprint("trails", __name__, url_prefix="/api/trails")

DIFFICULTY_ORDER = {"easy": 1, "medium": 2, "hard": 3}


def _trails():
    config = current_app.config["hokietrails_config"]
    collection = get_collection(config.DATA_DIR, "trails")
    collection.seed_if_empty(TRAIL_SEED)
    return collection


def _combined_rating(trail: dict) -> float:
    """Average the Google and AllTrails ratings, weighted by review count."""
    ratings = trail.get("ratings", {})
    total_weight = 0.0
    total_score = 0.0
    for source in ("google", "alltrails"):
        entry = ratings.get(source)
        if entry and entry.get("rating") is not None:
            reviews = max(entry.get("reviews", 0), 1)
            total_score += entry["rating"] * reviews
            total_weight += reviews
    if total_weight == 0:
        return 0.0
    return round(total_score / total_weight, 2)


def _decorate(trail: dict) -> dict:
    """Attach derived fields the frontend finds useful."""
    trail = dict(trail)
    trail["combined_rating"] = _combined_rating(trail)
    return trail


@trails_bp.get("/")
def list_trails():
    trails = [_decorate(t) for t in _trails().all()]

    q = (request.args.get("q") or "").strip().lower()
    difficulty = (request.args.get("difficulty") or "").strip().lower()
    town = (request.args.get("town") or "").strip().lower()
    min_rating = request.args.get("min_rating", type=float)
    max_length = request.args.get("max_length", type=float)
    sort = (request.args.get("sort") or "").strip().lower()
    limit = request.args.get("limit", type=int)

    if q:
        trails = [
            t
            for t in trails
            if q in t.get("name", "").lower()
            or q in t.get("town", "").lower()
            or q in t.get("description", "").lower()
        ]
    if difficulty:
        trails = [t for t in trails if t.get("difficulty", "").lower() == difficulty]
    if town:
        trails = [t for t in trails if t.get("town", "").lower() == town]
    if min_rating is not None:
        trails = [t for t in trails if t.get("combined_rating", 0) >= min_rating]
    if max_length is not None:
        trails = [t for t in trails if t.get("length_miles", 0) <= max_length]

    if sort == "rating":
        trails.sort(key=lambda t: t.get("combined_rating", 0), reverse=True)
    elif sort == "length":
        trails.sort(key=lambda t: t.get("length_miles", 0))
    elif sort == "difficulty":
        trails.sort(key=lambda t: DIFFICULTY_ORDER.get(t.get("difficulty", ""), 0))
    elif sort == "name":
        trails.sort(key=lambda t: t.get("name", "").lower())

    if limit is not None and limit > 0:
        trails = trails[:limit]

    return jsonify({"count": len(trails), "trails": trails})


@trails_bp.get("/towns")
def list_towns():
    towns = sorted({t.get("town") for t in _trails().all() if t.get("town")})
    return jsonify({"towns": towns})


@trails_bp.get("/<trail_id>")
def get_trail(trail_id: str):
    trail = _trails().get(trail_id)
    if not trail:
        return jsonify({"error": "Trail not found."}), 404
    return jsonify({"trail": _decorate(trail)})


@trails_bp.post("/")
@login_required
def create_trail():
    data = request.get_json(silent=True) or {}
    if not data.get("name"):
        return jsonify({"error": "Trail 'name' is required."}), 400
    trail = _trails().insert(data)
    return jsonify({"trail": _decorate(trail)}), 201


@trails_bp.put("/<trail_id>")
@login_required
def update_trail(trail_id: str):
    data = request.get_json(silent=True) or {}
    updated = _trails().update(trail_id, data)
    if not updated:
        return jsonify({"error": "Trail not found."}), 404
    return jsonify({"trail": _decorate(updated)})


@trails_bp.delete("/<trail_id>")
@login_required
def delete_trail(trail_id: str):
    if not _trails().delete(trail_id):
        return jsonify({"error": "Trail not found."}), 404
    return jsonify({"deleted": trail_id})
