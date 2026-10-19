# CAUSORE — PROJECT CONSTITUTION (BRAIN.md)

> **"Evidence before conclusions. Deterministic systems before LLM reasoning. Evidence first. Investigation second. Explanation third."**

---

## 1. PRODUCT IDENTITY & MISSION

**CAUSORE** is an evidence-driven, AI-assisted IT incident investigation platform for modern engineering teams.

Suggested Product Positioning:
> **CAUSORE — Evidence-driven incident investigation for modern engineering teams.**

Core Principle:
> **CAUSORE does not simply ask an LLM to summarize an incident. It processes evidence, reconstructs the incident timeline, identifies anomalies, correlates events and dependencies, evaluates competing root-cause hypotheses, and produces an evidence-backed investigation report.**

---

## 2. CORE OBJECTIVE

The primary objective of CAUSORE is to systematically assist engineering teams in answering:
1. **What happened:** What symptoms, failures, and events occurred across systems.
2. **When it happened:** The exact reconstructed chronological order and timing of state changes.
3. **Which systems were affected:** The blast radius, degraded services, and dependent components.
4. **What changed before the incident:** Recent code deployments, config updates, infrastructure changes, and network reconfigurations.
5. **Which abnormal events occurred:** Statistical deviations, spike in error rates, latency cliffs, resource saturation.
6. **What relationships exist between events:** Cross-service causal chains, dependency propagations, and temporal correlations.
7. **What the strongest candidate causes are:** Ranked hypotheses based on empirical evidence scores.
8. **What evidence supports each candidate:** Tangible logs, metrics, events, and reports directly backing the hypothesis.
9. **What evidence contradicts each candidate:** Facts or telemetry that challenge or rule out a hypothesis.
10. **What evidence is missing:** Gaps in telemetry, unmonitored services, missing log streams needed for conclusive determination.
11. **What engineers should investigate next:** Concrete, actionable diagnostic and verification steps.

---

## 3. CORE INVESTIGATION PRINCIPLES (MANDATORY)

Every algorithm, parser, pipeline stage, and UI element in CAUSORE must strictly adhere to these 8 principles:

### Principle 1 — Evidence Before Conclusions
Never produce a root-cause conclusion without explicitly identifying and linking the tangible evidence supporting it. Speculation without empirical grounding is strictly prohibited.

### Principle 2 — Correlation Is Not Causation
A temporal overlap or sequence does not automatically prove causality. CAUSORE must identify correlations while explicitly distinguishing between coincidental temporal alignment and proven causal propagation.

### Principle 3 — Separate Facts from Hypotheses
Every single finding, statement, and candidate cause MUST be classified into one of four deterministic states:
- **`OBSERVED`**: A direct, verified fact extracted straight from raw telemetry/evidence (e.g., "HTTP 504 logged at 14:02:11 UTC by gateway").
- **`CORRELATED`**: Two or more observed events exhibiting verified temporal, dependency, or statistical linkage (e.g., "Database connection pool saturated within 30s of v2.4.1 deployment").
- **`INFERRED`**: A deduced hypothesis derived through causal models and analytical reasoning (e.g., "Connection leak in v2.4.1 caused upstream timeout cascading").
- **`UNKNOWN`**: Missing, ambiguous, or unverifiable conditions where telemetry is incomplete.

### Principle 4 — Multiple Competing Hypotheses
Where evidence allows, generate and evaluate multiple candidate causes instead of blindly declaring a single premature conclusion. Present ranked hypotheses with supporting and contradicting points.

### Principle 5 — Uncertainty & Humility
When evidence is insufficient, ambiguous, or conflicting, CAUSORE must explicitly state its uncertainty. Never manufacture false confidence or hallucinate certainty.

### Principle 6 — Evidence Traceability
Every major finding, timeline item, and hypothesis must be fully traceable back to its origin:
`Source Name -> File / Ingestion ID -> Timestamp -> Line / Offset / Event Identifier -> Relationship`.

### Principle 7 — Human Verification & Engineering Judgment
CAUSORE is an expert co-pilot and investigation assistant, NOT an autonomous authority. The engineer is always the ultimate decision-maker.

### Principle 8 — Deterministic Systems Before LLM Reasoning
Deterministic data processing (parsers, timestamp normalizers, statistical anomaly detectors, graph traversals, rule checks) MUST execute before any LLM is invoked. The LLM is an interpretive, synthesizing, and reasoning layer, not an unstructured data substitute.

---

## 4. INPUT PRINCIPLES & SUPPORTED EVIDENCE

CAUSORE accepts multi-modal incident evidence across engineering disciplines:
1. **Application & Infrastructure Logs:** Plain text (`.txt`, `.log`), structured JSON (`.json`), streaming JSON Lines (`.jsonl`), CSV (`.csv`).
2. **Incident Reports & Documentation:** Post-mortems, runbooks, outage tickets (`.pdf`, markdown, structured incident metadata).
3. **Visual Evidence:** Architecture diagrams, metric dashboard screenshots, error dialogs (`.png`, `.jpg`, `.jpeg`).
4. **Deployment & Change History:** Deployment timestamps, git commit hashes, config diffs, release tags.
5. **Topology & Dependencies:** Service dependency graphs, upstream/downstream maps, infrastructure topology.
6. **Telemetry & Traces:** Designed for future OpenTelemetry (OTel) metrics, traces, and span ingestion.

---

## 5. DETERMINISTIC INVESTIGATION PIPELINE

All investigations execute through the following deterministic 16-stage pipeline:

```text
USER INPUT
    ↓
1. EVIDENCE INGESTION (Multi-format upload & stream handling)
    ↓
2. FILE VALIDATION (MIME validation, size limits, security checks)
    ↓
3. TEXT / DATA / IMAGE EXTRACTION (OCR, JSON parsing, PDF text extraction)
    ↓
4. EVENT EXTRACTION (Regex, log grammar parsing, structured field extraction)
    ↓
5. TIMESTAMP NORMALIZATION (Timezone unification to UTC ISO-8601, format parsing)
    ↓
6. EVENT NORMALIZATION (Canonical schema: timestamp, service, level, message, attrs)
    ↓
7. INCIDENT TIMELINE (Chronological ordering, pre/during/post incident windowing)
    ↓
8. ERROR GROUPING (Fingerprinting, clustering, stack-trace aggregation)
    ↓
9. ANOMALY DETECTION (Z-score, frequency spikes, error cliffs, statistical outliers)
    ↓
10. SERVICE DEPENDENCY ANALYSIS (Directed dependency graph, blast radius, upstream impact)
    ↓
11. CROSS-EVIDENCE CORRELATION (Correlating logs + deployments + metrics + graph)
    ↓
12. CANDIDATE ROOT CAUSES (Generation of competing causal hypotheses)
    ↓
13. EVIDENCE SCORING (Deterministic scoring: supporting vs contradicting points)
    ↓
14. LLM-ASSISTED REASONING (Structured context synthesis, counter-factual verification)
    ↓
15. VERIFICATION RECOMMENDATIONS (Actionable runbook checks, queries, diagnostic commands)
    ↓
16. INVESTIGATION REPORT (Multi-section, evidence-backed, exportable RCA artifact)
```

---

## 6. AI INVESTIGATION RULES & BOUNDARIES

1. **Structured Context Only:** The LLM must NEVER be sent raw unparsed dumps hoping it "figures it out". It receives normalized events, detected anomalies, timeline summaries, dependency graphs, and scored candidate hypotheses.
2. **Strict Prompt Grounding:** All AI prompts must enforce:
   - "Cite specific timestamps and event IDs for every claim."
   - "State what is UNKNOWN if data is absent."
   - "Identify contradicting evidence explicitly."
3. **No Hallucinated Certainty:** The AI layer must output structured JSON conforming to strict Pydantic schemas.

---

## 7. ROOT-CAUSE HYPOTHESIS SCHEMA

Every candidate root cause generated by the system must satisfy this structure:

```json
{
  "candidate": "Database connection-pool exhaustion in payment-service",
  "confidence": 0.82,
  "status": "INFERRED",
  "supporting_evidence": [
    "Connection acquisition latency spiked from 5ms to 8500ms at 14:02:15 UTC (payment-svc.log:412)",
    "HTTP 500 spike occurred immediately following payment-service deploy v2.4.1 at 14:00:30 UTC",
    "Postgres connection timeout errors logged 142 times between 14:02:15 and 14:15:00 UTC"
  ],
  "contradicting_evidence": [
    "PostgreSQL host CPU remained low (18%) and memory usage was stable (44%)"
  ],
  "relevant_timeline_events": [
    "evt_019_deploy_payment_service",
    "evt_044_db_pool_timeout_spike",
    "evt_078_api_gateway_504_cascade"
  ],
  "affected_services": ["payment-service", "checkout-api", "api-gateway"],
  "possible_contributing_factors": [
    "Default connection pool size reduced from 50 to 10 in commit a8f1bc",
    "Flash sale traffic increase of 25% at 14:00:00 UTC"
  ],
  "missing_evidence": [
    "Payment-service JVM thread dump during the incident was not provided",
    "Database connection pool metrics (active vs idle) not available in logs"
  ],
  "recommended_verification": [
    "Check pool config `DB_POOL_MAX_SIZE` in deployment v2.4.1 environment variables",
    "Run `SELECT * FROM pg_stat_activity WHERE application_name = 'payment-service';` to verify connection states",
    "Verify thread pool exhaustion in payment-service metrics"
  ]
}
```

---

## 8. SECURITY & ARCHITECTURAL DISCIPLINE

1. **Zero Secrets in Code:** Never hard-code credentials, API tokens, DB connection strings, or LLM keys. Use environment variables.
2. **Safe Input Handling:** Validate all uploaded file types, enforce file size limits, prevent path traversal attacks, sanitize file names, and isolate temporary processing.
3. **Clean Root Rule:** Keep project root strictly restricted to:
   - `frontend/`
   - `backend/`
   - `.gitignore`
   - `README.md`
   - `ROADMAP.md`
   - `BRAIN.md`
4. **No Fake Functionality:** UI states, confidence numbers, anomalies, and graphs must reflect real backend analysis. Demo datasets must be explicitly badged as `[Sample / Demo]`.

---

## 9. USER APPROVAL & PHASE PROGRESSION DISCIPLINE

1. Development proceeds strictly phase by phase according to `ROADMAP.md`.
2. Before declaring a phase complete: test, build, verify against `BRAIN.md`, update `ROADMAP.md` with `✅ Phase X — Completed`, commit to Git, and push to GitHub.
3. **STOP** and wait for explicit user approval before moving to the next phase.
