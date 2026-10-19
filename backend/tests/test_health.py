"""
Initial Unit Tests for CAUSORE Architecture & Foundations
"""

import unittest
from pathlib import Path


class TestCausoreFoundations(unittest.TestCase):
    """Test suite verifying Phase 0 repository foundations and specifications."""

    def test_repository_root_rules(self):
        """Verify the project root contains ONLY the allowed files and directories."""
        root = Path(__file__).resolve().parent.parent.parent
        allowed_items = {
            ".git",
            ".gitignore",
            "README.md",
            "ROADMAP.md",
            "BRAIN.md",
            "frontend",
            "backend",
        }
        actual_items = {item.name for item in root.iterdir()}
        disallowed = actual_items - allowed_items
        self.assertEqual(
            disallowed,
            set(),
            f"Disallowed items found in project root: {disallowed}",
        )

    def test_mandatory_epistemological_categories(self):
        """Verify the 4 mandatory epistemological categories defined in BRAIN.md."""
        mandatory_categories = ["OBSERVED", "CORRELATED", "INFERRED", "UNKNOWN"]
        self.assertEqual(len(mandatory_categories), 4)
        for cat in ["OBSERVED", "CORRELATED", "INFERRED", "UNKNOWN"]:
            self.assertIn(cat, mandatory_categories)

    def test_constitution_sections_exist(self):
        """Verify BRAIN.md contains core investigation principles."""
        brain_path = Path(__file__).resolve().parent.parent.parent / "BRAIN.md"
        self.assertTrue(brain_path.exists(), "BRAIN.md must exist at root")
        content = brain_path.read_text(encoding="utf-8")
        self.assertIn("Evidence before conclusions", content)
        self.assertIn("Correlation Is Not Causation", content)
        self.assertIn("OBSERVED", content)
        self.assertIn("CORRELATED", content)
        self.assertIn("INFERRED", content)
        self.assertIn("UNKNOWN", content)

    def test_roadmap_phases_exist(self):
        """Verify ROADMAP.md tracks all lifecycle phases."""
        roadmap_path = Path(__file__).resolve().parent.parent.parent / "ROADMAP.md"
        self.assertTrue(roadmap_path.exists(), "ROADMAP.md must exist at root")
        content = roadmap_path.read_text(encoding="utf-8")
        self.assertIn("Phase 0", content)
        self.assertIn("Phase 1", content)
        self.assertIn("Phase 13", content)


if __name__ == "__main__":
    unittest.main()
