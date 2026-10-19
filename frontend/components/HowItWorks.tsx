'use client';

import React, { useState } from 'react';
import { UploadCloud, FileCode2, GitMerge, BrainCircuit, FileCheck, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'step-upload',
      stepNumber: '01',
      title: 'Upload Incident Evidence',
      tag: 'Multi-Modal Ingestion',
      icon: <UploadCloud size={24} color="#38bdf8" />,
      shortDesc: 'Drop in application logs, incident reports, deployment history, and dashboard screenshots.',
      details: [
        'Supports TXT, LOG, JSON, JSONL, CSV, PDF, PNG, JPG/JPEG',
        'Automatic MIME-type validation and security payload scanning',
        'Uploads are isolated and associated with a unique investigation ID'
      ],
      sampleSnippet: `POST /api/investigations/inv-8912/evidence
File: payment_gateway_access.log (14.2 MB)
File: canary_deploy_v2.4.1.json (18 KB)
File: grafana_db_pool_spike.png (840 KB)
Status: Ingested & Validated`
    },
    {
      id: 'step-parse',
      stepNumber: '02',
      title: 'Parse & Normalize Timelines',
      tag: 'UTC Standardization',
      icon: <FileCode2 size={24} color="#06b6d4" />,
      shortDesc: 'Deterministic parsers parse log records and convert disparate timestamps into unified UTC ISO-8601.',
      details: [
        'Extracts timestamp, service, level, message, and structural attributes',
        'Clusters repeating error fingerprints and stack traces',
        'Segments events into pre-incident, active window, and recovery phases'
      ],
      sampleSnippet: `Event Normalization:
{
  "timestamp": "2026-10-18T14:02:15.112Z",
  "service": "payment-service",
  "level": "ERROR",
  "fingerprint": "fp_db_connection_timeout_9a",
  "message": "Connection acquisition timed out after 30000ms"
}`
    },
    {
      id: 'step-correlate',
      stepNumber: '03',
      title: 'Correlate Across Graph & Telemetry',
      tag: 'Topology & Anomaly',
      icon: <GitMerge size={24} color="#10b981" />,
      shortDesc: 'Statistical algorithms detect error cliffs while graph algorithms map the fault propagation.',
      details: [
        'Calculates z-score anomalies and error volume spikes',
        'Traverses service dependency graphs to identify blast radius',
        'Correlates code deployment commits directly with initial metric deviation'
      ],
      sampleSnippet: `Graph Traversal Result:
payment-service (Originator) 
  ↳ downstream: checkout-api (Degraded, latency +650%)
    ↳ downstream: api-gateway (Degraded, 504 errors: 420/s)
Deployment Correlation:
  Commit a8f1bc4 deployed 1m45s prior to initial error spike`
    },
    {
      id: 'step-investigate',
      stepNumber: '04',
      title: 'Evaluate Competing Hypotheses',
      tag: 'Evidence Scoring',
      icon: <BrainCircuit size={24} color="#f59e0b" />,
      shortDesc: 'The system ranks competing root causes with empirical supporting and contradicting evidence.',
      details: [
        'Deterministic evidence scoring tallies supporting facts against contradicting observations',
        'Strict epistemic status tagging: OBSERVED, CORRELATED, INFERRED, UNKNOWN',
        'Identifies missing evidence and unmonitored blindspots'
      ],
      sampleSnippet: `Hypothesis Evaluation:
Candidate: Database connection pool exhaustion
Confidence: 86% | Status: INFERRED
Supporting Evidence: 3 verified data points
Contradicting Evidence: PostgreSQL CPU was normal (18%)
Missing Evidence: Pool metrics not exported`
    },
    {
      id: 'step-report',
      stepNumber: '05',
      title: 'Generate Actionable RCA Report',
      tag: 'Engineering Artifact',
      icon: <FileCheck size={24} color="#a855f7" />,
      shortDesc: 'Produces a comprehensive, engineering-grade investigation report with verification runbooks.',
      details: [
        'Executive summary for leadership and granular diagnostic trace for engineers',
        'Recommended diagnostic verification queries and commands',
        'One-click export to Markdown, JSON, or PDF'
      ],
      sampleSnippet: `CAUSORE Investigation Report
Incident: Checkout Service Outage (SEV-1)
Duration: 28 minutes
Top Finding: Pool exhaustion following v2.4.1 deploy
Recommended Actions:
  1. Inspect DB_POOL_MAX_SIZE in deployment config
  2. Run pg_stat_activity connection check`
    }
  ];

  return (
    <section id="how-it-works" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            color: 'var(--brand-cyan)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            System Architecture In Action
          </div>
          <h2 style={{ marginBottom: '1rem' }}>How CAUSORE Investigates</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            A disciplined, reproducible 5-step journey transforming chaotic multi-source incident data into rigorous root-cause clarity.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
          marginBottom: '2rem'
        }}>
          {steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(idx)}
              style={{
                backgroundColor: activeStep === idx ? 'var(--bg-surface-elevated)' : 'var(--bg-primary)',
                border: activeStep === idx ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="mono" style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: activeStep === idx ? '#60a5fa' : 'var(--text-muted)'
                }}>
                  {s.stepNumber}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)'
                }}>
                  {s.tag}
                </span>
              </div>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: activeStep === idx ? '#ffffff' : 'var(--text-secondary)'
              }}>
                {s.title}
              </span>
            </button>
          ))}
        </div>

        {/* Active Step Deep-Dive Container */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-medium)',
          borderRadius: '10px',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          {/* Explanation Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {steps[activeStep].icon}
              </div>
              <div>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)', textTransform: 'uppercase' }}>
                  Step {steps[activeStep].stepNumber} // {steps[activeStep].tag}
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 600 }}>
                  {steps[activeStep].title}
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              {steps[activeStep].shortDesc}
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {steps[activeStep].details.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Sample Output Column */}
          <div>
            <div className="terminal-block">
              <div className="terminal-header">
                <div className="terminal-dots">
                  <span className="terminal-dot red"></span>
                  <span className="terminal-dot yellow"></span>
                  <span className="terminal-dot green"></span>
                </div>
                <span className="mono" style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  causore-engine :: {steps[activeStep].id}
                </span>
              </div>
              <pre className="terminal-content" style={{ color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                <code>{steps[activeStep].sampleSnippet}</code>
              </pre>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
