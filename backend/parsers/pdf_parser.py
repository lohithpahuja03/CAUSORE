"""
CAUSORE PDF Incident Report Parser
Extracts text, timeline summaries, and findings from post-mortem PDFs using pypdf.
"""

import io
from typing import List, Optional
from pypdf import PdfReader
from backend.parsers.base import BaseParser, ParsedRecord
from backend.parsers.log_parser import LogParser


class PdfParser(BaseParser):
    """Extracts raw text pages from PDF documents and passes to LogParser for event reconstruction."""

    def __init__(self):
        self.text_parser = LogParser()

    def parse(self, content: str, filename: str, service_hint: Optional[str] = None) -> List[ParsedRecord]:
        """Parse raw extracted text content."""
        return self.text_parser.parse(content, filename, service_hint=service_hint)

    def parse_bytes(self, pdf_bytes: bytes, filename: str, service_hint: Optional[str] = None) -> List[ParsedRecord]:
        """Extract text from binary PDF data and normalize into records."""
        try:
            reader = PdfReader(io.BytesIO(pdf_bytes))
            full_text = []
            for page_idx, page in enumerate(reader.pages, 1):
                extracted = page.extract_text()
                if extracted:
                    full_text.append(f"--- [Page {page_idx}] ---\n{extracted}")

            combined = "\n".join(full_text)
            return self.text_parser.parse(combined, filename, service_hint=service_hint)
        except Exception:
            return []
