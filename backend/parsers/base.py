"""
CAUSORE Base Parser Specification & ParsedRecord Data Model
"""

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ParsedRecord(BaseModel):
    """Canonical event record extracted from any evidence source."""
    timestamp: str # UTC ISO-8601
    service: str
    level: str = "INFO" # DEBUG, INFO, WARN, ERROR, FATAL
    message: str
    source_file: str
    source_line: Optional[int] = None
    fingerprint: Optional[str] = None
    attributes: Dict[str, Any] = Field(default_factory=dict)


class BaseParser(ABC):
    """Abstract base parser interface."""

    @abstractmethod
    def parse(self, content: str, filename: str, service_hint: Optional[str] = None) -> List[ParsedRecord]:
        """Parse raw string content into normalized records."""
        pass
