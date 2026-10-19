'use client';

import React from 'react';
import { Anomaly } from '../../types';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

interface Props {
  anomalies: Anomaly[];
}

export default function AnomalyViewer({ anomalies }: Props) {
  const getAnomalyIcon = (type: Anomaly['anomalyType']) => {
    switch (type) {
      case 'error_spike':
        return <AlertTriangle size={18} color="#ef4444" />;
      case 'latency_cliff':
        return <TrendingUp size={18} color="#f97316" />;
      case 'volume_drop':
        return <TrendingDown size={18} color="#facc15" />;
      default:
        return <Activity size={18} color="#38bdf8" />;
    }
  };

  const getAnomalyTypeLabel = (type: Anomaly['anomalyType']) => {
    switch (type) {
      case 'error_spike':
        return 'Error Rate Spike';
      case 'latency_cliff':
        return 'Latency Cliff';
      case 'volume_drop':
        return 'Traffic Volume Drop';
      default:
        return 'Pattern Deviation';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{
        padding: '0.85rem 1.25rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.85rem'
      }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          Statistical Anomaly Detection (Scikit-Learn Isolation & Z-Score Analysis)
        </span>
        <span className="mono" style={{ color: 'var(--brand-cyan)' }}>
          {anomalies.length} Critical Outliers Isolated
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {anomalies.map((anom) => (
          <div
            key={anom.id}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {getAnomalyIcon(anom.anomalyType)}
                <span className="badge badge-sev1" style={{ fontSize: '0.65rem' }}>
                  {getAnomalyTypeLabel(anom.anomalyType)}
                </span>
              </div>
              <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f87171' }}>
                Anomaly Score: {Math.round(anom.score * 100)}%
              </span>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              {anom.service}
            </h4>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', flexGrow: 1 }}>
              {anom.description}
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              padding: '0.65rem',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Baseline:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>{anom.baselineValue}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Observed Peak:</span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>{anom.observedValue}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              <Clock size={12} />
              <span className="mono">{anom.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
