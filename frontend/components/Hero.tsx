'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Activity, Zap, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="section radial-glow bg-dotted" style={{ paddingTop: '5rem', paddingBottom: '5.5rem' }}>
      <div className="container">
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', marginBottom: '3.75rem' }}>
          
          {/* Positioning Tag with Matte Yellow Glow */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.95rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(234, 179, 8, 0.12)',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            color: '#facc15',
            fontSize: '0.825rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 0 15px rgba(234, 179, 8, 0.15)',
          }}>
            <Activity size={14} color="#facc15" />
            <span>Deterministic Incident Reasoning Engine</span>
          </div>

          {/* Main Title with Matte Yellow Accent */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em',
            color: '#ffffff'
          }}>
            Evidence-Driven Incident Investigation for{' '}
            <span style={{
              color: '#eab308',
              textShadow: '0 0 25px rgba(234, 179, 8, 0.3)',
            }}>
              Modern Engineering
            </span>{' '}
            Teams
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '740px',
            margin: '0 auto 2.25rem'
          }}>
            CAUSORE does not simply ask an LLM to summarize an incident. It normalizes telemetry, reconstructs timelines, isolates anomalies, traverses dependency graphs, and evaluates competing root-cause hypotheses with verified evidence.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/investigate" className="btn btn-primary" style={{ padding: '0.75rem 1.6rem', fontSize: '1rem' }} id="hero-cta-investigate">
              <Zap size={18} />
              <span>Investigate an Incident</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="btn btn-secondary" style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}>
              <span>View How It Works</span>
            </a>
          </div>

          {/* Engineering Tenet Tagline */}
          <div style={{ marginTop: '2.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', fontSize: '0.825rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} color="#10b981" /> Evidence-First
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} color="#eab308" /> Deterministic Pipeline
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <CheckCircle2 size={14} color="#f59e0b" /> Fact vs Inference Separation
            </span>
          </div>
        </div>

        {/* Live Interactive Investigation Artifact Preview (High-Density Engineering UI) */}
        <div style={{
          maxWidth: '1020px',
          margin: '0 auto',
          boxShadow: '0 25px 50px -15px rgba(0,0,0,0.85), 0 0 0 1px rgba(234,179,8,0.25)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          {/* Terminal Window Header */}
          <div style={{
            backgroundColor: '#11151c',
            borderBottom: '1px solid var(--border-medium)',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#eab308' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              </div>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                inc-202610-checkout-cascade // RCA Pipeline Active
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-sev1">SEV-1</span>
              <span className="badge badge-yellow">Pipeline: 16/16 Stages Complete</span>
            </div>
          </div>

          {/* Investigation Panel Content */}
          <div style={{
            backgroundColor: '#0a0d12',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            {/* Timeline Stream Preview */}
            <div style={{ padding: '1.25rem', borderRight: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Synchronized UTC Timeline
                </span>
                <span className="mono" style={{ fontSize: '0.75rem', color: '#facc15' }}>
                  3 Sources Correlated
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Event 1 */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.8rem' }}>
                  <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    14:00:30 UTC
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-observed" style={{ fontSize: '0.65rem' }}>OBSERVED</span>
                      <span className="mono" style={{ color: '#facc15' }}>deploy/payment-svc</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Canary rollout v2.4.1 initialized. Commit SHA <code style={{ color: '#fde047' }}>a8f1bc4</code>.
                    </p>
                  </div>
                </div>

                {/* Event 2 */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.8rem' }}>
                  <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    14:02:15 UTC
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-correlated" style={{ fontSize: '0.65rem' }}>CORRELATED</span>
                      <span className="mono" style={{ color: '#ef4444' }}>db-pool / timeout</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Connection acquisition latency spiked from 4ms to 8,400ms across 12 pods.
                    </p>
                  </div>
                </div>

                {/* Event 3 */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.8rem' }}>
                  <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    14:03:02 UTC
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span className="badge badge-observed" style={{ fontSize: '0.65rem' }}>OBSERVED</span>
                      <span className="mono" style={{ color: '#f59e0b' }}>api-gateway</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      HTTP 504 Gateway Timeout cascade on <code style={{ color: '#fde047' }}>/v1/checkout</code> (430 req/sec dropped).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Root-Cause Output Preview */}
            <div style={{ padding: '1.25rem', backgroundColor: '#0f131a' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  Evaluated Hypothesis #1
                </span>
                <span className="badge badge-yellow">Confidence: 86%</span>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                  Database connection-pool exhaustion in payment-service
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="badge badge-inferred">Status: INFERRED</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Blast Radius: 3 downstream services</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.78rem' }}>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong style={{ color: '#10b981', display: 'block', marginBottom: '0.2rem' }}>Supporting Evidence:</strong>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    • Connection wait spike coincides with commit a8f1bc4 (reduced pool size to 10).<br/>
                    • 142 timeout errors logged between 14:02:15 and 14:15:00 UTC.
                  </span>
                </div>

                <div style={{ backgroundColor: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.25)', padding: '0.65rem', borderRadius: '6px' }}>
                  <strong style={{ color: '#facc15', display: 'block', marginBottom: '0.2rem' }}>Missing Evidence:</strong>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    • Postgres <code style={{ color: '#fde047' }}>pg_stat_activity</code> snapshot not provided in upload.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Bar */}
          <div style={{
            backgroundColor: '#12161f',
            padding: '0.75rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Terminal size={14} color="#facc15" />
              <strong>Recommended Engineer Verification:</strong> Inspect <code style={{ color: '#fde047' }}>DB_POOL_MAX_SIZE</code> in payment-service container env.
            </span>
            <span className="mono" style={{ color: 'var(--text-muted)' }}>
              Deterministic Engine • Traceable Evidence
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
