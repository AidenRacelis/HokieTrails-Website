"""Application configuration loaded from environment variables."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_DATA_DIR = BASE_DIR / "data"


@dataclass
class Config:
    """Runtime configuration.

    Attributes:
        SECRET_KEY: Secret used to sign JWT access tokens.
        DATA_DIR: Directory that holds the JSON "databases".
        JWT_EXPIRES_MINUTES: Access token lifetime in minutes.
        CORS_ORIGINS: List of allowed origins for browser requests.
    """

    SECRET_KEY: str = "dev-secret-change-me"
    DATA_DIR: Path = DEFAULT_DATA_DIR
    JWT_EXPIRES_MINUTES: int = 60 * 24 * 7  # one week
    CORS_ORIGINS: list[str] = field(default_factory=lambda: ["*"])

    @classmethod
    def from_env(cls) -> "Config":
        origins = os.environ.get("CORS_ORIGINS", "*")
        origins_list = [o.strip() for o in origins.split(",") if o.strip()] or ["*"]

        data_dir = os.environ.get("DATA_DIR")
        return cls(
            SECRET_KEY=os.environ.get("SECRET_KEY", "dev-secret-change-me"),
            DATA_DIR=Path(data_dir) if data_dir else DEFAULT_DATA_DIR,
            JWT_EXPIRES_MINUTES=int(os.environ.get("JWT_EXPIRES_MINUTES", 60 * 24 * 7)),
            CORS_ORIGINS=origins_list,
        )
