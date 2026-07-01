"""Housing service - lodges, cabins, campgrounds and hotels near trails.

Endpoints (prefixed with ``/api/housing``):

* ``GET  /``           - list/filter housing options
* ``GET  /<id>``       - fetch a single housing option
* ``GET  /near/<trail_id>`` - housing options linked to a given trail
* ``POST /``           - create a housing option
* ``PUT  /<id>``       - update a housing option
* ``DELETE /<id>``     - delete a housing option
"""

from __future__ import annotations

from flask import Blueprint, current_app, jsonify, request

from ..security import login_required
from ..seed_data import HOUSING_SEED
from ..storage import get_collection

housing_bp = Blueprint("housing", __name__, url_prefix="/api/housing")


def _housing():
    config = current_app.config["hokietrails_config"]
    collection = get_collection(config.DATA_DIR, "housing")
    collection.seed_if_empty(HOUSING_SEED)
    return collection


@housing_bp.get("/")
def list_housing():
    items = _housing().all()

    q = (request.args.get("q") or "").strip().lower()
    town = (request.args.get("town") or "").strip().lower()
    housing_type = (request.args.get("type") or "").strip().lower()
    max_price = request.args.get("max_price", type=float)
    min_rating = request.args.get("min_rating", type=float)
    sort = (request.args.get("sort") or "").strip().lower()

    if q:
        items = [
            h
            for h in items
            if q in h.get("name", "").lower() or q in h.get("town", "").lower()
        ]
    if town:
        items = [h for h in items if h.get("town", "").lower() == town]
    if housing_type:
        items = [h for h in items if h.get("type", "").lower() == housing_type]
    if max_price is not None:
        items = [h for h in items if h.get("price_per_night", 0) <= max_price]
    if min_rating is not None:
        items = [h for h in items if h.get("rating", 0) >= min_rating]

    if sort == "price":
        items.sort(key=lambda h: h.get("price_per_night", 0))
    elif sort == "rating":
        items.sort(key=lambda h: h.get("rating", 0), reverse=True)
    elif sort == "name":
        items.sort(key=lambda h: h.get("name", "").lower())

    return jsonify({"count": len(items), "housing": items})


@housing_bp.get("/<housing_id>")
def get_housing(housing_id: str):
    item = _housing().get(housing_id)
    if not item:
        return jsonify({"error": "Housing option not found."}), 404
    return jsonify({"housing": item})


@housing_bp.get("/near/<trail_id>")
def housing_near_trail(trail_id: str):
    items = [
        h for h in _housing().all() if trail_id in h.get("nearby_trail_ids", [])
    ]
    return jsonify({"count": len(items), "housing": items})


@housing_bp.post("/")
@login_required
def create_housing():
    data = request.get_json(silent=True) or {}
    if not data.get("name"):
        return jsonify({"error": "Housing 'name' is required."}), 400
    item = _housing().insert(data)
    return jsonify({"housing": item}), 201


@housing_bp.put("/<housing_id>")
@login_required
def update_housing(housing_id: str):
    data = request.get_json(silent=True) or {}
    updated = _housing().update(housing_id, data)
    if not updated:
        return jsonify({"error": "Housing option not found."}), 404
    return jsonify({"housing": updated})


@housing_bp.delete("/<housing_id>")
@login_required
def delete_housing(housing_id: str):
    if not _housing().delete(housing_id):
        return jsonify({"error": "Housing option not found."}), 404
    return jsonify({"deleted": housing_id})
