"""
CAUSORE Cross-Evidence & Temporal Correlation Engine
Correlating deployments, anomalies, and dependency graphs.
Strictly adhering to BRAIN.md Principle 2 & Principle 3 (CORRELATED status).
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from dateutil import parser as dateutil_parser
from pydantic import BaseModel
from backend.analyzers.anomaly import AnomalyItem
from backend.correlation.graph import ServiceDependencyGraph


class CorrelationFinding(BaseModel):
    id: str
    investigation_id: str
    correlation_type: str # deployment_induced, downstream_cascade, temporal_coincidence
    status: str = "CORRELATED"
    confidence: float # 0.0 to 1.0
    primary_service: str
    related_service: Optional[str] = None
    description: str
    evidence_points: List[str]


class CorrelationEngine:
    """Correlates anomalies with deployments and traces causal propagation across the service graph."""

    def __init__(self, graph: Optional[ServiceDependencyGraph] = None):
        self.graph = graph or ServiceDependencyGraph()

    def correlate(
        self,
        investigation_id: str,
        anomalies: List[AnomalyItem],
        deployments: List[Dict[str, Any]],
        max_deployment_lag_seconds: int = 600
    ) -> List[CorrelationFinding]:
        findings: List[CorrelationFinding] = []
        counter = 1

        # 1. Correlate Deployments with Anomalies
        for dep in deployments:
            dep_svc = dep.get("service", "")
            dep_time_str = dep.get("timestamp", "")
            commit = dep.get("commit_sha", dep.get("commit", "unknown"))
            version = dep.get("version", "")

            if not dep_svc or not dep_time_str:
                continue

            try:
                dep_dt = dateutil_parser.parse(dep_time_str)
            except Exception:
                continue

            # Look for anomalies in dep_svc or services in its blast radius
            blast_radius = self.graph.get_blast_radius(dep_svc)

            for anom in anomalies:
                if anom.service in blast_radius:
                    try:
                        anom_dt = dateutil_parser.parse(anom.timestamp)
                    except Exception:
                        continue

                    # Check delta
                    delta_sec = (anom_dt - dep_dt).total_seconds()
                    if 0 <= delta_sec <= max_deployment_lag_seconds:
                        is_direct = anom.service == dep_svc
                        conf = 0.85 if is_direct else 0.72
                        findings.append(
                            CorrelationFinding(
                                id=f"corr-{counter}",
                                investigation_id=investigation_id,
                                correlation_type="deployment_induced",
                                status="CORRELATED",
                                confidence=conf,
                                primary_service=dep_svc,
                                related_service=anom.service if not is_direct else None,
                                description=(
                                    f"Deployment of {dep_svc} {version} (commit {commit[:7]}) occurred "
                                    f"{int(delta_sec)}s prior to {anom.anomaly_type} in {anom.service}."
                                ),
                                evidence_points=[
                                    f"Deployment timestamp: {dep_time_str}",
                                    f"Anomaly observed at: {anom.timestamp}",
                                    f"Service topological link: {dep_svc} -> {anom.service}"
                                ]
                            )
                        )
                        counter += 1

        # 2. Correlate Downstream to Upstream Cascades
        # If anom_downstream occurs at T0, and anom_upstream occurs at T1 > T0, and upstream depends on downstream
        for a_down in anomalies:
            for a_up in anomalies:
                if a_down.id != a_up.id and a_down.service != a_up.service:
                    # Check if a_up calls a_down
                    paths = self.graph.find_causal_paths(source_failure=a_down.service, target_symptom=a_up.service)
                    if paths:
                        try:
                            t_down = dateutil_parser.parse(a_down.timestamp)
                            t_up = dateutil_parser.parse(a_up.timestamp)
                        except Exception:
                            continue

                        delta = (t_up - t_down).total_seconds()
                        if 0 <= delta <= 300: # Upstream manifested within 5 mins
                            findings.append(
                                CorrelationFinding(
                                    id=f"corr-{counter}",
                                    investigation_id=investigation_id,
                                    correlation_type="downstream_cascade",
                                    status="CORRELATED",
                                    confidence=0.88,
                                    primary_service=a_down.service,
                                    related_service=a_up.service,
                                    description=(
                                        f"Fault in downstream {a_down.service} propagated upstream to {a_up.service} "
                                        f"along path: {' -> '.join(paths[0])}."
                                    ),
                                    evidence_points=[
                                        f"Downstream anomaly in {a_down.service} at {a_down.timestamp}",
                                        f"Upstream timeout/cliff in {a_up.service} at {a_up.timestamp}",
                                        f"Causal cascade latency: {int(delta)} seconds"
                                    ]
                                )
                            )
                            counter += 1

        return findings
