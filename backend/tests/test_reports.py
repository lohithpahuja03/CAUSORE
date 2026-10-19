"""
Unit Tests for CAUSORE Report Generator & Multi-Format Exporter
"""

import json
import unittest
from backend.reports.generator import ReportGenerator


class TestReportGenerator(unittest.TestCase):
    """Test suite verifying report compilation and Markdown/JSON/HTML export formats."""

    def setUp(self):
        self.generator = ReportGenerator()
        self.sample_report_data = self.generator.compile_report(
            investigation_id="inv-rep-test",
            title="Gateway 504 Timeout Outage",
            severity="SEV-1",
            environment="production-us-east-1",
            duration_minutes=28,
            executive_summary="Payment-service canary deploy v2.4.1 caused connection starvation.",
            hypotheses=[
                {
                    "candidate": "Connection pool exhaustion",
                    "confidence": 0.88,
                    "status": "INFERRED",
                    "supporting_evidence": ["HikariCP timeout logged", "v2.4.1 deploy 2m prior"],
                    "contradicting_evidence": ["Postgres CPU was normal (18%)"],
                    "missing_evidence": ["JVM thread dump missing"],
                    "recommended_verification": ["Check DB_POOL_MAX_SIZE env var"],
                    "affected_services": ["payment-service", "checkout-api"]
                }
            ],
            anomalies=[
                {
                    "service": "payment-service",
                    "anomaly_type": "error_spike",
                    "score": 0.95,
                    "description": "Timeout rate spiked to 142/min"
                }
            ],
            critical_events=[],
            missing_evidence=["JVM thread dump not supplied"],
            action_items=["Add CI check for pool limit"]
        )

    def test_markdown_export(self):
        md = self.generator.export_markdown(self.sample_report_data)
        self.assertIn("# CAUSORE INVESTIGATION REPORT", md)
        self.assertIn("Gateway 504 Timeout Outage", md)
        self.assertIn("SEV-1", md)
        self.assertIn("Connection pool exhaustion", md)
        self.assertIn("HikariCP timeout logged", md)
        self.assertIn("Add CI check for pool limit", md)

    def test_json_export(self):
        json_str = self.generator.export_json(self.sample_report_data)
        parsed = json.loads(json_str)
        self.assertEqual(parsed["investigation_id"], "inv-rep-test")
        self.assertEqual(parsed["severity"], "SEV-1")
        self.assertEqual(len(parsed["top_hypotheses"]), 1)

    def test_html_export(self):
        html_str = self.generator.export_html(self.sample_report_data)
        self.assertIn("<!DOCTYPE html>", html_str)
        self.assertIn("<title>CAUSORE RCA:", html_str)
        self.assertIn("Connection pool exhaustion", html_str)


if __name__ == "__main__":
    unittest.main()
