'use client';

import React, { useEffect } from 'react';
import { NormalizedEvent } from '../../types';
import { X, Copy, Check, FileCode, Clock, ShieldCheck, Terminal } from 'lucide-react';

interface Props {
  event: NormalizedEvent | null;
  onClose: () => void;
}

export default function EvidenceModal({ event, onClose }: Props) {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const handleCopy = () => {
    const content = JSON.stringify(event, null, 2);
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
      case 'error':
        return '#ef4444';
      case 'warn':
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#38bdf8';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          backgroundColor: '#0d1117',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#161b22',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Terminal size={18} color="var(--brand-cyan)" />
            <div>
              <span
                className="mono"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.02em',
                }}
              >
                Evidence Inspector // Raw Record Trace
              </span>
              <div
                style={{
                  fontSize: '0.725rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: '0.15rem',
                }}
              >
                <FileCode size={12} />
                <span>
                  {event.sourceFile}:{event.sourceLine || '1'}
                </span>
                <span>•</span>
                <span className="mono">{event.id}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              className="mono"
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              Esc to close
            </span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
              }}
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Metadata Highlights Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#161b22',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Service
              </div>
              <div className="mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-primary)', marginTop: '0.2rem' }}>
                {event.service}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#161b22',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Severity Level
              </div>
              <div
                className="mono"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: getSeverityColor(event.level),
                  marginTop: '0.2rem',
                }}
              >
                {event.level.toUpperCase()}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#161b22',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Timestamp (UTC)
              </div>
              <div
                className="mono"
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-primary)',
                  marginTop: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Clock size={12} color="var(--brand-cyan)" />
                {event.timestamp}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#161b22',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Epistemic Status
              </div>
              <div
                className="mono"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#10b981',
                  marginTop: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <ShieldCheck size={13} />
                OBSERVED
              </div>
            </div>
          </div>

          {/* Raw Log Statement */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.4rem',
              }}
            >
              <span
                className="mono"
                style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
              >
                Raw Log Content
              </span>
            </div>
            <pre
              style={{
                margin: 0,
                padding: '1rem',
                backgroundColor: '#030712',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#e2e8f0',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {event.message}
            </pre>
          </div>

          {/* Canonical Normalized JSON */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.4rem',
              }}
            >
              <span
                className="mono"
                style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}
              >
                Canonical Normalized Object (BRAIN.md Section 4)
              </span>
              <button
                onClick={handleCopy}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'none',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  padding: '0.25rem 0.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.725rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                padding: '1rem',
                backgroundColor: '#030712',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#38bdf8',
                lineHeight: 1.5,
                overflowX: 'auto',
                maxHeight: '220px',
              }}
            >
              {JSON.stringify(event, null, 2)}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#161b22',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <span>Line citation: [{event.sourceFile}:{event.sourceLine || '1'}]</span>
          <button
            onClick={onClose}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
