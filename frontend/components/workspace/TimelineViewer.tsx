'use client';

import React, { useState } from 'react';
import { NormalizedEvent } from '../../types';
import EvidenceModal from './EvidenceModal';
import { Search, Clock, ChevronDown, ChevronRight, Maximize2, AlertCircle, Copy, Check } from 'lucide-react';

interface Props {
  events: NormalizedEvent[];
}

export default function TimelineViewer({ events }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [inspectingEvent, setInspectingEvent] = useState<NormalizedEvent | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const services = ['ALL', ...Array.from(new Set(events.map((e) => e.service)))];
  const levels = ['ALL', 'INFO', 'WARN', 'ERROR', 'FATAL'];

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.sourceFile.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesService = selectedService === 'ALL' || evt.service === selectedService;
    const matchesLevel = selectedLevel === 'ALL' || evt.level === selectedLevel;

    return matchesSearch && matchesService && matchesLevel;
  });

  const handleCopyCitation = (evt: NormalizedEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    const citation = `[${evt.sourceFile}:${evt.sourceLine || '1'}] ${evt.timestamp} ${evt.service} - ${evt.message}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(evt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLevelBadgeClass = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
      case 'FATAL':
      case 'CRITICAL':
        return 'badge-sev1';
      case 'WARN':
      case 'WARNING':
        return 'badge-inferred';
      default:
        return 'badge-observed';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Evidence Modal Inspector */}
      <EvidenceModal
        event={inspectingEvent}
        onClose={() => setInspectingEvent(null)}
      />

      {/* Search and Filters Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexGrow: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search timeline events, messages, sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Service Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Service:</span>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                padding: '0.3rem 0.6rem',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            >
              {services.map((svc) => (
                <option key={svc} value={svc}>{svc}</option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                padding: '0.3rem 0.6rem',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '0.75rem 1.25rem',
          backgroundColor: '#0c1017',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)'
        }}>
          <span>CHRONOLOGICAL EVENT STREAM ({filteredEvents.length} events)</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={13} color="var(--brand-cyan)" />
            TIMEZONE: UTC (CANONICAL)
          </span>
        </div>

        {filteredEvents.length === 0 ? (
          <div style={{
            padding: '3rem 1.5rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <AlertCircle size={28} color="var(--text-muted)" />
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              No events match active filter criteria.
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedService('ALL');
                setSelectedLevel('ALL');
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredEvents.map((evt, idx) => {
              const isExpanded = expandedEventId === evt.id;

              return (
                <div
                  key={evt.id}
                  style={{
                    borderBottom: idx < filteredEvents.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    padding: '0.9rem 1.25rem',
                    transition: 'background-color 0.1s ease',
                  }}
                >
                  <div
                    onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flexGrow: 1 }}>
                      <span style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </span>

                      <div style={{ flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                          <span className={`badge ${getLevelBadgeClass(evt.level)}`} style={{ fontSize: '0.65rem' }}>
                            {evt.level}
                          </span>
                          <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>
                            {evt.service}
                          </span>
                          <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {evt.timestamp}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                          {evt.message}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                      <span className="mono" style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {evt.sourceFile}:{evt.sourceLine || '1'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectingEvent(evt);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--brand-cyan)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.2rem',
                        }}
                        title="Inspect in Modal"
                      >
                        <Maximize2 size={13} />
                      </button>

                      <button
                        onClick={(e) => handleCopyCitation(evt, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.2rem',
                        }}
                        title="Copy citation"
                      >
                        {copiedId === evt.id ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Inspector */}
                  {isExpanded && (
                    <div style={{
                      marginTop: '0.75rem',
                      marginLeft: '1.85rem',
                      padding: '0.85rem',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span>Event ID: {evt.id}</span>
                        <span>Fingerprint: {evt.fingerprint || 'N/A'}</span>
                      </div>

                      {evt.attributes && Object.keys(evt.attributes).length > 0 && (
                        <div>
                          <span style={{ color: '#60a5fa', display: 'block', marginBottom: '0.25rem' }}>Structured Attributes:</span>
                          <pre style={{ color: '#e2e8f0', whiteSpace: 'pre-wrap', margin: 0 }}>
                            {JSON.stringify(evt.attributes, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
