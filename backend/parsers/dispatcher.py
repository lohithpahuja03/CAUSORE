"""
CAUSORE Unified Parser Dispatcher
Routes raw uploaded evidence to the appropriate parser based on format inspection.
"""

from pathlib import Path
from typing import List, Optional
from backend.parsers.base import ParsedRecord
from backend.parsers.json_parser import JsonParser
from backend.parsers.log_parser import LogParser
from backend.parsers.csv_parser import CsvParser
from backend.parsers.pdf_parser import PdfParser

json_parser = JsonParser()
log_parser = LogParser()
csv_parser = CsvParser()
pdf_parser = PdfParser()


def parse_evidence_content(
    content: str,
    filename: str,
    service_hint: Optional[str] = None
) -> List[ParsedRecord]:
    """Parse text content by selecting the best matching parser."""
    lower_name = filename.lower()

    if lower_name.endswith(".json") or lower_name.endswith(".jsonl"):
        return json_parser.parse(content, filename, service_hint=service_hint)
    elif lower_name.endswith(".csv"):
        return csv_parser.parse(content, filename, service_hint=service_hint)
    else:
        # Default to robust multiline log parser
        return log_parser.parse(content, filename, service_hint=service_hint)


def parse_pdf_evidence(
    pdf_bytes: bytes,
    filename: str,
    service_hint: Optional[str] = None
) -> List[ParsedRecord]:
    """Parse binary PDF document."""
    return pdf_parser.parse_bytes(pdf_bytes, filename, service_hint=service_hint)
