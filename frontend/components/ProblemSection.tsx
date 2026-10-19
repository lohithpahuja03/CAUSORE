'use client';

import React from 'react';
import { Layers, Clock, AlertOctagon, HelpCircle, FileSearch, ArrowDown } from 'lucide-react';

export default function ProblemSection() {
  const painPoints = [
    {
      icon: <Layers size={20} color="#f87171" />,
      title: 'Disjointed Telemetry Silos',
      description:
        'Logs in Datadog, deployments in GitHub Actions, metric spikes in Grafana, and incident notes in Slack. Engineers spend 70% of response time merely copying timestamps between tools.',
    },
    {
      icon: <Clock size={20} color="#fb923c" />,
      title: 'Manual Timestamp Alignment',
      description:
        'Microservices log across differing timezones, epoch formats, and local container clocks. Aligning raw events into a coherent sequence under active incident pressure invites critical human error.',
    },
    {
      icon: <AlertOctagon size={20} color="#facc15" />,
      title: 'Premature Causal Fixation',
      description:
        'Teams frequently lock onto the loudest downstream symptom (e.g., HTTP 504 at the gateway) rather than tracing backwards through the dependency graph to the real underlying fault.',
    },
    {
      icon: <HelpCircle size={20} color="#a78bfa" />,
      title: 'Unverifiable AI Hallucinations',
      description:
        'Generic chatbots feed unparsed text into an LLM, generating authoritative-sounding explanations that invent fake timestamps, ignore topological constraints, and offer zero verifiable traceability.',
    },
  ];

  return (
    <section id="problem" className="section" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="container">
        <div style={{ maxWidth: '780px', margin: '0 auto 3.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            marginBottom: '1rem',
            textTransform: 'uppercase'
          }}>
            The Reality of Production Outages
          </div>
          <h2 style={{ marginBottom: '1rem' }}>
            Traditional Incident Investigation Is Broken
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
            When high-severity incidents strike, distributed architectures fail in subtle, cascading ways. 
            On-call engineers are forced to execute slow, manual, stress-driven triage.
          </p>
        </div>

        {/* Traditional Workflow Timeline Visualizer */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-medium)',
          borderRadius: '8px',
          padding: '2rem 1.5rem',
          marginBottom: '3.5rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              The Painful Traditional Incident Loop (Mean Time to Diagnose: 45–90 mins)
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            {[
              'Incident Triggered',
              'Search & Filter Logs',
              'Inspect Metrics',
              'Check Deployments',
              'Query Dependencies',
              'Manual Timestamp Correlation',
              'Mental Hypothesis Guessing',
              'Manual RCA Drafting'
            ].map((step, idx, arr) => (
              <React.Fragment key={idx}>
                <div style={{
                  padding: '0.5rem 0.85rem',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <span className="mono" style={{ color: 'var(--brand-primary)', fontSize: '0.7rem' }}>0{idx+1}</span>
                  <span>{step}</span>
                </div>
                {idx < arr.length - 1 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 4 Core Pain Points Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {painPoints.map((point, index) => (
            <div key={index} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                {point.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                {point.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flexGrow: 1 }}>
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
