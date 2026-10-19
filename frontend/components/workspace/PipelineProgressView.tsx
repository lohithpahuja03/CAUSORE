'use client';

import React from 'react';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';

export interface PipelineStageStatus {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  details?: string;
}

interface Props {
  stages: PipelineStageStatus[];
  currentStageIndex: number;
}

export default function PipelineProgressView({ stages, currentStageIndex }: Props) {
  const completedCount = stages.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / stages.length) * 100);

  return (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-medium)',
      borderRadius: '10px',
      padding: '2.5rem 2rem',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          color: '#60a5fa'
        }}>
          <Loader2 size={24} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Deterministic Investigation Pipeline Active
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Processing evidence, synchronizing UTC timestamps, detecting anomalies, and scoring root-cause hypotheses...
        </p>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '9999px',
          overflow: 'hidden',
          marginTop: '1.25rem'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: 'var(--brand-primary)',
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
          {progressPercent}% Complete ({completedCount}/{stages.length} stages)
        </span>
      </div>

      {/* Stage Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {stages.map((stage, idx) => {
          const isCurrent = stage.status === 'active';
          const isCompleted = stage.status === 'completed';
          const isPending = stage.status === 'pending';

          return (
            <div
              key={stage.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: isCurrent ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-surface)',
                border: `1px solid ${isCurrent ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-subtle)'}`,
                borderRadius: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {isCompleted ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : isCurrent ? (
                  <Loader2 size={18} color="#3b82f6" style={{ animation: 'spin 1.5s linear infinite' }} />
                ) : (
                  <Circle size={18} color="var(--text-muted)" />
                )}

                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: isCurrent ? 600 : 500,
                  color: isCompleted ? 'var(--text-primary)' : isCurrent ? '#93c5fd' : 'var(--text-muted)',
                }}>
                  {stage.name}
                </span>
              </div>

              {stage.details && (
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {stage.details}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
