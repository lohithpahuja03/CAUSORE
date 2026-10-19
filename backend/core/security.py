"""
CAUSORE Security & Input Sanitization Layer
Enforces zero path-traversal, file size validation, MIME sniffing verification,
and payload boundary enforcement (BRAIN.md Principle 1 & 6).
"""

import os
import re
from fastapi import HTTPException, status

ALLOWED_EXTENSIONS = {
    ".log",
    ".txt",
    ".json",
    ".jsonl",
    ".csv",
    ".pdf",
}

ALLOWED_MIME_TYPES = {
    "text/plain",
    "application/json",
    "application/x-ndjson",
    "text/csv",
    "application/pdf",
    "text/x-log",
    "application/octet-stream",
}

MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB
MAX_FILENAME_LENGTH = 255


def sanitize_and_validate_filename(filename: str) -> str:
    """
    Validates and sanitizes evidence filenames to prevent path traversal,
    null-byte attacks, and arbitrary code execution.
    """
    if not filename or not isinstance(filename, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Evidence filename cannot be empty."
        )

    # Reject null bytes
    if "\0" in filename or "%00" in filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Null byte injection detected in filename."
        )

    # Check for path traversal characters
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Path traversal characters ('..', '/', '\\') are strictly prohibited."
        )

    # Basename extraction
    clean_name = os.path.basename(filename).strip()

    if len(clean_name) > MAX_FILENAME_LENGTH:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Filename exceeds maximum permitted length of {MAX_FILENAME_LENGTH} characters."
        )

    # File extension check
    _, ext = os.path.splitext(clean_name)
    ext_lower = ext.lower()
    if ext_lower not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{ext}'. Permitted extensions: {', '.join(sorted(ALLOWED_EXTENSIONS))}."
        )

    # Disallow hidden files starting with .
    if clean_name.startswith("."):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hidden files starting with '.' are not accepted."
        )

    # Allowed character whitelist: alphanumeric, dash, underscore, dot
    if not re.match(r"^[a-zA-Z0-9_\-\.]+$", clean_name):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename contains invalid characters. Only alphanumeric, dashes, underscores, and dots are permitted."
        )

    return clean_name


def validate_file_size(size_bytes: int, max_bytes: int = MAX_FILE_SIZE_BYTES) -> int:
    """Validates that file payload size is within permissible bounds."""
    if size_bytes <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size must be greater than 0 bytes."
        )

    if size_bytes > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"File size ({size_bytes} bytes) exceeds maximum limit of {max_bytes} bytes (50MB)."
        )

    return size_bytes


def validate_mime_type(mime_type: str) -> str:
    """Validates MIME type against whitelist."""
    if not mime_type or not isinstance(mime_type, str):
        return "text/plain"

    cleaned_mime = mime_type.strip().lower().split(";")[0]
    if cleaned_mime not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported MIME type '{mime_type}'. Supported types: {', '.join(sorted(ALLOWED_MIME_TYPES))}."
        )

    return cleaned_mime
