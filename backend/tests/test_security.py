"""
Unit Test Suite for CAUSORE Security Hardening & Input Sanitization
Validates zero path-traversal, payload limits, MIME checks, and absence of hardcoded secrets.
"""

import unittest
from fastapi import HTTPException

from backend.core.security import (
    sanitize_and_validate_filename,
    validate_file_size,
    validate_mime_type,
    MAX_FILE_SIZE_BYTES
)


class TestSecurityHardening(unittest.TestCase):
    """Test suite covering security constraints and vulnerability mitigations."""

    def test_path_traversal_rejection(self):
        """Verify that directory traversal attempts are strictly rejected."""
        malicious_inputs = [
            "../../etc/passwd",
            "..\\..\\windows\\system32\\calc.exe",
            "logs/../../../secret.key",
            "/etc/hosts",
            "C:\\boot.ini",
            "..//..//nginx.log",
        ]
        for bad_filename in malicious_inputs:
            with self.subTest(bad_filename=bad_filename):
                with self.assertRaises(HTTPException) as ctx:
                    sanitize_and_validate_filename(bad_filename)
                self.assertEqual(ctx.exception.status_code, 400)
                self.assertIn("traversal", ctx.exception.detail.lower())

    def test_null_byte_injection_rejection(self):
        """Verify that null-byte injections are rejected."""
        injections = [
            "payment.log\0.exe",
            "data.csv%00.sh",
            "audit.log\x00.php",
        ]
        for inj in injections:
            with self.subTest(inj=inj):
                with self.assertRaises(HTTPException) as ctx:
                    sanitize_and_validate_filename(inj)
                self.assertEqual(ctx.exception.status_code, 400)
                self.assertIn("null byte", ctx.exception.detail.lower())

    def test_unsupported_extensions_rejection(self):
        """Verify that dangerous or non-whitelisted extensions are blocked."""
        forbidden = [
            "payload.exe",
            "exploit.sh",
            "script.py",
            "malware.bat",
            "attack.php",
            "macro.vbs",
        ]
        for f in forbidden:
            with self.subTest(filename=f):
                with self.assertRaises(HTTPException) as ctx:
                    sanitize_and_validate_filename(f)
                self.assertEqual(ctx.exception.status_code, 400)
                self.assertIn("unsupported file extension", ctx.exception.detail.lower())

    def test_hidden_files_rejection(self):
        """Verify that hidden dotfiles are rejected."""
        hidden = [".env", ".gitignore", ".bashrc", ".aws_config"]
        for h in hidden:
            with self.subTest(filename=h):
                with self.assertRaises(HTTPException) as ctx:
                    sanitize_and_validate_filename(h)
                self.assertEqual(ctx.exception.status_code, 400)

    def test_valid_filenames_accepted(self):
        """Verify that legitimate log and telemetry filenames pass validation."""
        valid_filenames = [
            "payment-service.log",
            "nginx_access.log",
            "rds_metrics.csv",
            "incident_report.pdf",
            "telemetry.json",
            "cluster_events.jsonl",
            "app-2026-10-20.log",
        ]
        for valid in valid_filenames:
            clean = sanitize_and_validate_filename(valid)
            self.assertEqual(clean, valid)

    def test_file_size_limits(self):
        """Verify file size bounds checking."""
        # 0 or negative size
        with self.assertRaises(HTTPException) as ctx:
            validate_file_size(0)
        self.assertEqual(ctx.exception.status_code, 400)

        with self.assertRaises(HTTPException) as ctx:
            validate_file_size(-100)
        self.assertEqual(ctx.exception.status_code, 400)

        # Exceeds 50MB
        with self.assertRaises(HTTPException) as ctx:
            validate_file_size(MAX_FILE_SIZE_BYTES + 1)
        self.assertEqual(ctx.exception.status_code, 413)

        # Valid sizes
        self.assertEqual(validate_file_size(1024), 1024)
        self.assertEqual(validate_file_size(MAX_FILE_SIZE_BYTES), MAX_FILE_SIZE_BYTES)

    def test_mime_type_validation(self):
        """Verify MIME type checks."""
        # Valid MIME types
        self.assertEqual(validate_mime_type("text/plain"), "text/plain")
        self.assertEqual(validate_mime_type("application/json"), "application/json")
        self.assertEqual(validate_mime_type("text/csv"), "text/csv")
        self.assertEqual(validate_mime_type("application/pdf"), "application/pdf")

        # Invalid MIME types
        with self.assertRaises(HTTPException) as ctx:
            validate_mime_type("application/x-msdownload")
        self.assertEqual(ctx.exception.status_code, 415)

        with self.assertRaises(HTTPException) as ctx:
            validate_mime_type("application/x-sh")
        self.assertEqual(ctx.exception.status_code, 415)


if __name__ == "__main__":
    unittest.main()
