import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ArrowLeft, Terminal, UploadCloud, Shield, Activity, GitBranch } from 'lucide-react';

export default function InvestigateLandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flexGrow: 1, padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            marginBottom: '2rem'
          }}>
            <ArrowLeft size={16} />
            <span>Back to Overview</span>
          </Link>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-medium)',
            borderRadius: '12px',
            padding: '2.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#60a5fa'
              }}>
                <Activity size={22} />
              </div>
              <div>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--brand-cyan)' }}>
                  INVESTIGATION DISPATCHER
                </span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                  Incident Investigation Workspace
                </h1>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Welcome to the CAUSORE investigation dispatch terminal. Phase 1 provides the public foundation. Phase 2 unlocks the multi-step incident wizard, drag-and-drop evidence ingestion dropzone, and live timeline reconstruction.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '2.5rem'
            }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <span className="mono" style={{ fontSize: '0.75rem', color: '#60a5fa', display: 'block', marginBottom: '0.35rem' }}>Step 1</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Incident Metadata</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Severity, environment, and affected services.</p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <span className="mono" style={{ fontSize: '0.75rem', color: '#10b981', display: 'block', marginBottom: '0.35rem' }}>Step 2</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Evidence Upload</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Logs, JSON, PDF reports, screenshots.</p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <span className="mono" style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'block', marginBottom: '0.35rem' }}>Step 3</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>Deployments & Graph</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Commit diffs and service dependencies.</p>
              </div>
            </div>

            <div style={{
              padding: '1.25rem',
              backgroundColor: '#090d14',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span className="badge badge-observed">Phase 1 Online</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Phase 2 (Workspace UI) is queued for development.
                </span>
              </div>
              <Link href="/" className="btn btn-secondary btn-sm">
                Explore Architecture Overview
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
