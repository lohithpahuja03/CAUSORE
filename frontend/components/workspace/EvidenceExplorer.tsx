'use client';

import React, { useState } from 'react';
import { NormalizedEvent } from '../../types';
import EvidenceModal from './EvidenceModal';
import { FileCode, Search, Copy, Check, Maximize2, Filter, AlertCircle } from 'lucide-react';

interface Props {
  events: NormalizedEvent[];
}

export default function EvidenceExplorer({ events }: Props) {
  const [selectedFile, setSelectedFile] = useState<string>(
    events[0]?.sourceFile || 'payment-service.log'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'ERROR' | 'WARN' | 'INFO'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectingEvent, setInspectingEvent] = useState<NormalizedEvent | null>(null);

  const files = Array.from(new Set(events.map((e) => e.sourceFile)));
  
  const filteredEvents = events.filter((e) => {
    if (e.sourceFile !== selectedFile) return false;
    if (levelFilter !== 'ALL' && e.level.toUpperCase() !== levelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.message.toLowerCase().includes(q) ||
        e.service.toLowerCase().includes(q) ||
        String(e.sourceLine || '').includes(q)
      );
    }
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Evidence Modal */}
      <EvidenceModal
        event={inspectingEvent}
        onClose={() => setInspectingEvent(null)}
      />

      <div style={{
        padding: '0.85rem 1.25rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
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
                onClick={() => {
                  setSelectedFile(file);
                  setSearchQuery('');
                }}
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
          {/* Header & Filter Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Source: {selectedFile} ({filteredEvents.length} citations)
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Search Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#070b12',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '0.35rem 0.6rem',
                fontSize: '0.75rem',
              }}>
                <Search size={13} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    width: '140px',
                  }}
                />
              </div>

              {/* Level Filter Pills */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {(['ALL', 'ERROR', 'WARN', 'INFO'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLevelFilter(lvl)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      border: levelFilter === lvl ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: levelFilter === lvl ? 'var(--bg-surface-elevated)' : 'transparent',
                      color: levelFilter === lvl ? '#fff' : 'var(--text-muted)',
                      fontSize: '0.7rem',
                      fontFamily: 'var(--font-mono)',
                      cursor: 'pointer',
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List of Evidence Lines or Empty State */}
          {filteredEvents.length === 0 ? (
            <div style={{
              padding: '3rem 1rem',
              textAlign: 'center',
              backgroundColor: '#090d14',
              borderRadius: '8px',
              border: '1px dashed var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <AlertCircle size={28} color="var(--text-muted)" />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                No records match your filter criteria in <span className="mono">{selectedFile}</span>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setLevelFilter('ALL');
                }}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--brand-primary)',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredEvents.map((evt) => (
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
                      <span style={{
                        color: evt.level.toUpperCase() === 'ERROR' || evt.level.toUpperCase() === 'CRITICAL'
                          ? '#ef4444'
                          : evt.level.toUpperCase() === 'WARN'
                          ? '#f59e0b'
                          : '#10b981',
                        fontWeight: 600,
                      }}>
                        {evt.level}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <button
                        onClick={() => setInspectingEvent(evt)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--brand-cyan)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.7rem'
                        }}
                        title="Inspect in Modal"
                      >
                        <Maximize2 size={12} />
                        <span>Inspect</span>
                      </button>

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
                  </div>

                  <div style={{ color: '#f8fafc', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {evt.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
