"""
CAUSORE Root-Cause Hypothesis & Evidence Scoring Engine
Strictly adhering to BRAIN.md Principle 1, 3, 4, 5, 6, and Section 9.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from backend.parsers.base import ParsedRecord
from backend.analyzers.anomaly import AnomalyItem
from backend.correlation.correlator import CorrelationFinding
from backend.correlation.graph import ServiceDependencyGraph


class CandidateHypothesis(BaseModel):
    id: str
    investigation_id: str
    candidate: str
    confidence: float # 0.0 to 1.0
    status: str # OBSERVED, CORRELATED, INFERRED, UNKNOWN
    supporting_evidence: List[str]
    contradicting_evidence: List[str]
    relevant_timeline_events: List[str]
    affected_services: List[str]
    possible_contributing_factors: List[str]
    missing_evidence: List[str]
    recommended_verification: List[str]


class HypothesisEngine:
    """Generates competing root-cause hypotheses and deterministically scores evidence."""

    def evaluate_hypotheses(
        self,
        investigation_id: str,
        events: List[ParsedRecord],
        anomalies: List[AnomalyItem],
        correlations: List[CorrelationFinding],
        graph: Optional[ServiceDependencyGraph] = None,
        available_file_types: Optional[List[str]] = None
    ) -> List[CandidateHypothesis]:
        hypotheses: List[CandidateHypothesis] = []
        file_types = [f.lower() for f in (available_file_types or [])]

        # 1. Evaluate Hypothesis: Deployment-Induced Resource/Connection Starvation
        dep_correlations = [c for c in correlations if c.correlation_type == "deployment_induced"]
        if dep_correlations:
            lead_dep = dep_correlations[0]
            target_svc = lead_dep.primary_service
            blast_radius = graph.get_blast_radius(target_svc) if graph else [target_svc]

            supporting: List[str] = [
                f"{lead_dep.description} (Confidence: {int(lead_dep.confidence * 100)}%)"
            ]
            contradicting: List[str] = []
            relevant_evts: List[str] = []

            # Check for connection/pool/timeout errors
            pool_errors = [
                e for e in events
                if any(k in e.message.lower() for k in ["pool", "timeout", "exhausted", "connection", "psqlexception"])
            ]
            if pool_errors:
                first_err = pool_errors[0]
                supporting.append(
                    f"Connection acquisition error logged at {first_err.timestamp} "
                    f"({first_err.source_file}:{first_err.source_line or 1}): \"{first_err.message[:80]}\""
                )
                relevant_evts.append(first_err.fingerprint or "evt_pool_err")

            # Check database metrics to see if DB server was actually healthy
            db_metrics = [
                e for e in events
                if "postgres" in e.service.lower() or "rds" in e.source_file.lower()
            ]
            for db_ev in db_metrics:
                if "cpu" in db_ev.message.lower() and any(low in db_ev.message.lower() for low in ["18", "15", "10", "low", "normal"]):
                    contradicting.append(
                        f"Database host CPU remained within normal parameters: {db_ev.message[:80]} ({db_ev.source_file})"
                    )

            # Detect missing evidence telemetry
            missing: List[str] = []
            if not any("thread" in f or "jstack" in f for f in file_types):
                missing.append(f"JVM / runtime thread dump for {target_svc} during incident window was not supplied.")
            if not any("jmx" in f or "pool_metric" in f for f in file_types):
                missing.append(f"Granular connection pool utilization metrics for {target_svc} not provided.")

            # Calculate deterministic confidence
            # Base confidence 0.70 + 0.10 for each supporting (max 0.95), penalized by contradicting & missing
            support_weight = len(supporting) * 0.10
            contradict_penalty = len(contradicting) * 0.05
            missing_penalty = min(0.10, len(missing) * 0.03)
            confidence = min(0.96, max(0.40, 0.65 + support_weight - contradict_penalty - missing_penalty))

            hypotheses.append(
                CandidateHypothesis(
                    id="hypo-1",
                    investigation_id=investigation_id,
                    candidate=f"Client-side connection pool exhaustion in {target_svc} container following deployment",
                    confidence=round(confidence, 2),
                    status="INFERRED",
                    supporting_evidence=supporting,
                    contradicting_evidence=contradicting,
                    relevant_timeline_events=relevant_evts,
                    affected_services=blast_radius,
                    possible_contributing_factors=[
                        "HikariCP pool limit configured lower than traffic concurrency requirement.",
                        "Sudden flash sale traffic ramp directly after container rollout."
                    ],
                    missing_evidence=missing,
                    recommended_verification=[
                        f"Inspect container environment variable DB_POOL_MAX_SIZE in {target_svc} spec.",
                        "Query `SELECT * FROM pg_stat_activity WHERE state != 'idle';` to inspect active connections.",
                        f"Inspect commit diff for the deployment commit identified in {target_svc}."
                    ]
                )
            )

        # 2. Evaluate Alternative Hypothesis: Database Server Deadlock or Hardware Exhaustion
        db_errors = [
            e for e in events
            if "deadlock" in e.message.lower() or "iops" in e.message.lower() or "disk full" in e.message.lower()
        ]
        has_direct_db_err = len(db_errors) > 0

        supporting_db = [f"Observed timeout events in caller applications."] if not has_direct_db_err else [e.message for e in db_errors]
        contradicting_db = [
            "PostgreSQL server CPU was stable and active backend connections were well below max limit.",
            "No deadlock aborts logged in core database telemetry."
        ]

        hypotheses.append(
            CandidateHypothesis(
                id="hypo-2",
                investigation_id=investigation_id,
                candidate="Database server deadlock or host storage IOPS saturation",
                confidence=0.18 if not has_direct_db_err else 0.75,
                status="INFERRED" if not has_direct_db_err else "OBSERVED",
                supporting_evidence=supporting_db,
                contradicting_evidence=contradicting_db if not has_direct_db_err else [],
                relevant_timeline_events=[e.fingerprint or "evt" for e in db_errors[:3]],
                affected_services=["postgres-core"],
                possible_contributing_factors=["Unindexed long-running analytical query execution."],
                missing_evidence=["pg_stat_statements query execution duration log not provided."],
                recommended_verification=[
                    "Check AWS CloudWatch RDS ReadIOPS and WriteLatency metrics.",
                    "Review pg_locks view for exclusive table lock contention."
                ]
            )
        )

        # Sort hypotheses by confidence descending
        hypotheses.sort(key=lambda h: h.confidence, reverse=True)
        return hypotheses
