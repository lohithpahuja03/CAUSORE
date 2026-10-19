"""
CAUSORE Canonical Timestamp Normalizer
Converts disparate engineering timestamps into canonical UTC ISO-8601.
Strictly adhering to BRAIN.md Principle 6 & Stage 5.
"""

import re
from datetime import datetime, timezone
from typing import Optional
from dateutil import parser as dateutil_parser

# Regex patterns for common timestamp formats
EPOCH_SEC_PATTERN = re.compile(r"^\d{10}(\.\d+)?$")
EPOCH_MS_PATTERN = re.compile(r"^\d{13}$")

# Common log prefixes (e.g. [2026-10-18 14:02:15] or 2026/10/18 14:02:15)
PREFIX_PATTERN = re.compile(
    r"^\[?(\d{4}[-/]\d{2}[-/]\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)\]?"
)
SYSLOG_PATTERN = re.compile(
    r"^([A-Z][a-z]{2}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}(?:\.\d+)?)"
)
NGINX_PATTERN = re.compile(
    r"\[?(\d{2}/[A-Z][a-z]{2}/\d{4}:\d{2}:\d{2}:\d{2}\s+[+-]\d{4})\]?"
)


def normalize_timestamp(raw_val: str, default_year: int = 2026) -> str:
    """
    Parse any arbitrary date/time representation and return canonical UTC ISO-8601.
    Format: 'YYYY-MM-DDTHH:MM:SSZ' or 'YYYY-MM-DDTHH:MM:SS.mmmZ'
    """
    if not raw_val or not isinstance(raw_val, str):
        return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    clean_str = raw_val.strip().strip("[]()\"'")

    # 1. Epoch Milliseconds
    if EPOCH_MS_PATTERN.match(clean_str):
        dt = datetime.fromtimestamp(float(clean_str) / 1000.0, tz=timezone.utc)
        return dt.strftime("%Y-%m-%dT%H:%M:%S.%fZ")[:-4] + "Z"

    # 2. Epoch Seconds
    if EPOCH_SEC_PATTERN.match(clean_str):
        dt = datetime.fromtimestamp(float(clean_str), tz=timezone.utc)
        return dt.strftime("%Y-%m-%dT%H:%M:%SZ")

    # 3. Nginx / Apache style: 18/Oct/2026:14:02:15 +0000
    nginx_match = NGINX_PATTERN.search(clean_str)
    if nginx_match:
        try:
            dt = datetime.strptime(nginx_match.group(1), "%d/%b/%Y:%H:%M:%S %z")
            return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            pass

    # 4. Standard ISO or general timestamp via dateutil
    try:
        dt = dateutil_parser.parse(clean_str)
        # Handle syslog missing year
        if dt.year == datetime.now().year and not re.search(r"\d{4}", clean_str):
            dt = dt.replace(year=default_year)

        # Convert to UTC
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        else:
            dt = dt.astimezone(timezone.utc)

        if dt.microsecond > 0:
            return dt.strftime("%Y-%m-%dT%H:%M:%S.%fZ")[:-4] + "Z"
        return dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    except Exception:
        # Fallback to current UTC if unparseable
        return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def extract_timestamp_from_line(line: str) -> tuple[Optional[str], str]:
    """
    Extract timestamp from beginning of a log line.
    Returns (extracted_normalized_timestamp, remainder_message).
    """
    line_clean = line.strip()
    if not line_clean:
        return None, ""

    # Check ISO prefix
    m = PREFIX_PATTERN.match(line_clean)
    if m:
        ts = normalize_timestamp(m.group(1))
        remainder = line_clean[m.end():].lstrip(" -:|,")
        return ts, remainder

    # Check Nginx / Apache
    m = NGINX_PATTERN.search(line_clean)
    if m:
        ts = normalize_timestamp(m.group(1))
        remainder = line_clean[:m.start()] + line_clean[m.end():]
        return ts, remainder.strip()

    # Check Syslog
    m = SYSLOG_PATTERN.match(line_clean)
    if m:
        ts = normalize_timestamp(m.group(1))
        remainder = line_clean[m.end():].lstrip(" -:|,")
        return ts, remainder

    return None, line_clean
