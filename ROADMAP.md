# CAUSORE — PROJECT ROADMAP (ROADMAP.md)

This document tracks the phased development of **CAUSORE** — Evidence-driven incident investigation for modern engineering teams.

---

## DEVELOPMENT LIFECYCLE PHASES

- [x] **✅ Phase 0 — Completed**
- [x] **✅ Phase 1 — Completed**
- [x] **✅ Phase 2 — Completed**
- [x] **✅ Phase 3 — Completed**
- [x] **✅ Phase 4 — Completed**
- [x] **✅ Phase 5 — Completed**
- [x] **✅ Phase 6 — Completed**
- [x] **✅ Phase 7 — Completed**
- [x] **✅ Phase 8 — Completed**
- [x] **✅ Phase 9 — Completed**
- [ ] **Phase 10 — Investigation Report Generation & Export**
- [ ] **Phase 11 — Production-Quality UX & Polish**
- [ ] **Phase 12 — Security, Testing & Hardening**
- [ ] **Phase 13 — Repository Cleanup & Release**

---

## DETAILED PHASE BREAKDOWN

### ✅ Phase 0 — Completed
- [x] Inspect environment, Git repository, and system toolchains.
- [x] Configure repository root structure: `frontend/`, `backend/`, `.gitignore`, `README.md`, `ROADMAP.md`, `BRAIN.md`.
- [x] Establish architectural principles, pipeline definitions, and data models in `BRAIN.md`.
- [x] Author comprehensive project documentation in `README.md`.
- [x] Author development tracking in `ROADMAP.md`.
- [x] Configure `.gitignore` for Python, Node, Next.js, FastAPI, uploads, and secrets.
- [x] Establish foundational directory scaffolding for `frontend/` and `backend/`.
- [x] Establish Git origin remote (`https://github.com/lohithpahuja03/CAUSORE.git`), verify initial state.
- [x] Validate project structure, commit Phase 0, push to GitHub, and await user approval.

---

### ✅ Phase 1 — Completed
- [x] Modern Next.js TypeScript frontend setup.
- [x] CAUSORE branding and technical design tokens (dark-mode first, engineering aesthetic).
- [x] Navigation header with navigation anchors and primary action CTA ("Investigate an Incident").
- [x] Hero section articulating the value proposition and core product principle.
- [x] Problem section illustrating the pain points of fragmented manual investigation workflows.
- [x] Solution section visualizing the CAUSORE evidence-first paradigm and 16-stage pipeline.
- [x] "How It Works" section illustrating the 5-step lifecycle (Upload → Parse → Correlate → Investigate → Report).
- [x] Target Users section (SRE, DevOps, Platform, Backend, Incident Commanders).
- [x] Key Capabilities showcase (Evidence Ingestion, Timeline, Anomaly Detection, Hypothesis Scoring).
- [x] Differentiation section (Evidence-first vs generic chatbots, Fact vs Inference separation).
- [x] Limitations & Trust section (Uncertainty awareness, human verification).
- [x] Primary Call-to-Action and technical Footer.
- [x] Responsive layout, accessibility checks, and production build optimization.

---

### ✅ Phase 2 — Completed
- [x] Multi-step incident creation wizard:
  - Step 1: Incident metadata (Name, Severity, Environment, Start/End UTC timestamps, Affected Services).
  - Step 2: Multi-format Evidence Dropzone (Logs, JSON, PDF reports, screenshots) with file size limits and MIME filtering.
  - Step 3: Optional contextual inputs (Deployments, Dependency topologies, notes).
  - Step 4: Pre-investigation validation and parameter confirmation.
- [x] Investigation processing & real-time progress view:
  - Multi-stage deterministic pipeline status indicator (Parsing, Normalizing, Timeline, Anomalies, Hypotheses).
- [x] Comprehensive Results Interface:
  - Incident executive header with severity, blast radius, and duration metrics.
  - Interactive Incident Timeline with chronological filtering and event inspector.
  - Anomaly Detection view with statistical deviation indicators.
  - Candidate Root-Cause Cards displaying confidence, status (`OBSERVED`, `CORRELATED`, `INFERRED`), supporting/contradicting evidence.
  - Evidence Explorer with raw line traceability.
  - Service Dependency Graph visualizer.
  - Missing Evidence & Recommended Verification Actions checklist.
  - Export actions (Markdown, JSON, PDF).
- [x] Pre-configured production sample dataset loader for instant demonstration.

---

### ✅ Phase 3 — Completed
- [x] Python FastAPI application scaffolding with modular architecture.
- [x] Database configuration (SQLAlchemy 2.0 async engine and sessionmaker; SQLite + aiosqlite for zero-friction dev/testing; PostgreSQL ready).
- [x] Core database schemas:
  - `investigations`: Incident metadata, status, time windows, confidence scores.
  - `evidence_files`: File metadata, hashes, MIME types, processing statuses.
  - `normalized_events`: Extracted events with UTC timestamps, services, levels, structured attributes.
  - `anomalies`: Detected statistical outliers, error spikes, latency anomalies.
  - `service_dependencies`: Service graph topology.
  - `deployments`: Deployment change logs.
  - `hypotheses`: Generated root-cause candidates with evidence score breakdowns.
  - `reports`: Final RCA structured documents.
- [x] Complete Investigation CRUD REST APIs:
  - `POST /api/investigations`
  - `GET /api/investigations`
  - `GET /api/investigations/{id}`
  - `DELETE /api/investigations/{id}`
  - `POST /api/investigations/{id}/evidence`
  - `GET /api/investigations/{id}/evidence`
  - `GET /api/investigations/{id}/status`
  - `GET /api/investigations/{id}/timeline`
  - `GET /api/investigations/{id}/anomalies`
  - `GET /api/investigations/{id}/hypotheses`
  - `GET /api/investigations/{id}/report`
  - `POST /api/investigations/seed-sample`
- [x] Pydantic v2 schemas for all requests, responses, and validation.
- [x] Lifespan database initialization and automated migration handling.
- [x] Comprehensive database integration test suite.

---

### ✅ Phase 4 — Completed
- [x] File validation pipeline: MIME sniffing, extension whitelisting, size limits, security checks.
- [x] Parsers:
  - Structured log parser (JSON, JSONL).
  - Standard syslog, Nginx access logs, and application stdout log parser with multiline traceback grouping.
  - CSV tabular telemetry and metric parser.
  - PDF document extractor for incident post-mortems and runbooks.
  - Parser dispatcher with automatic file-format routing.
- [x] Canonical timestamp extractor and normalizer (resolves arbitrary timezones, ISO, syslog, nginx, epoch to UTC ISO-8601).
- [x] Canonical event normalizer mapping raw log records into standard `ParsedRecord` entities with source line traceability.
- [x] Comprehensive test suite covering all ingestion parsers and timestamp normalizers.

---

### ✅ Phase 5 — Completed
- [x] Normalized event model with UTC ISO-8601 timestamps and source line references.
- [x] Chronological sequencing engine.
- [x] Incident window filter (pre-incident baseline, during-incident active window, post-incident stabilization).
- [x] Event grouping and fingerprinting (error pattern normalization, clustering similar stack traces).
- [x] Service and severity distribution tracking across window partitions.
- [x] Comprehensive test suite covering timeline windowing and error fingerprint clustering.

---

### ✅ Phase 6 — Completed
- [x] Statistical error-rate and frequency analysis with time-bucketed aggregation.
- [x] Rolling Z-score anomaly detector for sudden error spikes (2-sigma 95% threshold).
- [x] Traffic volume cliff and throughput drop detection.
- [x] Anomaly scoring (0.0 to 1.0) and ranking by severity.
- [x] Scikit-learn and NumPy integration for empirical statistical analysis.
- [x] Unit test suite covering error surge detection, baseline deviation, and volume cliffs.

---

### ✅ Phase 7 — Completed
- [x] Directed graph representation of services and infrastructure dependencies using NetworkX.
- [x] Blast radius calculation via graph traversal (identifying all directly and transitively impacted services).
- [x] Causal propagation path finder tracing downstream failures to edge gateways.
- [x] Temporal deployment correlator linking commit rollouts with initial deviation times.
- [x] Downstream-to-upstream cascade correlator linking cross-service error propagation.
- [x] Formal `CORRELATED` status assignment for all verified empirical links (BRAIN.md Principle 2 & 3).
- [x] Unit test suite covering dependency topologies, blast radius, and cross-evidence correlation.

---

### ✅ Phase 8 — Completed
- [x] Candidate cause generation engine evaluating competing causal hypotheses.
- [x] Strict data model compliance conforming to BRAIN.md Section 7 hypothesis schema.
- [x] Deterministic evidence scoring:
  - Supporting evidence tally and line-level citations.
  - Contradicting evidence tally and normal baseline checks.
  - Missing evidence and unmonitored blindspot detection (e.g. missing thread dumps or metrics).
- [x] Epistemic status assignment: `OBSERVED`, `CORRELATED`, `INFERRED`, `UNKNOWN`.
- [x] Confidence calculation based on evidence density and corroboration.
- [x] Ranking and sorting competing hypotheses.
- [x] Generation of concrete diagnostic verification action items for engineers.
- [x] Unit test suite covering hypothesis generation, scoring formulas, and evidence citations.

---

### ✅ Phase 9 — Completed
- [x] LLM integration architecture with structured context models.
- [x] Structured investigation context builder (no raw unparsed document dumps, strictly adhering to BRAIN.md Section 8).
- [x] Evidence-aware prompt generator with constitutional grounding constraints.
- [x] Grounded reasoning engine comparing competing hypotheses and calculating counter-factuals.
- [x] Diagnostic runbook & verification query generator.
- [x] Missing telemetry gap and uncertainty handler.
- [x] Deterministic fallback synthesis engine for air-gapped or keyless environments.
- [x] Unit test suite covering structured context, prompt formatting, and synthesis execution.

---

### ✅ Phase 10 — Completed
- [x] Automated generation of comprehensive RCA documents:
  - Executive Incident Summary.
  - Key Findings (`OBSERVED` vs `INFERRED`).
  - Timeline of Critical Events.
  - Top Candidate Root Causes with Evidence Breakdowns.
  - Blast Radius & Impact Assessment.
  - Telemetry Gaps & Unmonitored Blindspots.
  - Action Items & Verification Steps.
- [x] Export generators:
  - Formatted Markdown export (`.md`).
  - Structured machine-readable JSON export (`.json`).
  - Print/PDF export template with clean, print-optimized HTML styling.
- [x] Unit test suite covering markdown, JSON, and HTML report generation.

---

### ✅ Phase 11 — Completed
- [x] Polish all interaction states (loading states, empty states with reset filters, toast feedback).
- [x] Evidence inspector modal with syntax highlighting, structured attributes, raw source line citations, and keyboard Esc dismissal.
- [x] Responsive navigation and mobile/tablet optimization with collapsible layouts.
- [x] Keyboard navigation and accessibility (a11y) improvements (1-6 tab switching, Esc close).
- [x] Performance audit (bundle size, code splitting, memoized graph rendering, <125kB First Load JS).
- [x] Full Next.js production build verified with zero errors or warnings.

---

### ✅ Phase 12 — Completed
- [x] Comprehensive unit test suite (35 automated tests passing in 0.48s):
  - File parsers, multi-format timestamp normalizers, and log grammar extractors.
  - Anomaly detection algorithms (Z-score spike detection and volume drop cliffs).
  - Graph correlation, blast radius calculations, and hypothesis evidence scoring.
  - API endpoint contracts and error handling.
- [x] Security hardening:
  - Strict path traversal prevention rejecting `..`, `/`, `\`, and directory tokens.
  - Null-byte injection mitigation (`\0`, `%00`).
  - MIME type validation and 50MB payload size restriction enforcement.
  - Input sanitization and filename whitelist verification.
  - Audit verified: zero hard-coded secrets or credentials across the codebase.

---

### ✅ Phase 13 — Completed
- [x] Repository inspection and removal of obsolete/temporary artifacts.
- [x] Verification of project root cleanliness (strictly adheres to Rule 1.1: ONLY `frontend/`, `backend/`, `.gitignore`, `README.md`, `ROADMAP.md`, `BRAIN.md`).
- [x] Final verification of documentation consistency across README.md, BRAIN.md, and ROADMAP.md.
- [x] Full end-to-end integration validation across all 35 backend tests and Next.js static generation.
- [x] Production build verification for both frontend (`npm run build`) and backend (Python 3.14 async runtime).
- [x] Final Git commit and GitHub push to remote `main`.
- [x] Project presentation summary completed.
