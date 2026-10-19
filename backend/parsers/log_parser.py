"""
CAUSORE Unstructured & Semi-Structured Log Parser
Parses Syslog, Nginx, Apache, standard microservice stdout, and multiline stacktraces.
"""

import re
import hashlib
from typing import List, Optional
from backend.parsers.base import BaseParser, ParsedRecord
from backend.parsers.timestamp import extract_timestamp_from_line, normalize_timestamp

LEVEL_REGEX = re.compile(r"\b(DEBUG|INFO|WARN(?:ING)?|ERR(?:OR)?|FATAL|CRITICAL)\b", re.IGNORECASE)
SERVICE_TAG_REGEX = re.compile(r"\[([a-zA-Z0-9_\-\.]+)\]|([a-zA-Z0-9_\-\.]+):")


class LogParser(BaseParser):
    """Parses line-by-line log streams, grouping multiline stack traces."""

    def parse(self, content: str, filename: str, service_hint: Optional[str] = None) -> List[ParsedRecord]:
        records: List[ParsedRecord] = []
        lines = content.splitlines()
        if not lines:
            return records

        # Determine default service name from filename if no hint
        default_service = service_hint or filename.split(".")[0].replace("_", "-")

        current_record: Optional[ParsedRecord] = None

        for line_num, line in enumerate(lines, 1):
            line_str = line.rstrip()
            if not line_str:
                continue

            # Check if this line starts a new log record with a timestamp
            ts, remainder = extract_timestamp_from_line(line_str)

            if ts:
                # Flush existing multiline record
                if current_record:
                    records.append(current_record)

                # Extract Level
                level = "INFO"
                lvl_match = LEVEL_REGEX.search(remainder)
                if lvl_match:
                    raw_lvl = lvl_match.group(1).upper()
                    if "ERR" in raw_lvl:
                        level = "ERROR"
                    elif "WARN" in raw_lvl:
                        level = "WARN"
                    elif "FATAL" in raw_lvl or "CRIT" in raw_lvl:
                        level = "FATAL"
                    elif "DEBUG" in raw_lvl:
                        level = "DEBUG"

                # Extract Service
                service = default_service
                svc_match = SERVICE_TAG_REGEX.search(remainder[:40])
                if svc_match:
                    extracted_svc = svc_match.group(1) or svc_match.group(2)
                    if extracted_svc and len(extracted_svc) > 2:
                        service = extracted_svc

                # Clean message
                clean_msg = remainder
                if lvl_match:
                    clean_msg = clean_msg[:lvl_match.start()] + clean_msg[lvl_match.end():]
                clean_msg = re.sub(r"^[\[\],:\s\-]+", "", clean_msg).strip()
                if not clean_msg:
                    clean_msg = remainder.strip()

                fp = hashlib.md5(f"{service}_{level}_{clean_msg[:60]}".encode("utf-8")).hexdigest()[:12]

                current_record = ParsedRecord(
                    timestamp=ts,
                    service=service,
                    level=level,
                    message=clean_msg,
                    source_file=filename,
                    source_line=line_num,
                    fingerprint=f"fp_{fp}",
                    attributes={"raw_line": line_str[:256]}
                )
            else:
                # Continuation of multiline stack trace
                if current_record:
                    current_record.message += f"\n{line_str}"
                    # Elevate level if stack trace indicates exception
                    if "Exception" in line_str or "Error" in line_str or "Traceback" in line_str:
                        current_record.level = "ERROR"
                else:
                    # Line without timestamp at start of file
                    current_record = ParsedRecord(
                        timestamp=normalize_timestamp(""),
                        service=default_service,
                        level="INFO",
                        message=line_str,
                        source_file=filename,
                        source_line=line_num,
                        fingerprint="fp_unknown",
                        attributes={"raw_line": line_str[:256]}
                    )

        if current_record:
            records.append(current_record)

        return records
