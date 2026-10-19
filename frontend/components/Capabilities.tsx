'use client';

import React from 'react';
import { Database, Clock, TrendingUp, Network, ListTree, Sliders, Cpu, FileSpreadsheet } from 'lucide-react';

export default function Capabilities() {
  const capabilities = [
    {
      icon: <Database size={22} color="#38bdf8" />,
      title: 'Multi-Source Evidence Ingestion',
      description: 'Ingests application and access logs, JSON payload dumps, CSV metrics, PDF post-mortems, and dashboard screenshots within an isolated security boundary.',
      tag: 'Ingestion'
    },
    {
      icon: <Clock size={22} color="#06b6d4" />,
      title: 'Canonical Timeline Reconstruction',
      description: 'Resolves differing timezone representations into a unified UTC ISO-8601 timeline, partitioned across pre-incident baseline, active outage, and stabilization.',
      tag: 'Sequencing'
    },
    {
      icon: <TrendingUp size={22} color="#10b981" />,
      title: 'Statistical Anomaly Detection',
      description: 'Calculates rolling z-scores and error rate cliffs using scikit-learn models to spot traffic drops and latency anomalies before alerts fire.',
      tag: 'Analytics'
    },
    {
      icon: <Network size={22} color="#a855f7" />,
      title: 'Service Topology & Blast Radius',
      description: 'Constructs directed dependency graphs with NetworkX to trace cascade paths from edge reverse proxies down to database and caching layers.',
      tag: 'Graph Core'
    },
    {
      icon: <ListTree size={22} color="#f59e0b" />,
      title: 'Competing Hypothesis Generation',
      description: 'Avoids premature lock-in by generating and evaluating multiple competing candidate causes based on empirical telemetry patterns.',
      tag: 'Hypotheses'
    },
    {
      icon: <Sliders size={22} color="#ef4444" />,
      title: 'Deterministic Evidence Scoring',
      description: 'Scores each hypothesis by explicitly calculating supporting facts versus contradicting evidence, while highlighting unmonitored blindspots.',
      tag: 'Scoring'
    },
    {
      icon: <Cpu size={22} color="#3b82f6" />,
      title: 'Grounded AI Reasoning',
      description: 'Feeds structured normalized facts (never unparsed dumps) into LLMs to generate counter-factual explanations and diagnostic runbook commands.',
      tag: 'AI Layer'
    },
    {
      icon: <FileSpreadsheet size={22} color="#ec4899" />,
      title: 'Reproducible Investigation Reports',
      description: 'Compiles comprehensive post-incident artifacts with explicit OBSERVED, CORRELATED, and INFERRED labels, exportable to Markdown, JSON, and PDF.',
      tag: 'Reporting'
    }
  ];

  return (
    <section id="capabilities" className="section">
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#60a5fa',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            Technical Capabilities
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Built for Modern Distributed Systems</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            Each module is architected for deterministic precision, low overhead, and full evidence auditability.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '1.5rem',
        }}>
          {capabilities.map((cap, idx) => (
            <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {cap.icon}
                </div>
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {cap.tag}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.65rem' }}>
                {cap.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flexGrow: 1 }}>
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
