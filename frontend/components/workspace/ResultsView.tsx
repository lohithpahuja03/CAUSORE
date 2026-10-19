'use client';

import React, { useState, useEffect } from 'react';
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
  RotateCcw,
  Clock,
  Activity,
  Network,
  ListTree,
  FileText,
  FileJson,
  Printer,
  CheckCircle2,
  Check
} from 'lucide-react';

interface Props {
  metadata: IncidentMetadata;
  events: NormalizedEvent[];
  anomalies: Anomaly[];
  hypotheses: CandidateRootCause[];
  report: InvestigationReport;
  onReset: () => void;
}

type TabKey = 'summary' | 'timeline' | 'hypotheses' | 'anomalies' | 'graph' | 'evidence';

export default function ResultsView({
  metadata,
  events,
  anomalies,
  hypotheses,
  report,
  onReset,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('summary');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const topHypothesis = hypotheses[0];
  const confidencePercent = topHypothesis ? Math.round(topHypothesis.confidence * 100) : 0;

  // Keyboard navigation for tabs (keys 1-6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      switch (e.key) {
        case '1':
          setActiveTab('summary');
          break;
        case '2':
          setActiveTab('timeline');
          break;
        case '3':
          setActiveTab('hypotheses');
          break;
        case '4':
          setActiveTab('anomalies');
          break;
        case '5':
          setActiveTab('graph');
          break;
        case '6':
          setActiveTab('evidence');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
    showToast(`Downloaded ${filename}`);
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

  const handlePrintHtml = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CAUSORE RCA Report - ${metadata.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; padding: 2.5rem; max-width: 860px; margin: 0 auto; }
    h1 { border-bottom: 2px solid #0284c7; padding-bottom: 0.5rem; color: #0f172a; }
    h2 { margin-top: 1.75rem; color: #0369a1; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25rem; }
    .badge { display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.8rem; font-weight: bold; border-radius: 4px; background: #e0f2fe; color: #0369a1; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 6px; margin-bottom: 1.5rem; }
    .card { background: #ffffff; border: 1px solid #cbd5e1; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; }
    ul { padding-left: 1.25rem; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>CAUSORE Incident Investigation Report</h1>
  <div class="meta-box">
    <strong>Incident Title:</strong> ${metadata.title}<br>
    <strong>Severity:</strong> <span class="badge">${metadata.severity}</span> &bull; <strong>Environment:</strong> ${metadata.environment}<br>
    <strong>Outage Duration:</strong> ${report.durationMinutes} minutes &bull; <strong>Generated:</strong> ${report.generatedAt}
  </div>

  <h2>1. Executive Summary</h2>
  <p>${report.executiveSummary}</p>

  <h2>2. Top Ranked Root Causes</h2>
  ${hypotheses.map((h, i) => `
    <div class="card">
      <h3>#${i + 1} ${h.candidate} (Confidence: ${Math.round(h.confidence * 100)}%)</h3>
      <p><strong>Status:</strong> ${h.status} &bull; <strong>Impacted:</strong> ${h.affectedServices.join(', ')}</p>
      <p><strong>Supporting Evidence:</strong></p>
      <ul>${h.supportingEvidence.map(e => `<li>${e}</li>`).join('')}</ul>
      <p><strong>Verification Steps:</strong></p>
      <ul>${h.recommendedVerification.map(v => `<li>${v}</li>`).join('')}</ul>
    </div>
  `).join('')}

  <h2>3. Action Items</h2>
  <ul>
    ${report.actionItems.map(item => `<li>${item}</li>`).join('')}
  </ul>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    showToast('Opened printable report');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#10b981',
          color: '#ffffff',
          padding: '0.65rem 1.25rem',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 99999,
        }}>
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

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
              title="Download Markdown Report (.md)"
            >
              <FileText size={15} />
              <span>Export Markdown</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="btn btn-secondary btn-sm"
              id="btn-export-json"
              title="Download Machine-Readable JSON (.json)"
            >
              <FileJson size={15} />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handlePrintHtml}
              className="btn btn-secondary btn-sm"
              id="btn-export-print"
              title="Open Printable / PDF Report View"
            >
              <Printer size={15} />
              <span>Print / PDF</span>
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

      {/* Navigation Tabs with Keyboard Hints */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-medium)',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'summary', keyHint: '1', label: 'Executive Summary', icon: <FileText size={16} /> },
          { id: 'timeline', keyHint: '2', label: `Timeline (${events.length})`, icon: <Clock size={16} /> },
          { id: 'hypotheses', keyHint: '3', label: `Root Causes (${hypotheses.length})`, icon: <ListTree size={16} /> },
          { id: 'anomalies', keyHint: '4', label: `Anomalies (${anomalies.length})`, icon: <Activity size={16} /> },
          { id: 'graph', keyHint: '5', label: 'Dependency Graph', icon: <Network size={16} /> },
          { id: 'evidence', keyHint: '6', label: 'Evidence Explorer', icon: <CheckCircle2 size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabKey)}
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
            <span
              className="mono"
              style={{
                fontSize: '0.65rem',
                color: activeTab === tab.id ? 'var(--brand-cyan)' : 'var(--text-muted)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '0.1rem 0.35rem',
                borderRadius: '3px',
              }}
            >
              {tab.keyHint}
            </span>
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
