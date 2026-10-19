# CAUSORE

> **Evidence-driven incident investigation for modern engineering teams.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python: 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Node: 18+](https://img.shields.io/badge/Node-18+-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)

---

## 1. Project Introduction

**CAUSORE** is an evidence-driven, AI-assisted IT incident investigation platform designed for Site Reliability Engineers (SREs), DevOps engineers, platform operators, and software architects.

During modern production incidents, distributed architectures fail in complex, non-linear ways: cascading timeouts, database connection pool exhaustion, silent configuration drift, network partitions, or bad canary deployments. Investigating these incidents requires navigating across disjointed telemetry silos — log aggregation tools, APMs, cloud metrics, deployment histories, and post-mortem notes. Engineers waste critical minutes manually piecing together fragmented timestamps, correlating errors with deployments, and formulating hypotheses under immense pressure.

Generic AI chatbots and LLM summarizers fail in production operations because they hallucinate causal relationships, lack awareness of temporal sequencing, cannot read binary telemetry or screenshots with precision, and present speculation as authoritative fact.

**CAUSORE changes this paradigm.**

> **Core Product Principle:**
> CAUSORE does not simply ask an LLM to summarize an incident. It processes evidence, reconstructs the incident timeline, identifies anomalies, correlates events and dependencies, evaluates competing root-cause hypotheses, and produces an evidence-backed investigation report.

---

## 2. Problem Statement

In the traditional incident investigation workflow, on-call engineers are inundated with alert noise and fractured evidence:

```text
               Production Incident Occurs
                           ↓
                  Search & Filter Logs
             (Thousands of lines across services)
                           ↓
                     Check Metrics
          (CPU, RAM, network, IOPS, connection pools)
                           ↓
                  Inspect Deployments
            (CI/CD commits, releases, config diffs)
                           ↓
                Trace Service Dependencies
             (Upstream gateways vs downstream DBs)
                           ↓
                 Manually Align Timestamps
                (Different timezones, UTC vs local)
                           ↓
               Form Mental Hypotheses Under Stress
                           ↓
                Verify Each Hypothesis Manually
                           ↓
                   Draft Root-Cause Analysis (RCA)
```

### Why Traditional Workflows Fail:
- **Telemetry Silos:** Logs, metrics, deployments, and architectural knowledge live in separate platforms.
- **Cognitive Overload:** Engineers must manually reconstruct chronological sequences while managing active outages.
- **Premature Convergence:** Teams often latch onto the first conspicuous error code, ignoring root causes deeper down the dependency graph.
- **Unverified AI Chatbots:** Unstructured AI chat tools hallucinate causes because they do not deterministically parse timestamps or enforce causal graphs.
- **Lost Investigation History:** Transient troubleshooting steps and evidence correlations disappear once the incident bridge closes.

---

## 3. The CAUSORE Solution

CAUSORE re-engineers incident investigation into a structured, evidence-first, deterministic pipeline assisted by causal reasoning:

```text
                  Incident Evidence Upload
     (Logs, Configs, Incident Summaries, Dashboard Captures)
                           ↓
                   Evidence Ingestion
               (Validation & MIME verification)
                           ↓
             Parsing & Structural Normalization
             (JSON, JSONL, LOG, TXT, PDF, CSV, Images)
                           ↓
               Timestamp Synchronization
              (Canonical UTC ISO-8601 timeline)
                           ↓
               Incident Timeline Construction
           (Pre-incident, Active window, Post-incident)
                           ↓
                 Anomaly & Spike Detection
            (Statistical deviation, rate-of-change, z-scores)
                           ↓
                Service Dependency Mapping
                (Topology traversal & blast radius)
                           ↓
               Cross-Evidence Correlation
             (Linking deployments to error spikes)
                           ↓
            Competing Root-Cause Hypotheses
              (Deterministic generation of candidates)
                           ↓
                 Evidence Scoring Engine
           (Supporting vs Contradicting vs Missing)
                           ↓
             Structured AI-Assisted Reasoning
           (Counter-factual analysis & diagnostic queries)
                           ↓
             Actionable Investigation Report
        (Categorized by OBSERVED, CORRELATED, INFERRED)
```

---

## 4. Target Users

CAUSORE is built for engineering teams responsible for maintaining high availability:

- **Site Reliability Engineers (SREs):** Rapidly isolate blast radius, correlate systemic anomalies, and trace cascading failures back to initial triggers.
- **DevOps & Platform Engineers:** Correlate recent infrastructure mutations, container restarts, and canary rollouts with telemetry spikes.
- **Backend & Distributed Systems Engineers:** Pinpoint distributed trace anomalies, connection pool exhaustion, and unhandled thread deadlocks.
- **Production Support & On-Call Responders:** Quickly orient themselves during 3 AM pages without sifting through millions of irrelevant debug logs.
- **Incident Commanders:** Maintain an objective, real-time shared timeline of facts and track open diagnostic verification items.
- **Engineering Managers & Directors:** Standardize post-incident reviews with structured, reproducible evidence artifacts.

---

## 5. Company & Organizational Value

CAUSORE delivers measurable operational improvements across the engineering lifecycle:
- **Reduces Mean Time to Resolution (MTTR):** Automates the repetitive extraction, timestamp alignment, and correlation of logs and deployments.
- **Accelerates Incident Response:** Provides on-call engineers with a structured timeline within seconds of uploading incident files.
- **Eliminates Repetitive Log Dredging:** Identifies and groups repeating error signatures and surfaces statistical outliers.
- **Preserves Investigation Evidence:** Keeps a tamper-evident, structured record of every log line, metric snapshot, and report evaluated.
- **Prevents Blameless RCA Delays:** Generates comprehensive draft post-mortems with cited evidence and clear distinctions between observed facts and inferences.
- **Exposes Monitoring Blindspots:** Proactively flags missing evidence (e.g., absent thread dumps or unmonitored downstream queues) to improve long-term observability.

---

## 6. Product Differentiation

CAUSORE differs fundamentally from both raw log aggregators and generic conversational AI:

| Feature / Philosophy | Traditional APM / Log Tools | Generic AI Chatbots | CAUSORE |
| :--- | :--- | :--- | :--- |
| **Primary Focus** | Ingestion & Search | Text generation | Evidence-backed incident reasoning |
| **Investigation Pipeline** | Manual querying | Freeform ungrounded prompts | Deterministic 16-stage pipeline |
| **Timeline Reconstruction** | Per-tool query logs | Guessed chronological order | Synchronized UTC canonical timeline |
| **Causal Hypotheses** | None (engineer's job) | Single arbitrary hallucination | Multiple competing, scored hypotheses |
| **Fact vs Inference** | Unclassified raw data | Mixed together unchecked | Strict `OBSERVED` / `CORRELATED` / `INFERRED` / `UNKNOWN` |
| **Evidence Traceability** | Disconnected | No citations | Direct link to file, line, and timestamp |
| **Uncertainty Handling** | N/A | False confidence | Explicit declaration of missing telemetry |
| **Human in the Loop** | Entirely manual | Overrides judgment | Diagnostic verification checklist for engineers |

---

## 7. Comparison with Existing Tool Categories

CAUSORE does not seek to replace your existing observability stack; it complements and elevates it:
- **Log Management (Datadog, Elastic, Splunk):** These tools store and index logs. CAUSORE acts as the reasoning engine across those logs, correlating them with deployment events and dependency topologies.
- **Observability Platforms (Grafana, Dynatrace, New Relic):** These provide live dashboards and alerting. CAUSORE consumes exported telemetry and snapshots to run post-alert deep-dive investigations.
- **Incident Management (PagerDuty, Incident.io, OpsGenie):** These manage on-call schedules, alerts, and communication channels. CAUSORE powers the technical diagnostic core of the incident.
- **Generic AI Assistants (ChatGPT, Claude):** These are broad text generators without deterministic timeline reconstruction or verification guardrails. CAUSORE uses deterministic algorithms first, using AI only for grounded reasoning.

---

## 8. Supported Evidence Formats

CAUSORE accepts multi-source engineering evidence:
- **Logs:** `.txt`, `.log`, `.json`, `.jsonl`, `.csv` (standard syslog, Nginx, Kubernetes, Spring, Python, Go, Node.js).
- **Incident Documentation:** `.pdf`, Markdown, structured metadata (incident severity, start/end windows, environments).
- **Visual Telemetry:** `.png`, `.jpg`, `.jpeg` (dashboard screenshots, architectural diagrams, metric graphs).
- **Deployment Records:** Release versions, commit SHAs, deployment timestamps, configuration diffs.
- **Topological Maps:** JSON service dependency maps and upstream/downstream connection graphs.
- **OpenTelemetry Ready:** Modular data architecture designed for future OTLP trace, metric, and log integration.

---

## 9. How to Use CAUSORE (User Journey)

```text
1. Open CAUSORE
2. Review the product overview and active investigations
3. Select "Investigate an Incident"
4. Enter incident metadata (Name, Severity, Environment, Service, Time Window)
5. Upload evidence (Logs, JSON exports, PDF incident reports, Metric screenshots)
6. Optionally supply deployment timestamps and dependency maps
7. Launch the investigation pipeline
8. Monitor real-time deterministic pipeline stages (Ingestion -> Parsing -> Timeline -> Anomalies -> Hypotheses)
9. Explore the reconstructed Incident Timeline
10. Inspect detected anomalies and statistical outliers
11. Review competing candidate root causes with evidence scores
12. Examine supporting and contradicting evidence for each candidate
13. Review identified telemetry gaps and missing evidence
14. Follow recommended verification steps (diagnostic commands and DB queries)
15. Inspect the generated Investigation Report
16. Export report to Markdown, JSON, or PDF
```

---

## 10. Explicit Limitations & Boundaries

CAUSORE operates under clear engineering honesty:
- **Evidence Dependent:** CAUSORE's output quality is directly bounded by the fidelity and completeness of the supplied evidence.
- **Correlation ≠ Causation:** Temporal correlation is an indicator, not mathematical proof. CAUSORE highlights correlations for human verification.
- **Screenshots Provide Weaker Evidence:** OCR-extracted dashboard images provide lower precision than structured log files or raw metric streams.
- **AI Hypotheses Require Engineering Verification:** CAUSORE assists engineers; it does not replace engineering accountability or authorize automated remediation.
- **Uncertainty Communication:** When evidence is sparse or ambiguous, CAUSORE explicitly communicates its inability to reach a definitive conclusion.

---

## 11. Technology Stack

Every component is chosen for performance, type safety, modularity, and deterministic execution:

### Frontend
- **Framework:** Next.js 14+ (App Router, React 18+, TypeScript)
- **Styling:** Modern Vanilla CSS / Tailwind CSS for high-density engineering aesthetics
- **Icons & Graphics:** Lucide React icons, SVG-based topology maps
- **State Management:** React hooks with deterministic state machines

### Backend
- **Framework:** Python 3.11+ with FastAPI (Async REST APIs, Pydantic v2 schemas)
- **Data & Storage:** PostgreSQL (relational event models, indices, Alembic migrations; SQLite support for local dev/testing)
- **Data Processing & Analytics:** NumPy, Scikit-learn (outlier detection, frequency spike analysis)
- **Graph & Topology:** NetworkX for dependency modeling and blast radius traversal
- **Parsing:** PyMuPDF / pdfplumber for PDFs, custom log parsers with UTC normalization
- **AI / LLM Integration:** Structured schema enforcement with vendor-agnostic connectors (OpenAI, Gemini, Anthropic)

---

## 12. System Architecture

```text
+------------------------------------------------------------------------------------+
|                                    FRONTEND                                        |
|  Next.js 14 / TypeScript / High-Density Engineering UI                             |
|  - Landing Page & Value Proposition                                                |
|  - Investigation Wizard (Metadata + Drag-and-Drop Ingestion)                       |
|  - Pipeline Progress Observer                                                      |
|  - Interactive Chronological Timeline                                              |
|  - Anomaly Dashboard & Outlier Explorer                                            |
|  - Candidate Root-Cause Cards (Confidence, Status, Evidence)                       |
|  - Dependency Graph Visualizer & Evidence Line Inspector                           |
|  - RCA Report Generator & Exporter (MD, JSON, PDF)                                 |
+-----------------------------------------+------------------------------------------+
                                          | REST API (HTTP/JSON)
+-----------------------------------------v------------------------------------------+
|                                    BACKEND                                         |
|  FastAPI / Python 3.11+ Async Engine                                               |
|                                                                                    |
|  [ API Layer ]                                                                     |
|    - /api/investigations  - /api/evidence  - /api/timeline  - /api/hypotheses      |
|                                                                                    |
|  [ Ingestion & Parsing Engine ]                                                    |
|    - File Validators (MIME, Magic Bytes, Path Traversal Guard)                     |
|    - Multi-Format Parsers (JSON, JSONL, LOG, Syslog, CSV, PDF, OCR)                |
|    - UTC ISO-8601 Timestamp Extractor & Normalizer                                |
|                                                                                    |
|  [ Deterministic Analytics & Correlation Core ]                                    |
|    - Timeline Windowing & Event Fingerprinting Engine                              |
|    - Statistical Anomaly & Error Cliff Detector (Z-Scores, Scikit-Learn)           |
|    - Service Dependency & Blast Radius Graph (NetworkX)                            |
|    - Temporal & Deployment Correlator                                              |
|                                                                                    |
|  [ Hypothesis & Scoring Engine ]                                                   |
|    - Candidate Generator & Evidence Corroborator                                   |
|    - Status Classifier (OBSERVED / CORRELATED / INFERRED / UNKNOWN)                |
|    - Metric Scorer (Supporting vs Contradicting vs Missing Evidence)               |
|                                                                                    |
|  [ Grounded AI Reasoning Layer ]                                                   |
|    - Structured Schema Prompts (No raw unparsed dumps)                             |
|    - Runbook Query Synthesizer & Verification Generator                            |
|                                                                                    |
|  [ Storage Layer ]                                                                 |
|    - PostgreSQL / SQLAlchemy Async ORM                                             |
+------------------------------------------------------------------------------------+
```

---

## 13. Project Structure

```text
CAUSORE/
│
├── frontend/                     # Next.js 14+ TypeScript application
│   ├── app/                      # Next.js App Router (pages and layouts)
│   ├── components/               # Reusable UI components (Timeline, Graph, Cards)
│   ├── lib/                      # API client, utilities, and formatters
│   ├── types/                    # Shared TypeScript interfaces & types
│   └── package.json              # Frontend dependencies and scripts
│
├── backend/                      # Python FastAPI backend application
│   ├── app/                      # Application entry points and configuration
│   ├── api/                      # REST API endpoints and routes
│   ├── core/                     # Configuration, database setup, security utils
│   ├── models/                   # SQLAlchemy relational database models
│   ├── schemas/                  # Pydantic v2 schemas and data validation
│   ├── parsers/                  # Log, JSON, PDF, and image parsers
│   ├── analyzers/                # Anomaly detection and statistical analysis
│   ├── correlation/              # Dependency graph and temporal correlation
│   ├── investigation/            # Hypothesis generator and evidence scorer
│   ├── reports/                  # RCA report generation and export formats
│   ├── tests/                    # Backend unit and integration tests
│   └── requirements.txt          # Backend Python dependencies
│
├── .gitignore                    # Comprehensive repository gitignore
├── README.md                     # Primary project documentation
├── ROADMAP.md                    # Phased development tracking
└── BRAIN.md                      # Project constitution and architectural rules
```

---

## 14. Development Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Python:** v3.11 or higher
- **Git**

### 1. Clone & Setup
```bash
git clone https://github.com/lohithpahuja03/CAUSORE.git
cd CAUSORE
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Tests
```bash
# Run backend tests
cd backend
pytest

# Run frontend tests
cd ../frontend
npm test
```

---

## 15. Security & Safety

- **No Secrets in Code:** CAUSORE requires environment variables for any external API or database credentials.
- **Isolated Uploads:** Uploaded evidence is sanitized, validated, and processed in isolated temporary workspaces.
- **Untrusted Input Policy:** All uploaded log files and PDFs are treated as untrusted data with strict path traversal and memory limits.
