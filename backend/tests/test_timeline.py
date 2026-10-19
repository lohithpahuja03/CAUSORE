"""
Unit Tests for CAUSORE Incident Timeline Engine
"""

import unittest
from backend.parsers.base import ParsedRecord
from backend.investigation.timeline import TimelineEngine


class TestTimelineEngine(unittest.TestCase):
    """Test suite verifying chronological ordering, window segmentation, and error grouping."""

    def setUp(self):
        self.engine = TimelineEngine()
        self.sample_events = [
            ParsedRecord(
                timestamp="2026-10-18T13:50:00Z",
                service="payment-svc",
                level="INFO",
                message="Routine health check",
                source_file="app.log",
                fingerprint="fp_health"
            ),
            ParsedRecord(
                timestamp="2026-10-18T14:05:00Z",
                service="payment-svc",
                level="ERROR",
                message="PSQLException: connection timeout",
                source_file="app.log",
                fingerprint="fp_db_timeout"
            ),
            ParsedRecord(
                timestamp="2026-10-18T14:06:00Z",
                service="payment-svc",
                level="ERROR",
                message="PSQLException: connection timeout",
                source_file="app.log",
                fingerprint="fp_db_timeout"
            ),
            ParsedRecord(
                timestamp="2026-10-18T14:35:00Z",
                service="payment-svc",
                level="INFO",
                message="Recovery completed",
                source_file="app.log",
                fingerprint="fp_recovery"
            ),
        ]

    def test_chronological_ordering(self):
        # Reverse list to verify sorting
        reversed_events = list(reversed(self.sample_events))
        summary = self.engine.build_timeline(
            investigation_id="test-inv-01",
            events=reversed_events,
            incident_start="2026-10-18T14:00:00Z",
            incident_end="2026-10-18T14:30:00Z"
        )

        self.assertEqual(summary.total_events, 4)
        self.assertEqual(summary.ordered_events[0].timestamp, "2026-10-18T13:50:00Z")
        self.assertEqual(summary.ordered_events[-1].timestamp, "2026-10-18T14:35:00Z")

    def test_window_segmentation(self):
        summary = self.engine.build_timeline(
            investigation_id="test-inv-01",
            events=self.sample_events,
            incident_start="2026-10-18T14:00:00Z",
            incident_end="2026-10-18T14:30:00Z"
        )

        self.assertEqual(len(summary.segments), 3)
        pre, active, post = summary.segments[0], summary.segments[1], summary.segments[2]

        self.assertEqual(pre.phase, "pre_incident")
        self.assertEqual(pre.event_count, 1)

        self.assertEqual(active.phase, "active_window")
        self.assertEqual(active.event_count, 2)
        self.assertEqual(active.error_count, 2)

        self.assertEqual(post.phase, "post_incident")
        self.assertEqual(post.event_count, 1)

    def test_error_fingerprint_clustering(self):
        summary = self.engine.build_timeline(
            investigation_id="test-inv-01",
            events=self.sample_events,
            incident_start="2026-10-18T14:00:00Z"
        )

        self.assertIn("fp_db_timeout", summary.top_error_fingerprints)
        self.assertEqual(summary.top_error_fingerprints["fp_db_timeout"], 2)


if __name__ == "__main__":
    unittest.main()
