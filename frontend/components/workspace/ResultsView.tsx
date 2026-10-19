'use client';

import React, { useState } from 'react';
import {
  IncidentMetadata,
  NormalizedEvent,
  Anomaly,
  CandidateRootCause,
  InvestigationReport
} from '../../types';
import TimelineViewer from './TimelineViewer';
import AnomalyViewer from './AnomalyViewer';
import HypothesisCard from './HypothesisCard';
import DependencyGraphViewer from './DependencyGraphViewer';
import EvidenceExplorer from './EvidenceExplorer';
import {
  Download,
  RotateCcw,
  Clock,
  ShieldAlert,
  Activity,
  Network,
  ListTree,
  FileText,
  FileJson,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface Props {
  metadata: IncidentMetadata;
  events: NormalizedEvent[];
  anomalies: Anomaly[];
  hypotheses: CandidateRootCause[];
  report: InvestigationReport;
  onReset: () => void;
}

export default function ResultsView({
  metadata,
  events,
  anomalies,
  hypotheses,
  report,
  onReset,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    'summary' | 'timeline' | 'hypotheses' | 'anomalies' | 'graph' | 'evidence'
  >('summary');

  const topHypothesis = hypotheses[0];
  const confidencePercent = topHypothesis ? Math.round(topHypothesis.confidence * 100) : 0;

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const md = `# RCA REPORT: ${metadata.title}
**Severity:** ${metadata.severity} | **Environment:** ${metadata.environment}
**Incident Duration:** ${report.durationMinutes} minutes
**Investigation Generated At:** ${report.generatedAt}

---

## 1. Executive Summary
${report.executiveSummary}

---

## 2. Top Evaluated Hypotheses
${hypotheses
  .map(
    (h, idx) => `### Hypothesis #${idx + 1}: ${h.candidate}
- **Confidence:** ${Math.round(h.confidence * 100)}%
- **Status:** ${h.status}
- **Affected Services:** ${h.affectedServices.join(', ')}

#### Supporting Evidence:
${h.supportingEvidence.map((e) => `- ${e}`).join('\n')}

#### Contradicting Evidence:
${h.contradictingEvidence.length > 0 ? h.contradictingEvidence.map((e) => `- ${e}`).join('\n') : '- None observed in supplied telemetry'}

#### Missing Evidence:
${h.missingEvidence.length > 0 ? h.missingEvidence.map((e) => `- ${e}`).join('\n') : '- None identified'}

#### Recommended Verification Actions:
${h.recommendedVerification.map((v, i) => `${i + 1}. ${v}`).join('\n')}
`
  )
  .join('\n\n')}

---

## 3. Detected Anomalies
${anomalies
  .map(
    (a) => `- **[${a.anomalyType.toUpperCase()}]** ${a.service} (Score: ${Math.round(a.score * 100)}%): ${a.description} [Baseline: ${a.baselineValue}, Peak: ${a.observedValue}]`
  )
  .join('\n')}

---

## 4. Action Items & Verification
${report.actionItems.map((item) => `- ${item}`).join('\n')}
`;
    downloadFile(md, `${metadata.id}_rca_report.md`, 'text/markdown');
  };

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(report, null, 2);
    downloadFile(jsonStr, `${metadata.id}_report.json`, 'application/json');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Executive Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-medium)',
        borderRadius: '10px',
        padding: '1.75rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-sev1">{metadata.severity}</span>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {metadata.id}
              </span>
              <span className="badge badge-observed">Pipeline Complete</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
              {metadata.title}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Environment: <code className="mono">{metadata.environment}</code> • Outage Duration: <strong style={{ color: '#f8fafc' }}>{report.durationMinutes} mins</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownloadMarkdown}
              className="btn btn-secondary btn-sm"
              id="btn-export-markdown"
            >
              <FileText size={15} />
              <span>Export Markdown</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="btn btn-secondary btn-sm"
              id="btn-export-json"
            >
              <FileJson size={15} />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onReset}
              className="btn btn-secondary btn-sm"
            >
              <RotateCcw size={15} />
              <span>New Investigation</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
              Lead Root Cause Confidence
            </span>
            <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981' }}>
              {confidencePercent}%
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
              Status: {topHypothesis?.status || 'INFERRED'}
            </span>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
              Synchronized Events
            </span>
            <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>
              {events.length}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
              Across {metadata.affectedServices.length} services
            </span>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
              Anomalies Isolated
            </span>
            <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f59e0b' }}>
              {anomalies.length}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
              Z-score & error cliffs
            </span>
          </div>

          <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-surface)', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
              Candidate Causes
            </span>
            <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#a855f7' }}>
              {hypotheses.length}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.1rem' }}>
              Competitively scored
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-medium)',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'summary', label: 'Executive Summary', icon: <FileText size={16} /> },
          { id: 'timeline', label: `Timeline (${events.length})`, icon: <Clock size={16} /> },
          { id: 'hypotheses', label: `Root Causes (${hypotheses.length})`, icon: <ListTree size={16} /> },
          { id: 'anomalies', label: `Anomalies (${anomalies.length})`, icon: <Activity size={16} /> },
          { id: 'graph', label: 'Dependency Graph', icon: <Network size={16} /> },
          { id: 'evidence', label: 'Evidence Explorer', icon: <CheckCircle2 size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.65rem 1rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--brand-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'summary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Executive Summary Card */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.75rem', color: '#f8fafc' }}>
                Incident Executive Summary
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {report.executiveSummary}
              </p>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Top Ranked Causal Finding:
              </h4>
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '6px',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-inferred">Confidence: {confidencePercent}%</span>
                  <span className="badge badge-inferred">Status: {topHypothesis.status}</span>
                </div>
                <strong style={{ fontSize: '1rem', color: '#f8fafc' }}>{topHypothesis.candidate}</strong>
              </div>

              {/* Action Items List */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Action Items & Preventive Engineering Recommendations:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {report.actionItems.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)'
                  }}>
                    <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && <TimelineViewer events={events} />}

        {activeTab === 'hypotheses' && (
          <div>
            {hypotheses.map((hypo, idx) => (
              <HypothesisCard key={hypo.id} hypothesis={hypo} rank={idx + 1} />
            ))}
          </div>
        )}

        {activeTab === 'anomalies' && <AnomalyViewer anomalies={anomalies} />}

        {activeTab === 'graph' && <DependencyGraphViewer services={metadata.affectedServices} />}

        {activeTab === 'evidence' && <EvidenceExplorer events={events} />}
      </div>
    </div>
  );
}
