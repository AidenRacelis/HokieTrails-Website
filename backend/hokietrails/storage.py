"""A tiny JSON document store.

Each "collection" is persisted to a single ``.json`` file on disk that contains
a list of records.  Reads and writes are guarded by a per-file lock so that
concurrent requests do not corrupt the file.  Writes are atomic (write to a
temp file then ``os.replace``) so a crash mid-write cannot truncate the data.

This intentionally mimics the surface of a document database (find, insert,
update, delete) so it can later be swapped for MongoDB / DynamoDB / Postgres
without touching the blueprints.
"""

from __future__ import annotations

import json
import os
import tempfile
import threading
import uuid
from pathlib import Path
from typing import Any, Callable

_LOCKS: dict[Path, threading.RLock] = {}
_LOCKS_GUARD = threading.Lock()


def _lock_for(path: Path) -> threading.RLock:
    with _LOCKS_GUARD:
        if path not in _LOCKS:
            _LOCKS[path] = threading.RLock()
        return _LOCKS[path]


class JsonCollection:
    """A list-of-dicts collection persisted to a JSON file."""

    def __init__(self, path: Path):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if not self.path.exists():
            self._write_all([])

    # ------------------------------------------------------------------ IO
    def _read_all(self) -> list[dict[str, Any]]:
        with _lock_for(self.path):
            try:
                with open(self.path, "r", encoding="utf-8") as fh:
                    data = json.load(fh)
            except (FileNotFoundError, json.JSONDecodeError):
                return []
        if not isinstance(data, list):
            return []
        return data

    def _write_all(self, records: list[dict[str, Any]]) -> None:
        with _lock_for(self.path):
            fd, tmp = tempfile.mkstemp(dir=str(self.path.parent), suffix=".tmp")
            try:
                with os.fdopen(fd, "w", encoding="utf-8") as fh:
                    json.dump(records, fh, indent=2, ensure_ascii=False)
                os.replace(tmp, self.path)
            finally:
                if os.path.exists(tmp):
                    os.remove(tmp)

    # --------------------------------------------------------------- Queries
    def all(self) -> list[dict[str, Any]]:
        return self._read_all()

    def find(self, predicate: Callable[[dict[str, Any]], bool] | None = None) -> list[dict[str, Any]]:
        records = self._read_all()
        if predicate is None:
            return records
        return [r for r in records if predicate(r)]

    def get(self, record_id: str) -> dict[str, Any] | None:
        for record in self._read_all():
            if str(record.get("id")) == str(record_id):
                return record
        return None

    def find_one(self, predicate: Callable[[dict[str, Any]], bool]) -> dict[str, Any] | None:
        for record in self._read_all():
            if predicate(record):
                return record
        return None

    # -------------------------------------------------------------- Mutations
    def insert(self, record: dict[str, Any]) -> dict[str, Any]:
        with _lock_for(self.path):
            records = self._read_all()
            if not record.get("id"):
                record["id"] = uuid.uuid4().hex
            records.append(record)
            self._write_all(records)
            return record

    def update(self, record_id: str, changes: dict[str, Any]) -> dict[str, Any] | None:
        with _lock_for(self.path):
            records = self._read_all()
            updated: dict[str, Any] | None = None
            for record in records:
                if str(record.get("id")) == str(record_id):
                    record.update(changes)
                    updated = record
                    break
            if updated is not None:
                self._write_all(records)
            return updated

    def delete(self, record_id: str) -> bool:
        with _lock_for(self.path):
            records = self._read_all()
            new_records = [r for r in records if str(r.get("id")) != str(record_id)]
            if len(new_records) == len(records):
                return False
            self._write_all(new_records)
            return True

    def seed_if_empty(self, records: list[dict[str, Any]]) -> None:
        """Populate the collection with ``records`` only when it is empty."""
        with _lock_for(self.path):
            if not self._read_all():
                self._write_all(records)


_COLLECTION_CACHE: dict[Path, JsonCollection] = {}


def get_collection(data_dir: Path, name: str) -> JsonCollection:
    """Return a cached :class:`JsonCollection` for ``data_dir/name.json``."""
    path = Path(data_dir) / f"{name}.json"
    if path not in _COLLECTION_CACHE:
        _COLLECTION_CACHE[path] = JsonCollection(path)
    return _COLLECTION_CACHE[path]
