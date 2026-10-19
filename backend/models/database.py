"""
CAUSORE Core Relational Database Models
Strictly adhering to BRAIN.md Section 19 & Constitution Principles
"""

import uuid
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any

def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)
from sqlalchemy import (
    String,
    Text,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    JSON,
    Boolean,
    Index
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.core.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class InvestigationModel(Base):
    """Primary investigation entity."""
    __tablename__ = "investigations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    severity: Mapped[str] = mapped_column(String(16), default="SEV-1", nullable=False)
    environment: Mapped[str] = mapped_column(String(64), default="production", nullable=False)
    affected_services: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    start_time: Mapped[str] = mapped_column(String(64), nullable=False) # UTC ISO-8601
    end_time: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    
    status: Mapped[str] = mapped_column(String(32), default="created", nullable=False)
    # created, processing, completed, failed
    lead_confidence: Mapped[float] = mapped_column(Float, default=0.0)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=get_utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=get_utc_now, onupdate=get_utc_now)

    # Relationships
    evidence_files: Mapped[List["EvidenceFileModel"]] = relationship(
        "EvidenceFileModel", back_populates="investigation", cascade="all, delete-orphan"
    )
    normalized_events: Mapped[List["NormalizedEventModel"]] = relationship(
        "NormalizedEventModel", back_populates="investigation", cascade="all, delete-orphan"
    )
    anomalies: Mapped[List["AnomalyModel"]] = relationship(
        "AnomalyModel", back_populates="investigation", cascade="all, delete-orphan"
    )
    hypotheses: Mapped[List["HypothesisModel"]] = relationship(
        "HypothesisModel", back_populates="investigation", cascade="all, delete-orphan"
    )
    reports: Mapped[List["ReportModel"]] = relationship(
        "ReportModel", back_populates="investigation", cascade="all, delete-orphan"
    )


class EvidenceFileModel(Base):
    """Metadata for uploaded raw incident evidence."""
    __tablename__ = "evidence_files"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    investigation_id: Mapped[str] = mapped_column(String(64), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(128), nullable=False)
    source_type: Mapped[str] = mapped_column(String(32), default="log") # log, report, screenshot, deployment, data
    storage_path: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="uploaded") # uploaded, parsed, failed
    created_at: Mapped[datetime] = mapped_column(DateTime, default=get_utc_now)

    investigation: Mapped["InvestigationModel"] = relationship("InvestigationModel", back_populates="evidence_files")


class NormalizedEventModel(Base):
    """Canonical event extracted from raw evidence."""
    __tablename__ = "normalized_events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    investigation_id: Mapped[str] = mapped_column(String(64), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False)
    timestamp: Mapped[str] = mapped_column(String(64), nullable=False, index=True) # UTC ISO-8601
    service: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    level: Mapped[str] = mapped_column(String(16), default="INFO", nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    
    source_file: Mapped[str] = mapped_column(String(255), nullable=False)
    source_line: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    fingerprint: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    attributes: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=get_utc_now)

    investigation: Mapped["InvestigationModel"] = relationship("InvestigationModel", back_populates="normalized_events")

    __table_args__ = (
        Index("idx_events_inv_time", "investigation_id", "timestamp"),
    )


class AnomalyModel(Base):
    """Isolated statistical outlier or error cliff."""
    __tablename__ = "anomalies"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    investigation_id: Mapped[str] = mapped_column(String(64), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False)
    timestamp: Mapped[str] = mapped_column(String(64), nullable=False)
    service: Mapped[str] = mapped_column(String(128), nullable=False)
    anomaly_type: Mapped[str] = mapped_column(String(64), nullable=False) # error_spike, latency_cliff, volume_drop
    score: Mapped[float] = mapped_column(Float, nullable=False) # 0.0 to 1.0
    description: Mapped[str] = mapped_column(Text, nullable=False)
    baseline_value: Mapped[float] = mapped_column(Float, default=0.0)
    observed_value: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=get_utc_now)

    investigation: Mapped["InvestigationModel"] = relationship("InvestigationModel", back_populates="anomalies")


class HypothesisModel(Base):
    """Evaluated root-cause candidate adhering to BRAIN.md schema."""
    __tablename__ = "hypotheses"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    investigation_id: Mapped[str] = mapped_column(String(64), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False)
    candidate: Mapped[str] = mapped_column(String(512), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False) # 0.0 to 1.0
    status: Mapped[str] = mapped_column(String(32), default="INFERRED", nullable=False) # OBSERVED, CORRELATED, INFERRED, UNKNOWN
    
    supporting_evidence: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    contradicting_evidence: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    relevant_timeline_events: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    affected_services: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    possible_contributing_factors: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    missing_evidence: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    recommended_verification: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=get_utc_now)

    investigation: Mapped["InvestigationModel"] = relationship("InvestigationModel", back_populates="hypotheses")


class ReportModel(Base):
    """Final comprehensive RCA report."""
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=generate_uuid)
    investigation_id: Mapped[str] = mapped_column(String(64), ForeignKey("investigations.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(String(16), nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=0)
    executive_summary: Mapped[str] = mapped_column(Text, nullable=False)
    missing_evidence_summary: Mapped[List[str]] = mapped_column(JSON, default=list)
    action_items: Mapped[List[str]] = mapped_column(JSON, default=list)
    generated_at: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=get_utc_now)

    investigation: Mapped["InvestigationModel"] = relationship("InvestigationModel", back_populates="reports")
