# CAUSORE — PROJECT ROADMAP (ROADMAP.md)

This document tracks the phased development of **CAUSORE** — Evidence-driven incident investigation for modern engineering teams.

---

## DEVELOPMENT LIFECYCLE PHASES

- [x] **✅ Phase 0 — Completed**
- [x] **✅ Phase 1 — Completed**
- [x] **✅ Phase 2 — Completed**
- [x] **✅ Phase 3 — Completed**
- [x] **✅ Phase 4 — Completed**
- [ ] **Phase 5 — Incident Timeline Engine**
- [ ] **Phase 6 — Anomaly Detection Engine**
- [ ] **Phase 7 — Dependency & Cross-Evidence Correlation Engine**
- [ ] **Phase 8 — Root-Cause Hypothesis Engine**
- [ ] **Phase 9 — AI Investigation & Reasoning Layer**
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

### 5 ⬜ Phase 5 — Incident Timeline Engine
- [ ] Chronological sequencing engine.
- [ ] Incident window filter (pre-incident baseline, during-incident active window, post-incident stabilization).
- [ ] Event grouping and fingerprinting (error pattern normalization, clustering similar stack traces).
- [ ] Event categorization (deployment, config_change, error, warning, state_change).
- [ ] Timeline query API with search, service filtering, and level filtering.
- [ ] Frontend integration with interactive Timeline component.

---

### ⬜ Phase 6 — Anomaly Detection Engine
- [ ] Statistical error frequency analysis (spike detection, baseline deviation).
- [ ] Rate-of-change and z-score anomaly detector.
- [ ] Scikit-learn integration for log pattern density / isolation forest outlier scoring.
- [ ] Error cliff detection (sudden drop in 200 OKs vs sudden spike in 5xx errors).
- [ ] Anomaly ranking and severity assignment.
- [ ] Anomaly REST APIs and frontend visualization.

---

### ⬜ Phase 7 — Dependency & Cross-Evidence Correlation Engine
- [ ] Directed graph representation of services and infrastructure dependencies.
- [ ] Temporal proximity correlator (linking deployments and config changes to subsequent error spikes).
- [ ] Causal propagation analysis (tracing errors from downstream services upstream to client-facing gateways).
- [ ] Blast radius calculation (quantifying affected downstream services).
- [ ] Cross-evidence correlation matrix (linking visual dashboard timestamps with log records).
- [ ] Dependency graph REST APIs and visual interactive topology.

---

### ⬜ Phase 8 — Root-Cause Hypothesis Engine
- [ ] Candidate cause generation from correlated anomaly clusters and dependency chains.
- [ ] Deterministic evidence scoring:
  - Supporting evidence tally and weight.
  - Contradicting evidence tally and weight.
  - Missing evidence identification (checking if critical telemetry streams are absent).
- [ ] Status assignment: `OBSERVED`, `CORRELATED`, `INFERRED`, `UNKNOWN`.
- [ ] Confidence calculation based on evidence density and corroboration.
- [ ] Ranking and sorting competing hypotheses.
- [ ] Generation of concrete verification action items.

---

### ⬜ Phase 9 — AI Investigation & Reasoning Layer
- [ ] LLM provider integration with structured output schemas (OpenAI / Gemini / Anthropic compatible).
- [ ] Structured prompt engineering incorporating:
  - Normalized timeline summaries.
  - Correlated anomalies and dependency paths.
  - Scored hypotheses with supporting/contradicting evidence.
  - Identified telemetry gaps.
- [ ] Anti-hallucination guardrails:
  - Strict grounding to cited event IDs and timestamps.
  - Mandatory uncertainty declarations when evidence is sparse.
- [ ] Diagnostic runbook query generator and counter-factual analysis.
- [ ] Fallback deterministic reasoning mode when external LLM is not configured.

---

### ⬜ Phase 10 — Investigation Report Generation & Export
- [ ] Automated generation of comprehensive RCA documents:
  - Executive Incident Summary.
  - Key Findings (`OBSERVED` vs `INFERRED`).
  - Timeline of Critical Events.
  - Top Candidate Root Causes with Evidence Breakdowns.
  - Blast Radius & Impact Assessment.
  - Telemetry Gaps & Unmonitored Blindspots.
  - Action Items & Verification Steps.
- [ ] Export generators:
  - Formatted Markdown export (`.md`).
  - Structured machine-readable JSON export (`.json`).
  - Print/PDF export template.

---

### ⬜ Phase 11 — Production-Quality UX & Polish
- [ ] Polish all interaction states (loading skeletons, empty states, error boundaries).
- [ ] Evidence inspector modal with syntax highlighting and raw source preview.
- [ ] Responsive navigation and mobile/tablet optimization.
- [ ] Keyboard navigation and accessibility (a11y) improvements.
- [ ] Performance audit (bundle size, code splitting, memoized graph rendering).

---

### ⬜ Phase 12 — Security, Testing & Hardening
- [ ] Comprehensive unit test suite:
  - File parsers and timestamp normalizers.
  - Anomaly detection algorithms.
  - Graph correlation and hypothesis scoring.
  - API endpoint contracts and error handling.
- [ ] Frontend unit & component tests.
- [ ] Security hardening:
  - Path traversal checks on uploads.
  - MIME type validation and file size restrictions.
  - CORS, rate limiting, and input sanitization.
  - Audit for zero hard-coded secrets or credentials.

---

### ⬜ Phase 13 — Repository Cleanup & Release
- [ ] Repository inspection and removal of obsolete/temporary artifacts.
- [ ] Verification of project root cleanliness (only `frontend/`, `backend/`, `.gitignore`, `README.md`, `ROADMAP.md`, `BRAIN.md`).
- [ ] Final verification of documentation consistency.
- [ ] Full end-to-end integration validation.
- [ ] Production build verification for both frontend and backend.
- [ ] Final Git commit and GitHub push.
- [ ] Project presentation summary.
