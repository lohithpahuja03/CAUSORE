"""
Unit Tests for CAUSORE Grounded AI Investigation Layer
"""

import unittest
from backend.investigation.timeline import TimelineSummary, TimelineSegment
from backend.correlation.correlator import CorrelationFinding
from backend.investigation.hypothesis_engine import CandidateHypothesis
from backend.investigation.ai_reasoner import AIReasoner


class TestAIReasoner(unittest.TestCase):
    """Test suite verifying structured context generation, prompt grounding, and synthesis."""

    def setUp(self):
        self.reasoner = AIReasoner()
        self.timeline = TimelineSummary(
            investigation_id="inv-ai-test",
            total_events=120,
            start_time="2026-10-18T14:00:00Z",
            end_time="2026-10-18T14:28:30Z",
            segments=[
                TimelineSegment(
                    phase="active_window",
                    start_time="2026-10-18T14:00:15Z",
                    end_time="2026-10-18T14:28:00Z",
                    event_count=85,
                    error_count=42,
                    warning_count=10
                )
            ],
            service_distribution={"payment-service": 60, "checkout-api": 60},
            level_distribution={"ERROR": 42, "INFO": 78},
            top_error_fingerprints={"fp_db_timeout": 30},
            ordered_events=[]
        )
        self.correlations = [
            CorrelationFinding(
                id="corr-1",
                investigation_id="inv-ai-test",
                correlation_type="deployment_induced",
                status="CORRELATED",
                confidence=0.88,
                primary_service="payment-service",
                description="Canary deploy v2.4.1 occurred 2m prior to timeout spike.",
                evidence_points=["Commit a8f1bc4 deployed at 14:00:15 UTC"]
            )
        ]
        self.hypotheses = [
            CandidateHypothesis(
                id="hypo-1",
                investigation_id="inv-ai-test",
                candidate="Database connection pool exhaustion in payment-service",
                confidence=0.86,
                status="INFERRED",
                supporting_evidence=["Canary v2.4.1 deploy", "Connection acquisition latency spiked"],
                contradicting_evidence=["PostgreSQL CPU was 18%"],
                relevant_timeline_events=["evt_01"],
                affected_services=["payment-service", "checkout-api"],
                possible_contributing_factors=["Pool size configured too low"],
                missing_evidence=["JVM thread dump was not supplied"],
                recommended_verification=["Inspect DB_POOL_MAX_SIZE in container env"]
            ),
            CandidateHypothesis(
                id="hypo-2",
                investigation_id="inv-ai-test",
                candidate="Database deadlock",
                confidence=0.15,
                status="INFERRED",
                supporting_evidence=[],
                contradicting_evidence=["No deadlocks in postgres log"],
                relevant_timeline_events=[],
                affected_services=["postgres-core"],
                possible_contributing_factors=[],
                missing_evidence=[],
                recommended_verification=["Check pg_locks"]
            )
        ]

    def test_structured_context_generation(self):
        ctx = self.reasoner.build_structured_context(
            investigation_id="inv-ai-test",
            title="Checkout Outage",
            severity="SEV-1",
            environment="production",
            start_time="2026-10-18T14:00:00Z",
            end_time="2026-10-18T14:28:30Z",
            affected_services=["payment-service", "checkout-api"],
            timeline=self.timeline,
            anomalies=[],
            correlations=self.correlations,
            hypotheses=self.hypotheses
        )

        self.assertEqual(ctx.investigation_id, "inv-ai-test")
        self.assertEqual(len(ctx.candidate_hypotheses), 2)
        self.assertIn("JVM thread dump was not supplied", ctx.missing_telemetry_gaps)

        # Check prompt formatting
        prompt = self.reasoner.generate_prompt(ctx)
        self.assertIn("CONSTITUTIONAL RULES", prompt)
        self.assertIn("OBSERVED facts, CORRELATED relationships, and INFERRED deductions", prompt)
        self.assertIn("Database connection pool exhaustion", prompt)

    def test_synthesis_execution(self):
        ctx = self.reasoner.build_structured_context(
            investigation_id="inv-ai-test",
            title="Checkout Outage",
            severity="SEV-1",
            environment="production",
            start_time="2026-10-18T14:00:00Z",
            end_time="2026-10-18T14:28:30Z",
            affected_services=["payment-service", "checkout-api"],
            timeline=self.timeline,
            anomalies=[],
            correlations=self.correlations,
            hypotheses=self.hypotheses
        )

        synthesis = self.reasoner.synthesize(ctx)
        self.assertIn("Database connection pool exhaustion", synthesis.executive_summary)
        self.assertIn("Database deadlock", synthesis.competing_hypothesis_evaluation)
        self.assertTrue(len(synthesis.counter_factual_considerations) >= 2)
        self.assertTrue(len(synthesis.recommended_verification_queries) >= 1)
        self.assertTrue(len(synthesis.preventive_action_items) >= 2)


if __name__ == "__main__":
    unittest.main()
