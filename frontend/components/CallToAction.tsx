'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Shield, UploadCloud } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="section" style={{
      background: 'linear-gradient(180deg, var(--bg-primary) 0%, #0a101d 100%)',
      borderBottom: 'none'
    }}>
      <div className="container">
        <div style={{
          maxWidth: '860px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.6)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(59, 130, 246, 0.12)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#60a5fa',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            marginBottom: '1.25rem',
            textTransform: 'uppercase'
          }}>
            Ready For Your Next Fire Drill?
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '1.25rem', fontWeight: 700 }}>
            Start Investigating Your Incidents Today
          </h2>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: '620px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6
          }}>
            Drop in your logs, deployments, and outage context. CAUSORE will reconstruct the timeline and calculate evidence-backed root-cause hypotheses in seconds.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/investigate" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }} id="final-cta-investigate">
              <span>Investigate Your Incident</span>
              <ArrowRight size={18} />
            </Link>
            <a href="https://github.com/lohithpahuja03/CAUSORE" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '0.75rem 1.4rem' }}>
              <span>View Source on GitHub</span>
            </a>
          </div>

          <div style={{
            marginTop: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <span>• No credit card required</span>
            <span>• Fully auditable evidence pipeline</span>
            <span>• Strict zero-leakage security</span>
          </div>
        </div>
      </div>
    </section>
  );
}
