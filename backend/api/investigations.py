"""
CAUSORE Investigation REST API Endpoints
Adhering to API Principles in BRAIN.md & Section 20
"""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, delete
from sqlalchemy.orm import selectinload

from backend.core.database import get_db
from backend.core.security import (
    sanitize_and_validate_filename,
    validate_file_size,
    validate_mime_type,
)
from backend.models.database import (
    InvestigationModel,
    EvidenceFileModel,
    NormalizedEventModel,
    AnomalyModel,
    HypothesisModel,
    ReportModel
)
from backend.schemas.investigation import (
    InvestigationCreate,
    InvestigationUpdate,
    InvestigationResponse,
    InvestigationListResponse,
    EvidenceFileResponse,
    NormalizedEventResponse,
    AnomalyResponse,
    HypothesisResponse,
    ReportResponse,
    PipelineStatusResponse
)

router = APIRouter(prefix="/investigations", tags=["Investigations"])


@router.post("", response_model=InvestigationResponse, status_code=status.HTTP_201_CREATED)
async def create_investigation(
    payload: InvestigationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new incident investigation."""
    inv = InvestigationModel(
        title=payload.title,
        description=payload.description,
        severity=payload.severity,
        environment=payload.environment,
        affected_services=payload.affected_services,
        start_time=payload.start_time,
        end_time=payload.end_time,
        status="created"
    )
    db.add(inv)
    await db.commit()
    await db.refresh(inv)

    return InvestigationResponse(
        id=inv.id,
        title=inv.title,
        description=inv.description,
        severity=inv.severity,
        environment=inv.environment,
        affected_services=inv.affected_services,
        start_time=inv.start_time,
        end_time=inv.end_time,
        status=inv.status,
        lead_confidence=inv.lead_confidence,
        created_at=inv.created_at,
        updated_at=inv.updated_at,
        evidence_count=0,
        event_count=0,
        anomaly_count=0,
        hypothesis_count=0
    )


@router.get("", response_model=InvestigationListResponse)
async def list_investigations(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    severity: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List investigations ordered by creation time descending."""
    query = select(InvestigationModel).options(
        selectinload(InvestigationModel.evidence_files),
        selectinload(InvestigationModel.normalized_events),
        selectinload(InvestigationModel.anomalies),
        selectinload(InvestigationModel.hypotheses)
    ).order_by(desc(InvestigationModel.created_at))

    if severity:
        query = query.where(InvestigationModel.severity == severity)

    total_query = select(func.count(InvestigationModel.id))
    if severity:
        total_query = total_query.where(InvestigationModel.severity == severity)

    total_res = await db.execute(total_query)
    total = total_res.scalar_one()

    query = query.offset(skip).limit(limit)
    res = await db.execute(query)
    items = res.scalars().all()

    response_items = []
    for inv in items:
        response_items.append(
            InvestigationResponse(
                id=inv.id,
                title=inv.title,
                description=inv.description,
                severity=inv.severity,
                environment=inv.environment,
                affected_services=inv.affected_services,
                start_time=inv.start_time,
                end_time=inv.end_time,
                status=inv.status,
                lead_confidence=inv.lead_confidence,
                created_at=inv.created_at,
                updated_at=inv.updated_at,
                evidence_count=len(inv.evidence_files),
                event_count=len(inv.normalized_events),
                anomaly_count=len(inv.anomalies),
                hypothesis_count=len(inv.hypotheses)
            )
        )

    return InvestigationListResponse(total=total, items=response_items)


@router.get("/{investigation_id}", response_model=InvestigationResponse)
async def get_investigation(
    investigation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Fetch details of an investigation."""
    query = select(InvestigationModel).options(
        selectinload(InvestigationModel.evidence_files),
        selectinload(InvestigationModel.normalized_events),
        selectinload(InvestigationModel.anomalies),
        selectinload(InvestigationModel.hypotheses)
    ).where(InvestigationModel.id == investigation_id)

    res = await db.execute(query)
    inv = res.scalar_one_or_none()

    if not inv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation '{investigation_id}' not found."
        )

    return InvestigationResponse(
        id=inv.id,
        title=inv.title,
        description=inv.description,
        severity=inv.severity,
        environment=inv.environment,
        affected_services=inv.affected_services,
        start_time=inv.start_time,
        end_time=inv.end_time,
        status=inv.status,
        lead_confidence=inv.lead_confidence,
        created_at=inv.created_at,
        updated_at=inv.updated_at,
        evidence_count=len(inv.evidence_files),
        event_count=len(inv.normalized_events),
        anomaly_count=len(inv.anomalies),
        hypothesis_count=len(inv.hypotheses)
    )


@router.delete("/{investigation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_investigation(
    investigation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Delete an investigation and all associated artifacts."""
    query = select(InvestigationModel).where(InvestigationModel.id == investigation_id)
    res = await db.execute(query)
    inv = res.scalar_one_or_none()

    if not inv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation '{investigation_id}' not found."
        )

    await db.delete(inv)
    await db.commit()
    return None


@router.post("/{investigation_id}/evidence", response_model=EvidenceFileResponse)
async def upload_evidence_metadata(
    investigation_id: str,
    filename: str,
    file_size_bytes: int,
    mime_type: str,
    source_type: str = "log",
    db: AsyncSession = Depends(get_db)
):
    """Register evidence file metadata associated with an investigation with security checks."""
    # Enforce strict security validations (path traversal, size bounds, MIME types)
    clean_filename = sanitize_and_validate_filename(filename)
    clean_size = validate_file_size(file_size_bytes)
    clean_mime = validate_mime_type(mime_type)

    query = select(InvestigationModel).where(InvestigationModel.id == investigation_id)
    res = await db.execute(query)
    inv = res.scalar_one_or_none()

    if not inv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation '{investigation_id}' not found."
        )

    evidence = EvidenceFileModel(
        investigation_id=investigation_id,
        filename=clean_filename,
        file_size_bytes=clean_size,
        mime_type=clean_mime,
        source_type=source_type,
        status="uploaded"
    )
    db.add(evidence)
    await db.commit()
    await db.refresh(evidence)

    return evidence


@router.get("/{investigation_id}/evidence", response_model=List[EvidenceFileResponse])
async def list_evidence_files(
    investigation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """List all evidence files associated with an investigation."""
    query = select(EvidenceFileModel).where(EvidenceFileModel.investigation_id == investigation_id)
    res = await db.execute(query)
    return res.scalars().all()


@router.get("/{investigation_id}/timeline", response_model=List[NormalizedEventResponse])
async def get_timeline(
    investigation_id: str,
    service: Optional[str] = None,
    level: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve normalized chronological timeline events."""
    query = select(NormalizedEventModel).where(
        NormalizedEventModel.investigation_id == investigation_id
    ).order_by(NormalizedEventModel.timestamp)

    if service:
        query = query.where(NormalizedEventModel.service == service)
    if level:
        query = query.where(NormalizedEventModel.level == level)

    res = await db.execute(query)
    return res.scalars().all()


@router.get("/{investigation_id}/anomalies", response_model=List[AnomalyResponse])
async def get_anomalies(
    investigation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve detected anomalies for the investigation."""
    query = select(AnomalyModel).where(
        AnomalyModel.investigation_id == investigation_id
    ).order_by(desc(AnomalyModel.score))

    res = await db.execute(query)
    return res.scalars().all()


@router.get("/{investigation_id}/hypotheses", response_model=List[HypothesisResponse])
async def get_hypotheses(
    investigation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve candidate root causes ranked by confidence."""
    query = select(HypothesisModel).where(
        HypothesisModel.investigation_id == investigation_id
    ).order_by(desc(HypothesisModel.confidence))

    res = await db.execute(query)
    return res.scalars().all()


@router.get("/{investigation_id}/report", response_model=ReportResponse)
async def get_report(
    investigation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve final RCA investigation report."""
    query = select(ReportModel).where(ReportModel.investigation_id == investigation_id)
    res = await db.execute(query)
    report = res.scalar_one_or_none()

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"RCA Report not yet generated for investigation '{investigation_id}'."
        )

    return report


@router.get("/{investigation_id}/status", response_model=PipelineStatusResponse)
async def get_pipeline_status(
    investigation_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Query deterministic pipeline execution status."""
    query = select(InvestigationModel).where(InvestigationModel.id == investigation_id)
    res = await db.execute(query)
    inv = res.scalar_one_or_none()

    if not inv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation '{investigation_id}' not found."
        )

    is_done = inv.status == "completed"

    return PipelineStatusResponse(
        investigation_id=inv.id,
        status=inv.status,
        stages_completed=11 if is_done else 1,
        total_stages=11,
        current_stage="Investigation Complete" if is_done else "Ingestion Active",
        is_completed=is_done
    )


@router.post("/seed-sample", response_model=InvestigationResponse, status_code=status.HTTP_201_CREATED)
async def seed_sample_investigation(
    db: AsyncSession = Depends(get_db)
):
    """Seed the database with a verified SEV-1 sample incident for testing."""
    sample_id = "inv-sample-checkout-pool"

    # Check if already exists
    existing = await db.execute(select(InvestigationModel).where(InvestigationModel.id == sample_id))
    if existing.scalar_one_or_none():
        await db.execute(delete(InvestigationModel).where(InvestigationModel.id == sample_id))
        await db.commit()

    inv = InvestigationModel(
        id=sample_id,
        title="Checkout Gateway Timeout & Cascading Failure",
        description="Cascading HTTP 504 timeouts across checkout-api following canary rollout of payment-service v2.4.1.",
        severity="SEV-1",
        environment="production-us-east-1",
        affected_services=["api-gateway", "checkout-api", "payment-service", "postgres-core"],
        start_time="2026-10-18T14:00:00Z",
        end_time="2026-10-18T14:28:30Z",
        status="completed",
        lead_confidence=0.88
    )
    db.add(inv)

    # Seed Evidence Files
    db.add(EvidenceFileModel(
        investigation_id=sample_id,
        filename="payment-service.log",
        file_size_bytes=1488000,
        mime_type="text/plain",
        source_type="log",
        status="parsed"
    ))
    db.add(EvidenceFileModel(
        investigation_id=sample_id,
        filename="deployments_audit.log",
        file_size_bytes=42000,
        mime_type="text/plain",
        source_type="deployment",
        status="parsed"
    ))

    # Seed Normalized Events
    events = [
        NormalizedEventModel(
            investigation_id=sample_id,
            timestamp="2026-10-18T14:00:15Z",
            service="payment-service",
            level="INFO",
            message="Deploy canary v2.4.1 completed across 4/20 pods. Commit SHA: a8f1bc4",
            source_file="deployments_audit.log",
            source_line=412,
            fingerprint="fp_deploy_canary"
        ),
        NormalizedEventModel(
            investigation_id=sample_id,
            timestamp="2026-10-18T14:02:15Z",
            service="payment-service",
            level="ERROR",
            message="PSQLException: Connection acquisition timed out after 30000ms. Pool empty.",
            source_file="payment-service.log",
            source_line=1899,
            fingerprint="fp_db_pool_timeout"
        ),
        NormalizedEventModel(
            investigation_id=sample_id,
            timestamp="2026-10-18T14:03:02Z",
            service="api-gateway",
            level="ERROR",
            message="HTTP 504 Gateway Timeout on POST /v1/checkout/charge. Upstream server failed.",
            source_file="nginx_access.log",
            source_line=54120,
            fingerprint="fp_gateway_timeout_504"
        ),
    ]
    for ev in events:
        db.add(ev)

    # Seed Anomalies
    db.add(AnomalyModel(
        investigation_id=sample_id,
        timestamp="2026-10-18T14:02:15Z",
        service="payment-service",
        anomalyType="error_spike",
        score=0.96,
        description="Postgres connection acquisition timeout rate spiked from 0/min to 142/min.",
        baseline_value=0.0,
        observed_value=142.0
    ))

    # Seed Hypotheses
    db.add(HypothesisModel(
        investigation_id=sample_id,
        candidate="Client-side connection pool starvation in payment-service container",
        confidence=0.88,
        status="INFERRED",
        supporting_evidence=[
          "Canary deployment v2.4.1 (commit a8f1bc4) deployed at 14:00:15 UTC.",
          "Connection acquisition timeout spiked to 142 errors/min at 14:02:15 UTC."
        ],
        contradicting_evidence=[
          "PostgreSQL database server CPU remained low (18.4%)."
        ],
        relevant_timeline_events=["evt-001", "evt-002"],
        affected_services=["payment-service", "checkout-api", "api-gateway"],
        possible_contributing_factors=["HikariCP pool config reduced to 10"],
        missing_evidence=["Payment-service JVM thread dump was not provided"],
        recommended_verification=["Inspect DB_POOL_MAX_SIZE in v2.4.1 deployment spec"]
    ))

    # Seed Report
    db.add(ReportModel(
        investigation_id=sample_id,
        title="RCA Report: Checkout Gateway Timeout & Cascading Failure",
        severity="SEV-1",
        duration_minutes=28,
        executive_summary="Payment-service canary deploy v2.4.1 caused connection-pool starvation.",
        missing_evidence_summary=["JVM thread dumps from payment-service pods"],
        action_items=["Add CI validation gate for DB_POOL_MAX_SIZE"],
        generated_at="2026-10-18T14:35:00Z"
    ))

    await db.commit()
    await db.refresh(inv)

    return InvestigationResponse(
        id=inv.id,
        title=inv.title,
        description=inv.description,
        severity=inv.severity,
        environment=inv.environment,
        affected_services=inv.affected_services,
        start_time=inv.start_time,
        end_time=inv.end_time,
        status=inv.status,
        lead_confidence=inv.lead_confidence,
        created_at=inv.created_at,
        updated_at=inv.updated_at,
        evidence_count=2,
        event_count=3,
        anomaly_count=1,
        hypothesis_count=1
    )
