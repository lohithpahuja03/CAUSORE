'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Github, BookOpen, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#05070a',
      borderTop: '1px solid var(--border-subtle)',
      padding: '4rem 0 2.5rem',
      fontSize: '0.875rem',
      color: 'var(--text-muted)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3.5rem'
        }}>
          {/* Brand Info */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Terminal size={16} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                CAUSORE
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Evidence-driven incident investigation platform for modern engineering teams. Reconstructing timelines, correlating telemetry, and evaluating competing hypotheses.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="https://github.com/lohithpahuja03/CAUSORE"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <Github size={14} />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><a href="#how-it-works" style={{ color: 'var(--text-secondary)' }}>Investigation Pipeline</a></li>
              <li><a href="#capabilities" style={{ color: 'var(--text-secondary)' }}>Anomaly Detection</a></li>
              <li><a href="#capabilities" style={{ color: 'var(--text-secondary)' }}>Dependency Traversal</a></li>
              <li><a href="#differentiation" style={{ color: 'var(--text-secondary)' }}>Fact vs Inference</a></li>
              <li><Link href="/investigate" style={{ color: 'var(--text-secondary)' }}>Investigate Incident</Link></li>
            </ul>
          </div>

          {/* Documentation & Principles */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Architecture
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><a href="https://github.com/lohithpahuja03/CAUSORE/blob/main/BRAIN.md" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>Project Constitution (BRAIN.md)</a></li>
              <li><a href="https://github.com/lohithpahuja03/CAUSORE/blob/main/ROADMAP.md" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>Project Roadmap</a></li>
              <li><a href="https://github.com/lohithpahuja03/CAUSORE/blob/main/README.md" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>Technical Overview</a></li>
              <li><a href="#trust" style={{ color: 'var(--text-secondary)' }}>Trust & Limitations</a></li>
            </ul>
          </div>

          {/* Standards & Personas */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Engineering
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li><a href="#users" style={{ color: 'var(--text-secondary)' }}>For SRE Teams</a></li>
              <li><a href="#users" style={{ color: 'var(--text-secondary)' }}>For DevOps Engineers</a></li>
              <li><a href="#users" style={{ color: 'var(--text-secondary)' }}>For Incident Responders</a></li>
              <li><span className="mono" style={{ fontSize: '0.75rem', color: '#10b981' }}>● System: v0.1.0 Ready</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem'
        }}>
          <span>
            © {new Date().getFullYear()} CAUSORE. Evidence first. Investigation second. Explanation third.
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Deterministic Pipeline</span>
            <span style={{ color: 'var(--text-muted)' }}>Open Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
