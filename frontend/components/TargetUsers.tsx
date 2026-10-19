'use client';

import React from 'react';
import { Terminal, Shield, Server, Headphones, Radio, BarChart2 } from 'lucide-react';

export default function TargetUsers() {
  const personas = [
    {
      role: 'Site Reliability Engineers (SREs)',
      icon: <Shield size={22} color="#38bdf8" />,
      focus: 'Blast Radius & Causal Isolation',
      description:
        'Quickly untangle cascading timeouts and identify the exact upstream trigger without manually correlating logs across dozens of microservices.',
      benefit: 'Cuts time spent aligning timestamps by 80% during active fire drills.'
    },
    {
      role: 'DevOps & Platform Engineers',
      icon: <Server size={22} color="#06b6d4" />,
      focus: 'Deployment & Infrastructure Correlation',
      description:
        'Instantly link canary rollouts, container restarts, Helm upgrades, and environment variable mutations with the exact minute of telemetry degradation.',
      benefit: 'Pinpoints deployment-induced regressions within seconds of file ingestion.'
    },
    {
      role: 'Backend Engineers',
      icon: <Terminal size={22} color="#10b981" />,
      focus: 'Stack Trace & Concurrency Diagnostics',
      description:
        'Trace connection pool exhaustion, thread deadlocks, and slow downstream third-party API dependencies with precise line-level evidence citations.',
      benefit: 'Provides exact log line references and code-level verification queries.'
    },
    {
      role: 'Incident Commanders',
      icon: <Radio size={22} color="#f59e0b" />,
      focus: 'Objective Incident State & Communications',
      description:
        'Maintain a singular, objective source of truth regarding confirmed facts (OBSERVED) versus active hypotheses (INFERRED) during live war rooms.',
      benefit: 'Eliminates speculation on the bridge and focuses engineering effort.'
    },
    {
      role: 'Production Support Engineers',
      icon: <Headphones size={22} color="#a855f7" />,
      focus: 'Fast Diagnostic Orientation',
      description:
        'Rapidly diagnose customer-impacting production errors without requiring deep architectural knowledge of every internal service.',
      benefit: 'Lowers barriers for tier-2/3 support responders during complex incidents.'
    },
    {
      role: 'Engineering Managers & Directors',
      icon: <BarChart2 size={22} color="#ec4899" />,
      focus: 'Standardized Post-Mortems & Learning',
      description:
        'Generate objective, blameless post-mortem reports that highlight monitoring blindspots and missing telemetry to improve long-term resilience.',
      benefit: 'Standardizes post-incident documentation across all engineering squads.'
    }
  ];

  return (
    <section id="users" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.25)',
            color: '#c084fc',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            Engineers First
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Designed for High-Reliability Teams</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Whether you are on-call at 3 AM or conducting a post-mortem review, CAUSORE delivers clarity tailored to your responsibilities.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {personas.map((p, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {p.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{p.role}</h3>
                  <span className="mono" style={{ fontSize: '0.725rem', color: 'var(--brand-cyan)' }}>
                    {p.focus}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem', flexGrow: 1 }}>
                {p.description}
              </p>

              <div style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}>
                <strong style={{ color: 'var(--text-primary)' }}>Impact:</strong> {p.benefit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
