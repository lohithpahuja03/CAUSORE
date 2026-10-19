"""
Unit Tests for CAUSORE Statistical Anomaly Detection Engine
"""

import unittest
from backend.parsers.base import ParsedRecord
from backend.analyzers.anomaly import AnomalyEngine


class TestAnomalyEngine(unittest.TestCase):
    """Test suite verifying z-score spike detection and throughput cliff isolation."""

    def setUp(self):
        self.engine = AnomalyEngine()

    def test_error_spike_detection(self):
        # 5 baseline minutes with 0-1 errors, then sudden spike to 50 errors
        events = []
        for minute in range(10, 15):
            for _ in range(2):
                events.append(
                    ParsedRecord(
                        timestamp=f"2026-10-18T14:{minute}:00Z",
                        service="payment-svc",
                        level="INFO",
                        message="Routine request",
                        source_file="app.log"
                    )
                )

        # Spike at 14:15
        for _ in range(45):
            events.append(
                ParsedRecord(
                    timestamp="2026-10-18T14:15:30Z",
                    service="payment-svc",
                    level="ERROR",
                    message="Connection timeout",
                    source_file="app.log"
                )
            )

        anomalies = self.engine.detect_anomalies("inv-test-anom", events)
        self.assertTrue(len(anomalies) >= 1)
        spike = anomalies[0]
        self.assertEqual(spike.service, "payment-svc")
        self.assertEqual(spike.anomaly_type, "error_spike")
        self.assertTrue(spike.score >= 0.8)
        self.assertEqual(spike.observed_value, 45.0)

    def test_volume_drop_detection(self):
        # High volume of requests (50 per minute) for 3 minutes, then drop to 2
        events = []
        for minute in range(10, 13):
            for i in range(50):
                events.append(
                    ParsedRecord(
                        timestamp=f"2026-10-18T14:{minute}:{i:02d}Z",
                        service="api-gateway",
                        level="INFO",
                        message="HTTP 200 OK",
                        source_file="gateway.log"
                    )
                )

        # Drop at 14:13
        for i in range(2):
            events.append(
                ParsedRecord(
                    timestamp=f"2026-10-18T14:13:{i:02d}Z",
                    service="api-gateway",
                    level="INFO",
                    message="HTTP 200 OK",
                    source_file="gateway.log"
                )
            )

        anomalies = self.engine.detect_anomalies("inv-test-drop", events)
        volume_drops = [a for a in anomalies if a.anomaly_type == "volume_drop"]
        self.assertTrue(len(volume_drops) >= 1)
        self.assertEqual(volume_drops[0].service, "api-gateway")


if __name__ == "__main__":
    unittest.main()
