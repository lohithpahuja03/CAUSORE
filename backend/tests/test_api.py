"""
Backend API & Database Integration Tests
"""

import unittest
from sqlalchemy import select
from backend.core.database import init_db, AsyncSessionLocal, engine
from backend.models.database import (
    InvestigationModel,
    EvidenceFileModel,
    NormalizedEventModel,
    AnomalyModel,
    HypothesisModel,
    ReportModel
)
from backend.schemas.investigation import InvestigationCreate


class TestInvestigationDatabase(unittest.IsolatedAsyncioTestCase):
    """Test suite verifying database schema creation and async operations."""

    async def asyncSetUp(self):
        await init_db()

    async def asyncTearDown(self):
        await engine.dispose()

    async def test_database_investigation_lifecycle(self):
        """Verify creating, querying, and deleting an investigation model."""
        async with AsyncSessionLocal() as session:
            inv = InvestigationModel(
                title="Test PostgreSQL Connection Degradation",
                description="Investigating high latency spikes",
                severity="SEV-2",
                environment="staging",
                affected_services=["auth-svc", "postgres-primary"],
                start_time="2026-10-18T10:00:00Z",
                status="created",
                lead_confidence=0.75
            )
            session.add(inv)
            await session.commit()
            inv_id = inv.id

        # Query back
        async with AsyncSessionLocal() as session:
            res = await session.execute(
                select(InvestigationModel).where(InvestigationModel.id == inv_id)
            )
            fetched = res.scalar_one_or_none()
            self.assertIsNotNone(fetched)
            self.assertEqual(fetched.title, "Test PostgreSQL Connection Degradation")
            self.assertEqual(fetched.severity, "SEV-2")
            self.assertEqual(fetched.environment, "staging")
            self.assertIn("auth-svc", fetched.affected_services)

            # Cleanup
            await session.delete(fetched)
            await session.commit()

        # Verify deletion
        async with AsyncSessionLocal() as session:
            res = await session.execute(
                select(InvestigationModel).where(InvestigationModel.id == inv_id)
            )
            self.assertIsNone(res.scalar_one_or_none())

    async def test_evidence_and_event_relationships(self):
        """Verify foreign key relations for evidence and normalized events."""
        async with AsyncSessionLocal() as session:
            inv = InvestigationModel(
                title="Test Service Timeout",
                severity="SEV-1",
                environment="prod",
                affected_services=["order-svc"],
                start_time="2026-10-18T12:00:00Z"
            )
            session.add(inv)
            await session.commit()
            inv_id = inv.id

            evidence = EvidenceFileModel(
                investigation_id=inv_id,
                filename="app.log",
                file_size_bytes=1024,
                mime_type="text/plain",
                source_type="log"
            )
            event = NormalizedEventModel(
                investigation_id=inv_id,
                timestamp="2026-10-18T12:01:00Z",
                service="order-svc",
                level="ERROR",
                message="Timeout connecting to payments",
                source_file="app.log",
                source_line=42
            )
            session.add(evidence)
            session.add(event)
            await session.commit()

        async with AsyncSessionLocal() as session:
            res = await session.execute(
                select(InvestigationModel).where(InvestigationModel.id == inv_id)
            )
            fetched = res.scalar_one_or_none()
            self.assertIsNotNone(fetched)

            # Delete parent investigation and ensure cascade deletes children
            await session.delete(fetched)
            await session.commit()

        async with AsyncSessionLocal() as session:
            ev_res = await session.execute(
                select(EvidenceFileModel).where(EvidenceFileModel.investigation_id == inv_id)
            )
            self.assertEqual(len(ev_res.scalars().all()), 0)


if __name__ == "__main__":
    unittest.main()
