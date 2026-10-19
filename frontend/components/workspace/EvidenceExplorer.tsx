'use client';

import React, { useState } from 'react';
import { NormalizedEvent } from '../../types';
import { FileCode, Search, Copy, Check, ExternalLink } from 'lucide-react';

interface Props {
  events: NormalizedEvent[];
}

export default function EvidenceExplorer({ events }: Props) {
  const [selectedFile, setSelectedFile] = useState<string>(
    events[0]?.sourceFile || 'payment-service.log'
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const files = Array.from(new Set(events.map((e) => e.sourceFile)));
  const fileEvents = events.filter((e) => e.sourceFile === selectedFile);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
          Traceable Evidence Explorer (Principle 6: Evidence Traceability)
        </span>
        <span className="mono" style={{ color: 'var(--brand-cyan)' }}>
          {files.length} Ingested Telemetry Streams
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '1rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {/* Source File Sidebar */}
        <div style={{
          backgroundColor: '#0c1017',
          borderRight: '1px solid var(--border-subtle)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <span className="mono" style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Evidence Streams
          </span>
          {files.map((file) => {
            const count = events.filter((e) => e.sourceFile === file).length;
            const isSelected = selectedFile === file;

            return (
              <button
                key={file}
                onClick={() => setSelectedFile(file)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'transparent',
                  border: isSelected ? '1px solid var(--brand-primary)' : '1px solid transparent',
                  borderRadius: '6px',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                  <FileCode size={14} color={isSelected ? '#38bdf8' : 'var(--text-muted)'} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-muted)'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Evidence Lines Viewer */}
        <div style={{ padding: '1.25rem', overflowX: 'auto' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Source: {selectedFile} ({fileEvents.length} extracted citations)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {fileEvents.map((evt) => (
              <div
                key={evt.id}
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: '#090d14',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.725rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#38bdf8' }}>Line {evt.sourceLine || 'N/A'}</span>
                    <span>•</span>
                    <span>{evt.timestamp}</span>
                    <span>•</span>
                    <span style={{ color: evt.level === 'ERROR' ? '#ef4444' : '#10b981' }}>{evt.level}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(evt.message, evt.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.7rem'
                    }}
                  >
                    {copiedId === evt.id ? (
                      <>
                        <Check size={12} color="#10b981" />
                        <span style={{ color: '#10b981' }}>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div style={{ color: '#f8fafc', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                  {evt.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
