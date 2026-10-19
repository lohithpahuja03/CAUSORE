"""
CAUSORE CSV & Tabular Telemetry Parser
Parses metric dumps, RDS performance tables, and request rate summaries.
"""

import csv
import io
import hashlib
from typing import List, Optional
from backend.parsers.base import BaseParser, ParsedRecord
from backend.parsers.timestamp import normalize_timestamp


class CsvParser(BaseParser):
    """Parses CSV metrics files mapping timestamp, metric values, and service headers."""

    def parse(self, content: str, filename: str, service_hint: Optional[str] = None) -> List[ParsedRecord]:
        records: List[ParsedRecord] = []
        clean_content = content.strip()
        if not clean_content:
            return records

        reader = csv.DictReader(io.StringIO(clean_content))
        if not reader.fieldnames:
            return records

        # Identify timestamp column
        ts_col = None
        for col in reader.fieldnames:
            if any(k in col.lower() for k in ["time", "date", "ts", "timestamp"]):
                ts_col = col
                break

        default_service = service_hint or filename.split(".")[0].replace("_", "-")

        for line_num, row in enumerate(reader, 2):
            raw_ts = row.get(ts_col, "") if ts_col else ""
            ts = normalize_timestamp(raw_ts)

            # Check for error or status indicators
            level = "INFO"
            row_text = " ".join(str(v) for v in row.values())
            if any(w in row_text.lower() for w in ["fail", "error", "500", "502", "504", "critical"]):
                level = "ERROR"
            elif any(w in row_text.lower() for w in ["warn", "degraded", "spike"]):
                level = "WARN"

            # Formulate structured message
            metrics_summary = ", ".join(f"{k}: {v}" for k, v in row.items() if k != ts_col and v)
            msg = f"Telemetry snapshot: {metrics_summary}" if metrics_summary else "Tabular record"

            fp = hashlib.md5(f"{default_service}_{metrics_summary[:40]}".encode("utf-8")).hexdigest()[:12]

            records.append(
                ParsedRecord(
                    timestamp=ts,
                    service=default_service,
                    level=level,
                    message=msg,
                    source_file=filename,
                    source_line=line_num,
                    fingerprint=f"fp_{fp}",
                    attributes={k: v for k, v in row.items()}
                )
            )

        return records
