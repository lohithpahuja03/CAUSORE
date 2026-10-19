'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, HelpCircle, ShieldAlert, FileX } from 'lucide-react';

export default function LimitationsTrust() {
  const principles = [
    {
      icon: <HelpCircle size={20} color="#f59e0b" />,
      title: 'Bound by Evidence Completeness',
      description:
        'CAUSORE cannot divine facts that do not exist in your telemetry. If a downstream database was unmonitored or an access log was omitted, confidence scores will drop and telemetry gaps will be explicitly highlighted.'
    },
    {
      icon: <AlertTriangle size={20} color="#ef4444" />,
      title: 'Correlation Is Not Causation',
      description:
        'A code deployment occurring 30 seconds prior to an error spike is an important correlation, not mathematical proof of guilt. CAUSORE presents candidate hypotheses, never dogmatic conclusions.'
    },
    {
      icon: <FileX size={20} color="#a855f7" />,
      title: 'Screenshots Yield Weaker Grounding',
      description:
        'Optical Character Recognition (OCR) on metric charts provides heuristic evidence. CAUSORE always weights raw structured JSON, syslog lines, and tracing spans significantly higher than dashboard images.'
    },
    {
      icon: <ShieldAlert size={20} color="#38bdf8" />,
      title: 'Engineering Co-Pilot, Not Autonomous Authority',
      description:
        'CAUSORE never triggers automated infrastructure changes or executes automated rollbacks. It arms human engineers with structured evidence, competing hypotheses, and diagnostic verification queries.'
    }
  ];

  return (
    <section id="trust" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ maxWidth: '820px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            color: '#f59e0b',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            Engineering Transparency
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Our System Boundaries & Trust Principles</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            We build trust by being transparent about what our system can and cannot do. CAUSORE is designed to communicate uncertainty rather than feigning omniscient accuracy.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {principles.map((item, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                {item.icon}
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.65rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flexGrow: 1 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
