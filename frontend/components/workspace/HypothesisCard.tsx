'use client';

import React from 'react';
import { CandidateRootCause } from '../../types';
import { CheckCircle2, XCircle, HelpCircle, Terminal, Layers, ArrowUpRight } from 'lucide-react';

interface Props {
  hypothesis: CandidateRootCause;
  rank: number;
}

export default function HypothesisCard({ hypothesis, rank }: Props) {
  const getStatusBadge = (status: CandidateRootCause['status']) => {
    switch (status) {
      case 'OBSERVED':
        return 'badge-observed';
      case 'CORRELATED':
        return 'badge-correlated';
      case 'INFERRED':
        return 'badge-inferred';
      case 'UNKNOWN':
      default:
        return 'badge-unknown';
    }
  };

  const confidencePercent = Math.round(hypothesis.confidence * 100);

  return (
    <div className="card" style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-medium)',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '1.25rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-cyan)' }}>
            HYPOTHESIS #{rank}
          </span>
          <span className={`badge ${getStatusBadge(hypothesis.status)}`}>
            {hypothesis.status}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Calculated Confidence:
          </span>
          <span className="mono" style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            color: confidencePercent > 70 ? '#10b981' : confidencePercent > 40 ? '#f59e0b' : '#ef4444'
          }}>
            {confidencePercent}%
          </span>
        </div>
      </div>

      {/* Candidate Name */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem' }}>
        {hypothesis.candidate}
      </h3>

      {/* Affected Services */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Affected Blast Radius:</span>
        {hypothesis.affectedServices.map((svc) => (
          <span key={svc} className="mono" style={{
            fontSize: '0.7rem',
            padding: '0.15rem 0.45rem',
            borderRadius: '3px',
            backgroundColor: 'var(--bg-surface)',
            color: '#38bdf8',
            border: '1px solid var(--border-subtle)'
          }}>
            {svc}
          </span>
        ))}
      </div>

      {/* Supporting vs Contradicting Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        {/* Supporting Evidence */}
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '6px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <strong style={{ fontSize: '0.85rem', color: '#10b981' }}>Supporting Evidence ({hypothesis.supportingEvidence.length})</strong>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {hypothesis.supportingEvidence.map((ev, i) => (
              <li key={i} style={{ lineHeight: 1.5 }}>• {ev}</li>
            ))}
          </ul>
        </div>

        {/* Contradicting Evidence */}
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '6px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <XCircle size={16} color="#ef4444" />
            <strong style={{ fontSize: '0.85rem', color: '#ef4444' }}>Contradicting Evidence ({hypothesis.contradictingEvidence.length})</strong>
          </div>
          {hypothesis.contradictingEvidence.length === 0 ? (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>None observed in uploaded telemetry.</span>
          ) : (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {hypothesis.contradictingEvidence.map((ev, i) => (
                <li key={i} style={{ lineHeight: 1.5 }}>• {ev}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Missing Evidence Blindspots */}
      {hypothesis.missingEvidence.length > 0 && (
        <div style={{
          backgroundColor: 'rgba(168, 85, 247, 0.05)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '6px',
          padding: '0.85rem 1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <HelpCircle size={16} color="#c084fc" />
            <strong style={{ fontSize: '0.825rem', color: '#c084fc' }}>Missing Telemetry / Telemetry Blindspots:</strong>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {hypothesis.missingEvidence.map((m, i) => (
              <li key={i}>• {m}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Verification */}
      <div style={{
        backgroundColor: '#0c1017',
        border: '1px solid var(--border-medium)',
        borderRadius: '6px',
        padding: '0.85rem 1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <Terminal size={15} color="#38bdf8" />
          <strong style={{ fontSize: '0.825rem', color: '#38bdf8' }}>Actionable Engineer Verification Steps:</strong>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
          {hypothesis.recommendedVerification.map((step, i) => (
            <li key={i}>
              <span style={{ color: 'var(--text-muted)' }}>[{i + 1}]</span> {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
