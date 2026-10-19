'use client';

import React from 'react';
import { ShieldCheck, Cpu, GitBranch, Search, Sparkles, CheckSquare, FileText, ArrowRight } from 'lucide-react';

export default function SolutionSection() {
  const pipelineStages = [
    {
      num: '01',
      title: 'Evidence Ingestion & Validation',
      desc: 'Ingests logs (TXT, LOG, JSON, JSONL, CSV), PDF incident notes, deployment history, and dashboard images with strict MIME validation.',
      phase: 'deterministic'
    },
    {
      num: '02',
      title: 'Parsing & Timestamp Normalization',
      desc: 'Extracts events and synchronizes heterogeneous date/time formats into canonical UTC ISO-8601 timestamps.',
      phase: 'deterministic'
    },
    {
      num: '03',
      title: 'Timeline & Error Clustering',
      desc: 'Builds chronological event sequences (pre-incident, active window, post-incident) and fingerprints repeating error signatures.',
      phase: 'deterministic'
    },
    {
      num: '04',
      title: 'Statistical Anomaly Detection',
      desc: 'Executes z-score rate-of-change analysis and isolation forest scoring to detect error cliffs, latency anomalies, and volume drops.',
      phase: 'deterministic'
    },
    {
      num: '05',
      title: 'Dependency Graph & Correlation',
      desc: 'Traverses directed service topologies to trace error propagation upstream and correlate deployments with telemetry shifts.',
      phase: 'deterministic'
    },
    {
      num: '06',
      title: 'Root-Cause Hypothesis Scoring',
      desc: 'Generates competing causal candidates and tallies supporting vs. contradicting evidence with explicit uncertainty scoring.',
      phase: 'deterministic'
    },
    {
      num: '07',
      title: 'Structured AI Investigation Layer',
      desc: 'Synthesizes verified context (no raw dumps) to counter-factually analyze competing causes and draft diagnostic verification steps.',
      phase: 'ai'
    },
    {
      num: '08',
      title: 'Actionable Engineering Report',
      desc: 'Produces an exportable post-incident artifact strictly categorizing findings into OBSERVED, CORRELATED, INFERRED, and UNKNOWN.',
      phase: 'output'
    }
  ];

  return (
    <section id="solution" className="section">
      <div className="container">
        <div style={{ maxWidth: '820px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: '#10b981',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            The CAUSORE Paradigm
          </div>
          <h2 style={{ marginBottom: '1rem' }}>
            Deterministic Engineering Pipelines Before AI Reasoning
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            We reject the idea that an LLM alone can solve incident triage. CAUSORE builds a solid empirical foundation first—parsing, aligning, clustering, and mathematically scoring evidence before invoking AI for synthesis.
          </p>
        </div>

        {/* Pipeline Stage Architecture Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {pipelineStages.map((stage, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: stage.phase === 'ai' ? 'rgba(59, 130, 246, 0.04)' : 'var(--bg-secondary)',
                borderColor: stage.phase === 'ai' ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="mono" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: stage.phase === 'ai' ? '#60a5fa' : 'var(--brand-cyan)'
                }}>
                  STAGE {stage.num}
                </span>

                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '3px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  backgroundColor: stage.phase === 'ai' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  color: stage.phase === 'ai' ? '#93c5fd' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {stage.phase === 'ai' ? 'Reasoning Layer' : 'Deterministic Core'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.65rem', fontWeight: 600 }}>
                {stage.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, flexGrow: 1 }}>
                {stage.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Architectural Principle Box */}
        <div style={{
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', display: 'block', marginBottom: '0.25rem' }}>
              Principle 8 of CAUSORE Constitution:
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              "Deterministic systems before LLM reasoning. The LLM enhances interpretation and explanation rather than replacing the entire investigation engine."
            </p>
          </div>
          <span className="badge badge-observed">Enforced by Pipeline</span>
        </div>
      </div>
    </section>
  );
}
