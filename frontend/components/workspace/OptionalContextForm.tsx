'use client';

import React from 'react';
import { GitCommit, Network, FileEdit, Play, ArrowLeft } from 'lucide-react';

export interface OptionalContextData {
  deploymentNotes: string;
  dependencyMapJson: string;
  responderNotes: string;
}

interface Props {
  contextData: OptionalContextData;
  onChange: (data: Partial<OptionalContextData>) => void;
  onStartInvestigation: () => void;
  onBack: () => void;
  isReady: boolean;
}

export default function OptionalContextForm({
  contextData,
  onChange,
  onStartInvestigation,
  onBack,
  isReady,
}: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div style={{
        padding: '0.85rem 1rem',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)'
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>Optional Context:</strong> Adding deployment histories and service topology assists CAUSORE in computing cross-service blast radius and temporal correlation.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Deployments */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            <GitCommit size={16} color="#38bdf8" />
            <span>Recent Deployments & Configuration Changes</span>
          </label>
          <textarea
            id="textarea-deployment-notes"
            rows={3}
            placeholder="e.g. 14:00:15 UTC - payment-service v2.4.1 canary rollout (commit a8f1bc4: tune connection parameters)"
            value={contextData.deploymentNotes}
            onChange={(e) => onChange({ deploymentNotes: e.target.value })}
            style={{
              width: '100%',
              padding: '0.7rem 0.9rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Dependency Map JSON */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            <Network size={16} color="#a855f7" />
            <span>Service Dependency Graph (JSON)</span>
          </label>
          <textarea
            id="textarea-dependency-json"
            rows={4}
            placeholder='e.g. { "api-gateway": ["checkout-api"], "checkout-api": ["payment-service"], "payment-service": ["postgres-core"] }'
            value={contextData.dependencyMapJson}
            onChange={(e) => onChange({ dependencyMapJson: e.target.value })}
            style={{
              width: '100%',
              padding: '0.7rem 0.9rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Responder Notes */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            <FileEdit size={16} color="#10b981" />
            <span>On-Call Responder Notes & Hypotheses</span>
          </label>
          <textarea
            id="textarea-responder-notes"
            rows={2}
            placeholder="Any specific clues, hypothesis hints, or commands executed during the incident bridge..."
            value={contextData.responderNotes}
            onChange={(e) => onChange({ responderNotes: e.target.value })}
            style={{
              width: '100%',
              padding: '0.7rem 0.9rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '1.25rem',
        borderTop: '1px solid var(--border-subtle)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <button
          type="button"
          onClick={onBack}
          className="btn btn-secondary"
        >
          ← Back to Evidence
        </button>

        <button
          type="button"
          onClick={onStartInvestigation}
          disabled={!isReady}
          className="btn btn-primary"
          id="btn-launch-investigation"
          style={{
            padding: '0.75rem 1.75rem',
            fontSize: '0.95rem',
            opacity: isReady ? 1 : 0.5,
            cursor: isReady ? 'pointer' : 'not-allowed'
          }}
        >
          <Play size={16} fill="currentColor" />
          <span>Launch Investigation Pipeline</span>
        </button>
      </div>
    </div>
  );
}
