"""Authentication & user profile service.

Endpoints (all prefixed with ``/api/auth``):

* ``POST /register``           - create an account
* ``POST /login``              - obtain a JWT access token
* ``GET  /me``                 - return the authenticated user's profile
* ``GET  /saved``              - list the user's saved trails / housing
* ``POST /saved/trails/<id>``  - bookmark a trail
* ``DELETE /saved/trails/<id>``- remove a bookmarked trail
* ``POST /saved/housing/<id>`` - bookmark a housing option
* ``DELETE /saved/housing/<id>``- remove a bookmarked housing option
"""

from __future__ import annotations

import datetime as dt
import re

from flask import Blueprint, current_app, g, jsonify, request

from ..security import (
    create_access_token,
    hash_password,
    login_required,
    verify_password,
)
from ..storage import get_collection

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _users():
    config = current_app.config["hokietrails_config"]
    return get_collection(config.DATA_DIR, "users")


def _public_user(user: dict) -> dict:
    """Strip sensitive fields before returning a user to the client."""
    return {
        "id": user["id"],
        "username": user["username"],
        "email": user["email"],
        "saved_trails": user.get("saved_trails", []),
        "saved_housing": user.get("saved_housing", []),
        "created_at": user.get("created_at"),
    }


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    errors = {}
    if len(username) < 3:
        errors["username"] = "Username must be at least 3 characters."
    if not EMAIL_RE.match(email):
        errors["email"] = "A valid email address is required."
    if len(password) < 8:
        errors["password"] = "Password must be at least 8 characters."
    if errors:
        return jsonify({"error": "Validation failed", "fields": errors}), 400

    users = _users()
    if users.find_one(lambda u: u.get("email") == email):
        return jsonify({"error": "An account with that email already exists."}), 409
    if users.find_one(lambda u: u.get("username", "").lower() == username.lower()):
        return jsonify({"error": "That username is taken."}), 409

    user = users.insert(
        {
            "username": username,
            "email": email,
            "password_hash": hash_password(password),
            "saved_trails": [],
            "saved_housing": [],
            "created_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        }
    )
    token = create_access_token(user["id"], extra={"username": username})
    return jsonify({"token": token, "user": _public_user(user)}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    identifier = (data.get("email") or data.get("username") or "").strip().lower()
    password = data.get("password") or ""

    if not identifier or not password:
        return jsonify({"error": "Email/username and password are required."}), 400

    users = _users()
    user = users.find_one(
        lambda u: u.get("email") == identifier or u.get("username", "").lower() == identifier
    )
    if not user or not verify_password(password, user["password_hash"]):
        return jsonify({"error": "Invalid credentials."}), 401

    token = create_access_token(user["id"], extra={"username": user["username"]})
    return jsonify({"token": token, "user": _public_user(user)})


@auth_bp.get("/me")
@login_required
def me():
    user = _users().get(g.user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify({"user": _public_user(user)})


@auth_bp.get("/saved")
@login_required
def saved():
    user = _users().get(g.user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify(
        {
            "saved_trails": user.get("saved_trails", []),
            "saved_housing": user.get("saved_housing", []),
        }
    )


def _toggle_saved(field: str, item_id: str, add: bool):
    users = _users()
    user = users.get(g.user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    saved_list: list[str] = list(user.get(field, []))
    if add and item_id not in saved_list:
        saved_list.append(item_id)
    if not add and item_id in saved_list:
        saved_list.remove(item_id)
    users.update(user["id"], {field: saved_list})
    return jsonify({field: saved_list})


@auth_bp.post("/saved/trails/<item_id>")
@login_required
def save_trail(item_id: str):
    return _toggle_saved("saved_trails", item_id, add=True)


@auth_bp.delete("/saved/trails/<item_id>")
@login_required
def unsave_trail(item_id: str):
    return _toggle_saved("saved_trails", item_id, add=False)


@auth_bp.post("/saved/housing/<item_id>")
@login_required
def save_housing(item_id: str):
    return _toggle_saved("saved_housing", item_id, add=True)


@auth_bp.delete("/saved/housing/<item_id>")
@login_required
def unsave_housing(item_id: str):
    return _toggle_saved("saved_housing", item_id, add=False)
