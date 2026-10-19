'use client';

import React from 'react';
import { Check, X, Minus } from 'lucide-react';

export default function Differentiation() {
  const comparisonRows = [
    {
      capability: 'Primary Focus',
      apm: 'Log search & alert metric queries',
      chatbots: 'Broad text generation',
      causore: 'Evidence-backed causal incident reasoning',
      highlight: true
    },
    {
      capability: 'Investigation Architecture',
      apm: 'Manual search syntax',
      chatbots: 'Unstructured single-prompt pass',
      causore: '16-stage deterministic investigation pipeline',
      highlight: true
    },
    {
      capability: 'Timeline Reconstruction',
      apm: 'Separate tool timestamps',
      chatbots: 'Invented / estimated sequences',
      causore: 'Unified UTC ISO-8601 synchronized timeline',
      highlight: false
    },
    {
      capability: 'Fact vs Inference Classification',
      apm: 'Unclassified raw telemetry',
      chatbots: 'Blurs facts and hallucinations',
      causore: 'Strict OBSERVED / CORRELATED / INFERRED / UNKNOWN',
      highlight: true
    },
    {
      capability: 'Root-Cause Generation',
      apm: 'Manual engineer correlation',
      chatbots: 'Single unverified guess',
      causore: 'Multiple competing, ranked hypotheses',
      highlight: false
    },
    {
      capability: 'Evidence Traceability',
      apm: 'Scattered links',
      chatbots: 'No empirical citations',
      causore: 'Line-by-line evidence citations & timestamps',
      highlight: true
    },
    {
      capability: 'Uncertainty & Blindspot Detection',
      apm: 'Not supported',
      chatbots: 'Feigns 100% confidence',
      causore: 'Explicitly flags missing telemetry & blindspots',
      highlight: true
    },
    {
      capability: 'Diagnostic Action Items',
      apm: 'Manual runbooks',
      chatbots: 'Generic advice',
      causore: 'Precise verification queries & commands',
      highlight: false
    }
  ];

  return (
    <section id="differentiation" className="section">
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
            Product Philosophy
          </div>
          <h2 style={{ marginBottom: '1rem' }}>How CAUSORE Compares</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            We do not claim to replace your log aggregators or APMs. CAUSORE provides the missing investigation and causal reasoning layer above them.
          </p>
        </div>

        {/* Comparison Table */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: '8px',
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.875rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#0d131d', borderBottom: '1px solid var(--border-medium)' }}>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Capability / Tenet</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Traditional APMs</th>
                <th style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Generic AI Chatbots</th>
                <th style={{
                  padding: '1rem 1.25rem',
                  fontWeight: 700,
                  color: '#60a5fa',
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  borderLeft: '1px solid var(--border-subtle)',
                  borderRight: '1px solid var(--border-subtle)'
                }}>
                  CAUSORE Platform
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: idx < comparisonRows.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    backgroundColor: row.highlight ? 'rgba(255, 255, 255, 0.015)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.capability}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                    {row.apm}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#f87171' }}>
                    {row.chatbots}
                  </td>
                  <td style={{
                    padding: '1rem 1.25rem',
                    color: '#f8fafc',
                    fontWeight: 500,
                    backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    borderLeft: '1px solid var(--border-subtle)',
                    borderRight: '1px solid var(--border-subtle)'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Check size={16} color="#10b981" />
                      {row.causore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
