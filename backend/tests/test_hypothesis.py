"""
Unit Tests for CAUSORE Root-Cause Hypothesis & Evidence Scoring Engine
"""

import unittest
from backend.parsers.base import ParsedRecord
from backend.analyzers.anomaly import AnomalyItem
from backend.correlation.correlator import CorrelationFinding
from backend.correlation.graph import ServiceDependencyGraph
from backend.investigation.hypothesis_engine import HypothesisEngine


class TestHypothesisEngine(unittest.TestCase):
    """Test suite verifying competing hypothesis generation, evidence scoring, and epistemic tags."""

    def setUp(self):
        self.engine = HypothesisEngine()
        self.graph = ServiceDependencyGraph()
        self.graph.add_dependency("api-gateway", "checkout-api")
        self.graph.add_dependency("checkout-api", "payment-service")

    def test_competing_hypotheses_evaluation(self):
        events = [
            ParsedRecord(
                timestamp="2026-10-18T14:02:15Z",
                service="payment-service",
                level="ERROR",
                message="PSQLException: connection acquisition timed out after 30000ms. Pool empty.",
                source_file="payment.log",
                source_line=1899,
                fingerprint="fp_db_timeout"
            ),
            ParsedRecord(
                timestamp="2026-10-18T14:04:00Z",
                service="postgres-core",
                level="INFO",
                message="CPU: 18.4% (normal). Active backends: 10.",
                source_file="rds.log",
                source_line=142,
                fingerprint="fp_db_normal"
            )
        ]

        correlations = [
            CorrelationFinding(
                id="corr-01",
                investigation_id="inv-hypo-test",
                correlation_type="deployment_induced",
                status="CORRELATED",
                confidence=0.85,
                primary_service="payment-service",
                description="Deployment of payment-service v2.4.1 occurred 2m prior to timeout surge.",
                evidence_points=["Deployment v2.4.1 at 14:00:15 UTC"]
            )
        ]

        hypotheses = self.engine.evaluate_hypotheses(
            investigation_id="inv-hypo-test",
            events=events,
            anomalies=[],
            correlations=correlations,
            graph=self.graph,
            available_file_types=["payment.log", "rds.log"]
        )

        # Must generate multiple competing hypotheses (Principle 4)
        self.assertTrue(len(hypotheses) >= 2)

        lead = hypotheses[0]
        # Lead hypothesis should be connection pool exhaustion
        self.assertIn("connection pool", lead.candidate.lower())
        self.assertTrue(lead.confidence >= 0.70)
        self.assertEqual(lead.status, "INFERRED") # Epistemic separation (Principle 3)
        self.assertTrue(len(lead.supporting_evidence) >= 1)
        self.assertTrue(len(lead.contradicting_evidence) >= 1)
        self.assertTrue(len(lead.missing_evidence) >= 1) # Detects missing thread dumps
        self.assertTrue(len(lead.recommendedVerification) if hasattr(lead, 'recommendedVerification') else len(lead.recommended_verification) >= 1)

        # Alternative hypothesis should have lower confidence
        alt = hypotheses[1]
        self.assertTrue(alt.confidence < lead.confidence)


if __name__ == "__main__":
    unittest.main()
