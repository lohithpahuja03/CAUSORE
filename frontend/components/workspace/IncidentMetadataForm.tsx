'use client';

import React from 'react';
import { IncidentMetadata, IncidentSeverity } from '../../types';
import { AlertCircle, Calendar, Tag, Server, AlignLeft } from 'lucide-react';

interface Props {
  metadata: Partial<IncidentMetadata>;
  onChange: (updated: Partial<IncidentMetadata>) => void;
  onNext: () => void;
  onLoadSample: () => void;
}

export default function IncidentMetadataForm({
  metadata,
  onChange,
  onNext,
  onLoadSample,
}: Props) {
  const isFormValid =
    Boolean(metadata.title?.trim()) &&
    Boolean(metadata.severity) &&
    Boolean(metadata.environment?.trim()) &&
    Boolean(metadata.startTime);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Sample Loader Banner */}
      <div style={{
        padding: '0.85rem 1.25rem',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span className="badge badge-inferred" style={{ fontSize: '0.7rem' }}>Demo Helper</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Want to test CAUSORE with a pre-configured production outage?
          </span>
        </div>
        <button
          type="button"
          onClick={onLoadSample}
          className="btn btn-secondary btn-sm"
          id="btn-load-sample-incident"
        >
          Load Sample SEV-1 Incident
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {/* Incident Title */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Incident Title <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            id="input-incident-title"
            placeholder="e.g. Checkout API 504 Gateway Timeouts During Flash Sale"
            value={metadata.title || ''}
            onChange={(e) => onChange({ title: e.target.value })}
            style={{
              width: '100%',
              padding: '0.7rem 0.9rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-sans)',
              outline: 'none',
            }}
          />
        </div>

        {/* Severity */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Severity Level <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            id="select-incident-severity"
            value={metadata.severity || 'SEV-1'}
            onChange={(e) => onChange({ severity: e.target.value as IncidentSeverity })}
            style={{
              width: '100%',
              padding: '0.7rem 0.9rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          >
            <option value="SEV-1">SEV-1 (Critical Customer Outage)</option>
            <option value="SEV-2">SEV-2 (Major Service Degradation)</option>
            <option value="SEV-3">SEV-3 (Moderate Partial Disruption)</option>
            <option value="SEV-4">SEV-4 (Minor Internal Issue)</option>
          </select>
        </div>

        {/* Environment */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Environment <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            id="input-incident-environment"
            placeholder="e.g. production-us-east-1"
            value={metadata.environment || ''}
            onChange={(e) => onChange({ environment: e.target.value })}
            style={{
              width: '100%',
              padding: '0.7rem 0.9rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Start Time UTC */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Incident Start Time (UTC) <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            id="input-incident-start-time"
            placeholder="YYYY-MM-DDTHH:MM:SSZ (e.g. 2026-10-18T14:00:00Z)"
            value={metadata.startTime || ''}
            onChange={(e) => onChange({ startTime: e.target.value })}
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
            }}
          />
        </div>

        {/* End Time UTC */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Incident Resolution / End Time (UTC)
          </label>
          <input
            type="text"
            id="input-incident-end-time"
            placeholder="Optional if ongoing (e.g. 2026-10-18T14:28:30Z)"
            value={metadata.endTime || ''}
            onChange={(e) => onChange({ endTime: e.target.value })}
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
            }}
          />
        </div>

        {/* Affected Services */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Known Affected Services (Comma-separated)
          </label>
          <input
            type="text"
            id="input-affected-services"
            placeholder="e.g. api-gateway, checkout-api, payment-service, postgres-core"
            value={metadata.affectedServices?.join(', ') || ''}
            onChange={(e) => {
              const services = e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
              onChange({ affectedServices: services });
            }}
            style={{
              width: '100%',
              padding: '0.7rem 0.9rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Description */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
            Incident Description & Summary
          </label>
          <textarea
            id="textarea-incident-description"
            rows={3}
            placeholder="Describe the symptoms observed, customer impact, and initial responder notes..."
            value={metadata.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            style={{
              width: '100%',
              padding: '0.7rem 0.9rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-sans)',
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <button
          type="button"
          onClick={onNext}
          disabled={!isFormValid}
          className="btn btn-primary"
          id="btn-next-step-1"
          style={{ opacity: isFormValid ? 1 : 0.5, cursor: isFormValid ? 'pointer' : 'not-allowed' }}
        >
          Proceed to Evidence Upload →
        </button>
      </div>
    </div>
  );
}
