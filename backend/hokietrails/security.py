"""Password hashing and JWT helpers plus a ``@login_required`` decorator."""

from __future__ import annotations

import datetime as dt
from functools import wraps
from typing import Any, Callable

import jwt
from flask import current_app, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash


def hash_password(password: str) -> str:
    return generate_password_hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return check_password_hash(password_hash, password)


def create_access_token(user_id: str, extra: dict[str, Any] | None = None) -> str:
    config = current_app.config["hokietrails_config"]
    now = dt.datetime.now(dt.timezone.utc)
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + dt.timedelta(minutes=config.JWT_EXPIRES_MINUTES),
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, config.SECRET_KEY, algorithm="HS256")


def decode_access_token(token: str) -> dict[str, Any] | None:
    config = current_app.config["hokietrails_config"]
    try:
        return jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None


def _extract_token() -> str | None:
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[len("Bearer ") :].strip()
    return None


def login_required(fn: Callable) -> Callable:
    """Reject the request unless a valid Bearer token is present.

    On success the decoded token payload is stored on ``flask.g.user_id``.
    """

    @wraps(fn)
    def wrapper(*args: Any, **kwargs: Any):
        token = _extract_token()
        if not token:
            return jsonify({"error": "Authorization token required"}), 401
        payload = decode_access_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401
        g.user_id = payload["sub"]
        g.token_payload = payload
        return fn(*args, **kwargs)

    return wrapper
