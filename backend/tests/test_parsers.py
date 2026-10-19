"""
Unit Tests for CAUSORE Evidence Ingestion & Parsing Engines
"""

import unittest
from backend.parsers.timestamp import normalize_timestamp, extract_timestamp_from_line
from backend.parsers.json_parser import JsonParser
from backend.parsers.log_parser import LogParser
from backend.parsers.csv_parser import CsvParser
from backend.parsers.dispatcher import parse_evidence_content


class TestTimestampNormalizer(unittest.TestCase):
    """Test suite verifying canonical UTC ISO-8601 normalization."""

    def test_iso_timestamp(self):
        ts = normalize_timestamp("2026-10-18T14:02:15Z")
        self.assertEqual(ts, "2026-10-18T14:02:15Z")

    def test_nginx_timestamp(self):
        ts = normalize_timestamp("18/Oct/2026:14:02:15 +0000")
        self.assertEqual(ts, "2026-10-18T14:02:15Z")

    def test_epoch_timestamp(self):
        # 1792332135 -> valid timestamp in future 2026
        ts = normalize_timestamp("1792332135")
        self.assertTrue(ts.endswith("Z"))
        self.assertIn("T", ts)

    def test_line_prefix_extraction(self):
        line = "2026-10-18 14:02:15.112 [ERROR] payment-service: Connection timeout"
        ts, msg = extract_timestamp_from_line(line)
        self.assertIsNotNone(ts)
        self.assertTrue(ts.startswith("2026-10-18T14:02:15"))
        self.assertIn("[ERROR] payment-service", msg)


class TestJsonParser(unittest.TestCase):
    """Test suite verifying structured JSON and streaming JSONL parsing."""

    def setUp(self):
        self.parser = JsonParser()

    def test_json_array(self):
        content = """[
            {"timestamp": "2026-10-18T14:00:00Z", "service": "payment-svc", "level": "INFO", "message": "Canary deployed"},
            {"timestamp": "2026-10-18T14:02:00Z", "service": "payment-svc", "level": "ERROR", "message": "Pool exhausted"}
        ]"""
        records = self.parser.parse(content, "payment.json")
        self.assertEqual(len(records), 2)
        self.assertEqual(records[0].level, "INFO")
        self.assertEqual(records[1].level, "ERROR")
        self.assertEqual(records[0].service, "payment-svc")

    def test_jsonl_streaming(self):
        content = """{"ts": "2026-10-18T14:00:00Z", "msg": "pod started", "app": "checkout"}
{"ts": "2026-10-18T14:01:00Z", "msg": "504 timeout", "app": "checkout", "level": "error"}"""
        records = self.parser.parse(content, "checkout.jsonl")
        self.assertEqual(len(records), 2)
        self.assertEqual(records[1].level, "ERROR")


class TestLogParser(unittest.TestCase):
    """Test suite verifying unstructured log and stack trace multiline parsing."""

    def setUp(self):
        self.parser = LogParser()

    def test_multiline_stacktrace_grouping(self):
        content = """2026-10-18 14:02:15 [ERROR] payment-service: PSQLException: connection timed out
    at org.postgresql.core.Connection.open(Connection.java:412)
    at org.postgresql.pool.HikariPool.getConnection(HikariPool.java:188)
2026-10-18 14:03:00 [INFO] payment-service: Retrying connection attempt"""

        records = self.parser.parse(content, "payment.log")
        self.assertEqual(len(records), 2)
        self.assertEqual(records[0].level, "ERROR")
        self.assertIn("at org.postgresql", records[0].message)
        self.assertEqual(records[1].level, "INFO")


class TestCsvParser(unittest.TestCase):
    """Test suite verifying CSV metric parsing."""

    def test_csv_metrics_parsing(self):
        content = """timestamp,service,cpu_percent,active_connections,error_rate
2026-10-18T14:00:00Z,postgres-core,18.4,10,0.0
2026-10-18T14:05:00Z,postgres-core,19.1,10,0.0"""
        parser = CsvParser()
        records = parser.parse(content, "rds_metrics.csv")
        self.assertEqual(len(records), 2)
        self.assertEqual(records[0].service, "rds-metrics")
        self.assertIn("cpu_percent", records[0].attributes)


if __name__ == "__main__":
    unittest.main()
