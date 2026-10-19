# CAUSORE — PROJECT ROADMAP (ROADMAP.md)

This document tracks the phased development of **CAUSORE** — Evidence-driven incident investigation for modern engineering teams.

---

## DEVELOPMENT LIFECYCLE PHASES

- [x] **✅ Phase 0 — Completed**
- [ ] **Phase 1 — Public Website Foundation**
- [ ] **Phase 2 — Investigation Workspace UI**
- [ ] **Phase 3 — Backend Foundation & Storage**
- [ ] **Phase 4 — Evidence Ingestion & Parsing Engine**
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

### ⬜ Phase 1 — Public Website Foundation
- [ ] Modern Next.js TypeScript frontend setup.
- [ ] CAUSORE branding and technical design tokens (dark-mode first, engineering aesthetic).
- [ ] Navigation header with navigation anchors and primary action CTA ("Investigate an Incident").
- [ ] Hero section articulating the value proposition and core product principle.
- [ ] Problem section illustrating the pain points of fragmented manual investigation workflows.
- [ ] Solution section visualizing the CAUSORE evidence-first paradigm.
- [ ] "How It Works" section illustrating the 5-step lifecycle (Upload → Parse → Correlate → Investigate → Report).
- [ ] Target Users section (SRE, DevOps, Platform, Backend, Incident Commanders).
- [ ] Key Capabilities showcase (Evidence Ingestion, Timeline, Anomaly Detection, Hypothesis Scoring).
- [ ] Differentiation section (Evidence-first vs generic chatbots, Fact vs Inference separation).
- [ ] Limitations & Trust section (Uncertainty awareness, human verification).
- [ ] Primary Call-to-Action and technical Footer.
- [ ] Responsive layout, accessibility checks, and performance optimization.

---

### ⬜ Phase 2 — Investigation Workspace UI
- [ ] Multi-step incident creation wizard:
  - Step 1: Incident metadata (Name, Severity, Environment, Start/End UTC timestamps, Affected Services).
  - Step 2: Multi-format Evidence Dropzone (Logs, JSON, PDF reports, screenshots).
  - Step 3: Optional contextual inputs (Deployments, Dependency topologies, notes).
  - Step 4: Pre-investigation validation and parameter confirmation.
- [ ] Investigation processing & real-time progress view:
  - Multi-stage deterministic pipeline status indicator (Parsing, Normalizing, Timeline, Anomalies, Hypotheses).
- [ ] Comprehensive Results Interface:
  - Incident executive header with severity, blast radius, and duration metrics.
  - Interactive Incident Timeline with chronological filtering and event inspector.
  - Anomaly Detection view with statistical deviation indicators.
  - Candidate Root-Cause Cards displaying confidence, status (`OBSERVED`, `CORRELATED`, `INFERRED`), supporting/contradicting evidence.
  - Evidence Explorer with raw line traceability.
  - Service Dependency Graph visualizer.
  - Missing Evidence & Recommended Verification Actions checklist.
  - Export actions (Markdown, JSON, PDF).

---

### ⬜ Phase 3 — Backend Foundation & Storage
- [ ] Python FastAPI application scaffolding with modular architecture.
- [ ] Database configuration (PostgreSQL with SQLAlchemy 2.0 async engine and Alembic migrations; SQLite fallback for local testability).
- [ ] Core database schemas:
  - `investigations`: Incident metadata, status, time windows, confidence scores.
  - `evidence_files`: File metadata, hashes, MIME types, processing statuses.
  - `normalized_events`: Extracted events with UTC timestamps, services, levels, structured attributes.
  - `anomalies`: Detected statistical outliers, error spikes, latency anomalies.
  - `services` & `service_dependencies`: Service graph topology.
  - `deployments`: Deployment change logs.
  - `hypotheses`: Generated root-cause candidates with evidence score breakdowns.
  - `reports`: Final RCA structured documents.
- [ ] Investigation CRUD REST APIs.
- [ ] Health check and system observability endpoints.

---

### ⬜ Phase 4 — Evidence Ingestion & Parsing Engine
- [ ] File validation pipeline: MIME sniffing, extension whitelisting, size limits, security checks.
- [ ] Parsers:
  - Structured log parser (JSON, JSONL).
  - Standard syslog and common server log parser (Nginx, Apache, standard stdout).
  - CSV log parser.
  - PDF document extractor (incident summaries, post-mortems).
  - Visual evidence OCR / metadata processor (screenshots).
- [ ] Timestamp extractor and normalizer (resolves arbitrary timezone representations to UTC ISO-8601).
- [ ] Canonical event normalizer mapping raw log records into standard `NormalizedEvent` records with source traceability.

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
