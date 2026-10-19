"""
CAUSORE Structured JSON & JSONL Parser
Parses Kubernetes events, Winston, Zap, Bunyan, and Datadog logs.
"""

import json
import hashlib
from typing import List, Optional, Dict, Any
from backend.parsers.base import BaseParser, ParsedRecord
from backend.parsers.timestamp import normalize_timestamp

TIMESTAMP_KEYS = ["timestamp", "@timestamp", "time", "date", "ts", "datetime", "created_at"]
LEVEL_KEYS = ["level", "severity", "log_level", "lvl", "status"]
MESSAGE_KEYS = ["message", "msg", "log", "error", "description", "event"]
SERVICE_KEYS = ["service", "app", "application", "service_name", "component", "container"]


class JsonParser(BaseParser):
    """Parses JSON arrays, single JSON objects, or line-delimited JSON (JSONL)."""

    def parse(self, content: str, filename: str, service_hint: Optional[str] = None) -> List[ParsedRecord]:
        records: List[ParsedRecord] = []
        clean_content = content.strip()
        if not clean_content:
            return records

        # 1. Try parsing as single JSON object or array
        if (clean_content.startswith("[") and clean_content.endswith("]")) or \
           (clean_content.startswith("{") and clean_content.endswith("}")):
            try:
                data = json.loads(clean_content)
                if isinstance(data, list):
                    for idx, item in enumerate(data, 1):
                        rec = self._parse_dict_item(item, filename, line_num=idx, service_hint=service_hint)
                        if rec:
                            records.append(rec)
                    return records
                elif isinstance(data, dict):
                    rec = self._parse_dict_item(data, filename, line_num=1, service_hint=service_hint)
                    if rec:
                        records.append(rec)
                    return records
            except json.JSONDecodeError:
                pass

        # 2. Treat as JSONL (one JSON object per line)
        for line_idx, line in enumerate(clean_content.splitlines(), 1):
            line_str = line.strip()
            if not line_str:
                continue
            try:
                item = json.loads(line_str)
                if isinstance(item, dict):
                    rec = self._parse_dict_item(item, filename, line_num=line_idx, service_hint=service_hint)
                    if rec:
                        records.append(rec)
            except json.JSONDecodeError:
                continue

        return records

    def _parse_dict_item(
        self,
        item: Dict[str, Any],
        filename: str,
        line_num: int,
        service_hint: Optional[str] = None
    ) -> Optional[ParsedRecord]:
        # Extract Timestamp
        raw_ts = None
        for k in TIMESTAMP_KEYS:
            if k in item and item[k] is not None:
                raw_ts = str(item[k])
                break
        ts = normalize_timestamp(raw_ts or "")

        # Extract Level
        raw_level = "INFO"
        for k in LEVEL_KEYS:
            if k in item and item[k] is not None:
                raw_level = str(item[k]).upper()
                break
        if "ERR" in raw_level:
            level = "ERROR"
        elif "WARN" in raw_level:
            level = "WARN"
        elif "FATAL" in raw_level:
            level = "FATAL"
        elif "DEBUG" in raw_level:
            level = "DEBUG"
        else:
            level = "INFO"

        # Extract Message
        message = ""
        for k in MESSAGE_KEYS:
            if k in item and item[k] is not None:
                message = str(item[k])
                break
        if not message:
            message = json.dumps(item)

        # Extract Service
        service = service_hint or "system"
        for k in SERVICE_KEYS:
            if k in item and item[k] is not None:
                service = str(item[k])
                break

        # Fingerprint calculation
        fp = hashlib.md5(f"{service}_{level}_{message[:64]}".encode("utf-8")).hexdigest()[:12]

        return ParsedRecord(
            timestamp=ts,
            service=service,
            level=level,
            message=message,
            source_file=filename,
            source_line=line_num,
            fingerprint=f"fp_{fp}",
            attributes={k: v for k, v in item.items() if k not in MESSAGE_KEYS}
        )
