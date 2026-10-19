"""
CAUSORE Pydantic v2 Validation Schemas
"""

from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict

EpistemologicalStatus = Literal["OBSERVED", "CORRELATED", "INFERRED", "UNKNOWN"]
IncidentSeverity = Literal["SEV-1", "SEV-2", "SEV-3", "SEV-4"]


class InvestigationBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    severity: IncidentSeverity = "SEV-1"
    environment: str = Field(default="production", max_length=64)
    affected_services: List[str] = Field(default_factory=list)
    start_time: str
    end_time: Optional[str] = None


class InvestigationCreate(InvestigationBase):
    pass


class InvestigationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    severity: Optional[IncidentSeverity] = None
    environment: Optional[str] = None
    affected_services: Optional[List[str]] = None
    end_time: Optional[str] = None
    status: Optional[str] = None
    lead_confidence: Optional[float] = None


class EvidenceFileResponse(BaseModel):
    id: str
    investigation_id: str
    filename: str
    file_size_bytes: int
    mime_type: str
    source_type: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NormalizedEventCreate(BaseModel):
    timestamp: str
    service: str
    level: str = "INFO"
    message: str
    source_file: str
    source_line: Optional[int] = None
    fingerprint: Optional[str] = None
    attributes: Dict[str, Any] = Field(default_factory=dict)


class NormalizedEventResponse(NormalizedEventCreate):
    id: str
    investigation_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnomalyResponse(BaseModel):
    id: str
    investigation_id: str
    timestamp: str
    service: str
    anomaly_type: str
    score: float
    description: str
    baseline_value: float
    observed_value: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HypothesisResponse(BaseModel):
    id: str
    investigation_id: str
    candidate: str
    confidence: float
    status: EpistemologicalStatus
    supporting_evidence: List[str]
    contradicting_evidence: List[str]
    relevant_timeline_events: List[str]
    affected_services: List[str]
    possible_contributing_factors: List[str]
    missing_evidence: List[str]
    recommended_verification: List[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportResponse(BaseModel):
    id: str
    investigation_id: str
    title: str
    severity: str
    duration_minutes: int
    executive_summary: str
    missing_evidence_summary: List[str]
    action_items: List[str]
    generated_at: str

    model_config = ConfigDict(from_attributes=True)


class InvestigationResponse(InvestigationBase):
    id: str
    status: str
    lead_confidence: float
    created_at: datetime
    updated_at: datetime
    evidence_count: int = 0
    event_count: int = 0
    anomaly_count: int = 0
    hypothesis_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class InvestigationListResponse(BaseModel):
    total: int
    items: List[InvestigationResponse]


class PipelineStatusResponse(BaseModel):
    investigation_id: str
    status: str
    stages_completed: int
    total_stages: int
    current_stage: str
    is_completed: bool
