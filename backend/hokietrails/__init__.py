"""HokieTrails backend application factory.

The backend is organized into three logical services that each expose a Flask
blueprint:

* ``auth``    - user registration, login and saved (bookmarked) items
* ``trails``  - Virginia hiking trail catalog
* ``housing`` - lodges / cabins / campgrounds located alongside the trails

For local development every blueprint is served from a single process (a
"monolith").  In production each service can be deployed independently as its
own Docker container / Kubernetes deployment by setting the ``SERVICE``
environment variable to ``auth``, ``trails`` or ``housing``.
"""

from __future__ import annotations

import os

from flask import Flask, jsonify
from flask_cors import CORS

from .config import Config

VALID_SERVICES = ("auth", "trails", "housing")


def create_app(service: str | None = None, config: Config | None = None) -> Flask:
    """Create and configure a Flask application.

    Args:
        service: Which service(s) to mount. One of ``auth``, ``trails``,
            ``housing`` or ``all``.  Defaults to the ``SERVICE`` environment
            variable, falling back to ``all`` (the monolith).
        config: Optional pre-built :class:`Config` instance (useful for tests).
    """
    config = config or Config.from_env()
    service = (service or os.environ.get("SERVICE", "all")).lower()

    app = Flask(__name__)
    app.config.from_object(config)
    app.config["hokietrails_config"] = config

    # Treat "/api/trails" and "/api/trails/" identically so reverse proxies
    # (Next.js rewrites, nginx) never trigger a slash-mismatch redirect loop.
    app.url_map.strict_slashes = False

    CORS(app, resources={r"/*": {"origins": config.CORS_ORIGINS}}, supports_credentials=True)

    mounted: list[str] = []

    if service in ("auth", "all"):
        from .blueprints.auth import auth_bp

        app.register_blueprint(auth_bp)
        mounted.append("auth")

    if service in ("trails", "all"):
        from .blueprints.trails import trails_bp

        app.register_blueprint(trails_bp)
        mounted.append("trails")

    if service in ("housing", "all"):
        from .blueprints.housing import housing_bp

        app.register_blueprint(housing_bp)
        mounted.append("housing")

    if not mounted:
        raise ValueError(
            f"Unknown SERVICE '{service}'. Expected one of {VALID_SERVICES} or 'all'."
        )

    @app.get("/health")
    def health():  # pragma: no cover - trivial
        return jsonify({"status": "ok", "service": service, "mounted": mounted})

    @app.get("/")
    def index():  # pragma: no cover - trivial
        return jsonify(
            {
                "name": "HokieTrails API",
                "service": service,
                "mounted": mounted,
                "endpoints": sorted(
                    str(rule) for rule in app.url_map.iter_rules() if rule.endpoint != "static"
                ),
            }
        )

    return app
