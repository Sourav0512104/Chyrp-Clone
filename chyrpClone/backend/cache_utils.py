import hashlib
import json
import os
from datetime import datetime
from flask import Response

CACHE_ROOT = os.path.join(os.path.dirname(__file__), "cache", "cacher")

SAFE_HEADER_WHITELIST = {
    "Content-Type",
    "Cache-Control",
}

def _ensure_dir():
    os.makedirs(CACHE_ROOT, exist_ok=True)

def _key_from_path(path: str, query_string: bytes) -> str:
    raw = (path + "?" + (query_string.decode("utf-8") if query_string else "")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def cache_load(path: str, query_string: bytes) -> Response | None:
    _ensure_dir()
    key = _key_from_path(path, query_string)
    fp = os.path.join(CACHE_ROOT, key + ".json")
    if not os.path.exists(fp):
        return None
    try:
        with open(fp, "r", encoding="utf-8") as f:
            payload = json.load(f)
        data_bytes = bytes.fromhex(payload["body_hex"])
        status = payload["status"]
        headers = payload["headers"] or {}
        resp = Response(data_bytes, status=status)
        # restore headers (only safe list)
        for k, v in headers.items():
            if k in SAFE_HEADER_WHITELIST:
                resp.headers[k] = v
        resp.headers["X-Cache"] = "HIT"
        return resp
    except Exception:
        # corrupted cache → ignore
        return None

def cache_store(path: str, query_string: bytes, resp: Response) -> None:
    _ensure_dir()
    key = _key_from_path(path, query_string)
    fp = os.path.join(CACHE_ROOT, key + ".json")
    try:
        body = resp.get_data(as_text=False) or b""
        # store minimal safe metadata
        record = {
            "stored_at": datetime.utcnow().isoformat() + "Z",
            "status": resp.status_code,
            "headers": {k: v for k, v in resp.headers.items() if k in SAFE_HEADER_WHITELIST},
            "body_hex": body.hex(),
        }
        with open(fp, "w", encoding="utf-8") as f:
            json.dump(record, f)
    except Exception:
        pass

def cache_clear() -> int:
    _ensure_dir()
    removed = 0
    for name in os.listdir(CACHE_ROOT):
        if name.endswith(".json"):
            try:
                os.remove(os.path.join(CACHE_ROOT, name))
                removed += 1
            except Exception:
                pass
    return removed
