"""
Unit Tests for CAUSORE Service Graph & Cross-Evidence Correlation Engine
"""

import unittest
from backend.analyzers.anomaly import AnomalyItem
from backend.correlation.graph import ServiceDependencyGraph
from backend.correlation.correlator import CorrelationEngine


class TestDependencyGraph(unittest.TestCase):
    """Test suite verifying graph topology, blast radius, and causal paths."""

    def setUp(self):
        self.graph = ServiceDependencyGraph()
        # Architecture: api-gateway -> checkout-api -> payment-service -> postgres-core
        self.graph.add_dependency("api-gateway", "checkout-api")
        self.graph.add_dependency("checkout-api", "payment-service")
        self.graph.add_dependency("payment-service", "postgres-core")

    def test_blast_radius(self):
        # If payment-service fails, who is impacted?
        # api-gateway and checkout-api depend on payment-service
        impacted = self.graph.get_blast_radius("payment-service")
        self.assertIn("payment-service", impacted)
        self.assertIn("checkout-api", impacted)
        self.assertIn("api-gateway", impacted)
        self.assertNotIn("postgres-core", impacted) # postgres does not depend on payment-service

    def test_causal_path(self):
        paths = self.graph.find_causal_paths("payment-service", "api-gateway")
        self.assertEqual(len(paths), 1)
        self.assertEqual(paths[0], ["api-gateway", "checkout-api", "payment-service"])


class TestCorrelationEngine(unittest.TestCase):
    """Test suite verifying temporal deployment and cascade correlation."""

    def setUp(self):
        self.graph = ServiceDependencyGraph()
        self.graph.add_dependency("api-gateway", "checkout-api")
        self.graph.add_dependency("checkout-api", "payment-service")
        self.correlator = CorrelationEngine(self.graph)

    def test_deployment_to_anomaly_correlation(self):
        deployments = [
            {
                "service": "payment-service",
                "version": "v2.4.1",
                "commit_sha": "a8f1bc4123",
                "timestamp": "2026-10-18T14:00:15Z"
            }
        ]
        anomalies = [
            AnomalyItem(
                id="anom-01",
                investigation_id="inv-01",
                timestamp="2026-10-18T14:02:15Z",
                service="payment-service",
                anomaly_type="error_spike",
                score=0.92,
                description="DB connection timeout surge",
                baseline_value=0.0,
                observed_value=50.0
            ),
            AnomalyItem(
                id="anom-02",
                investigation_id="inv-01",
                timestamp="2026-10-18T14:03:02Z",
                service="api-gateway",
                anomaly_type="volume_drop",
                score=0.91,
                description="504 gateway timeouts",
                baseline_value=500.0,
                observed_value=10.0
            )
        ]

        findings = self.correlator.correlate("inv-01", anomalies, deployments)
        self.assertTrue(len(findings) >= 2)

        # Check deployment correlation
        dep_findings = [f for f in findings if f.correlation_type == "deployment_induced"]
        self.assertTrue(len(dep_findings) >= 1)
        self.assertEqual(dep_findings[0].status, "CORRELATED")
        self.assertIn("a8f1bc4", dep_findings[0].description)

        # Check cascade correlation
        cascade_findings = [f for f in findings if f.correlation_type == "downstream_cascade"]
        self.assertTrue(len(cascade_findings) >= 1)
        self.assertEqual(cascade_findings[0].primary_service, "payment-service")
        self.assertEqual(cascade_findings[0].related_service, "api-gateway")


if __name__ == "__main__":
    unittest.main()
