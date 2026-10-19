'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import IncidentMetadataForm from '../../components/workspace/IncidentMetadataForm';
import EvidenceUploadDropzone, { UploadedEvidenceItem } from '../../components/workspace/EvidenceUploadDropzone';
import OptionalContextForm, { OptionalContextData } from '../../components/workspace/OptionalContextForm';
import PipelineProgressView, { PipelineStageStatus } from '../../components/workspace/PipelineProgressView';
import ResultsView from '../../components/workspace/ResultsView';
import {
  DEMO_INCIDENT_METADATA,
  DEMO_NORMALIZED_EVENTS,
  DEMO_ANOMALIES,
  DEMO_HYPOTHESES,
  DEMO_REPORT
} from '../../lib/demoData';
import { IncidentMetadata } from '../../types';
import { ArrowLeft, CheckCircle2, Circle, Activity } from 'lucide-react';

const INITIAL_PIPELINE_STAGES: PipelineStageStatus[] = [
  { id: 'ingest', name: 'Evidence Ingestion & Security Validation', status: 'pending', details: 'Scanning MIME signatures & payload boundaries' },
  { id: 'parse', name: 'Structural Parsing & Log Grammar Extraction', status: 'pending', details: 'Extracting service identifiers & log levels' },
  { id: 'timestamp', name: 'Timestamp Synchronization (UTC ISO-8601)', status: 'pending', details: 'Standardizing heterogeneous timezones' },
  { id: 'timeline', name: 'Chronological Timeline Construction', status: 'pending', details: 'Partitioning pre-incident, outage, & recovery' },
  { id: 'clustering', name: 'Error Signature Grouping & Fingerprinting', status: 'pending', details: 'Clustering recurring stack traces' },
  { id: 'anomalies', name: 'Statistical Anomaly Detection (Z-Score & Isolation)', status: 'pending', details: 'Detecting error cliffs & latency deviations' },
  { id: 'topology', name: 'Service Topology & Blast Radius Traversal', status: 'pending', details: 'Mapping causal propagation path' },
  { id: 'correlation', name: 'Cross-Evidence Correlation & Deployment Match', status: 'pending', details: 'Correlating commit diffs with initial deviation' },
  { id: 'hypotheses', name: 'Competing Root-Cause Hypotheses Generation', status: 'pending', details: 'Evaluating candidate causes' },
  { id: 'scoring', name: 'Deterministic Evidence Scoring (Support vs Contradict)', status: 'pending', details: 'Computing confidence metrics & blindspots' },
  { id: 'report', name: 'Actionable RCA Report Compilation', status: 'pending', details: 'Generating diagnostic verification steps' },
];

export default function InvestigatePage() {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Metadata
  const [metadata, setMetadata] = useState<Partial<IncidentMetadata>>({
    severity: 'SEV-1',
    affectedServices: [],
  });

  // Step 2: Uploaded Evidence
  const [evidenceFiles, setEvidenceFiles] = useState<UploadedEvidenceItem[]>([]);

  // Step 3: Optional Context
  const [contextData, setContextData] = useState<OptionalContextData>({
    deploymentNotes: '',
    dependencyMapJson: '',
    responderNotes: '',
  });

  // Step 4: Pipeline Stages
  const [pipelineStages, setPipelineStages] = useState<PipelineStageStatus[]>(INITIAL_PIPELINE_STAGES);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // Investigation Results State
  const [resultsData, setResultsData] = useState<{
    metadata: IncidentMetadata;
    events: typeof DEMO_NORMALIZED_EVENTS;
    anomalies: typeof DEMO_ANOMALIES;
    hypotheses: typeof DEMO_HYPOTHESES;
    report: typeof DEMO_REPORT;
  } | null>(null);

  // Helper to load sample data
  const handleLoadSample = () => {
    setMetadata(DEMO_INCIDENT_METADATA);
    setEvidenceFiles([
      {
        id: 'sample-file-1',
        name: 'payment-service.log',
        sizeBytes: 1488000,
        type: 'text/plain',
        sourceType: 'log',
      },
      {
        id: 'sample-file-2',
        name: 'deployments_audit.log',
        sizeBytes: 42000,
        type: 'text/plain',
        sourceType: 'deployment',
      },
      {
        id: 'sample-file-3',
        name: 'rds_metrics.csv',
        sizeBytes: 89000,
        type: 'text/csv',
        sourceType: 'data',
      },
      {
        id: 'sample-file-4',
        name: 'nginx_access.log',
        sizeBytes: 4200000,
        type: 'text/plain',
        sourceType: 'log',
      },
    ]);
    setContextData({
      deploymentNotes: '14:00:15 UTC - payment-service v2.4.1 canary rollout (commit a8f1bc4: tune connection parameters)',
      dependencyMapJson: JSON.stringify(
        {
          'api-gateway': ['checkout-api'],
          'checkout-api': ['payment-service'],
          'payment-service': ['postgres-core'],
        },
        null,
        2
      ),
      responderNotes: 'Flash sale traffic began ramping at 14:00 UTC. Gateway 504 started shortly after payment canary deploy.',
    });
  };

  // Launch pipeline simulation/real processing
  const handleStartInvestigation = () => {
    setCurrentStep(4);
    setPipelineStages(INITIAL_PIPELINE_STAGES.map((s) => ({ ...s, status: 'pending' })));

    let stageIdx = 0;
    const interval = setInterval(() => {
      setPipelineStages((prev) => {
        const updated = [...prev];
        if (stageIdx > 0 && stageIdx <= updated.length) {
          updated[stageIdx - 1].status = 'completed';
        }
        if (stageIdx < updated.length) {
          updated[stageIdx].status = 'active';
        }
        return updated;
      });

      setCurrentStageIndex(stageIdx);
      stageIdx++;

      if (stageIdx > INITIAL_PIPELINE_STAGES.length) {
        clearInterval(interval);
        setTimeout(() => {
          setResultsData({
            metadata: {
              id: metadata.id || `inv-${Date.now().toString().substring(6)}`,
              title: metadata.title || 'Production Incident Investigation',
              description: metadata.description || '',
              severity: metadata.severity || 'SEV-1',
              environment: metadata.environment || 'production',
              affectedServices: metadata.affectedServices || ['payment-service', 'checkout-api'],
              startTime: metadata.startTime || new Date().toISOString(),
              endTime: metadata.endTime || new Date().toISOString(),
              createdAt: new Date().toISOString(),
            },
            events: DEMO_NORMALIZED_EVENTS,
            anomalies: DEMO_ANOMALIES,
            hypotheses: DEMO_HYPOTHESES,
            report: DEMO_REPORT,
          });
          setCurrentStep(5);
        }, 500);
      }
    }, 400);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setMetadata({ severity: 'SEV-1', affectedServices: [] });
    setEvidenceFiles([]);
    setContextData({ deploymentNotes: '', dependencyMapJson: '', responderNotes: '' });
    setResultsData(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '3.5rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: currentStep === 5 ? '1200px' : '900px' }}>
          
          {/* Breadcrumb Back */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Overview</span>
            </Link>

            {currentStep < 4 && (
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Step {currentStep} of 3 // Investigation Setup
              </span>
            )}
          </div>

          {/* Stepper Wizard Indicator (Steps 1 to 3) */}
          {currentStep < 4 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              marginBottom: '2.5rem',
              flexWrap: 'wrap'
            }}>
              {[
                { num: 1, label: 'Incident Metadata' },
                { num: 2, label: 'Upload Evidence' },
                { num: 3, label: 'Context & Graph' },
              ].map((s) => {
                const isActive = currentStep === s.num;
                const isCompleted = currentStep > s.num;

                return (
                  <div
                    key={s.num}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: isCompleted ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (isCompleted) setCurrentStep(s.num as 1 | 2 | 3);
                    }}
                  >
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: isCompleted ? '#10b981' : isActive ? 'var(--brand-primary)' : 'var(--bg-surface)',
                      border: `1px solid ${isActive ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: isCompleted || isActive ? '#fff' : 'var(--text-muted)'
                    }}>
                      {isCompleted ? '✓' : s.num}
                    </div>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? '#ffffff' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)'
                    }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Workspace Step Panels */}
          {currentStep < 4 && (
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: '12px',
              padding: '2rem',
            }}>
              {currentStep === 1 && (
                <IncidentMetadataForm
                  metadata={metadata}
                  onChange={(updated) => setMetadata((prev) => ({ ...prev, ...updated }))}
                  onNext={() => setCurrentStep(2)}
                  onLoadSample={handleLoadSample}
                />
              )}

              {currentStep === 2 && (
                <EvidenceUploadDropzone
                  files={evidenceFiles}
                  onFilesChange={setEvidenceFiles}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <OptionalContextForm
                  contextData={contextData}
                  onChange={(updated) => setContextData((prev) => ({ ...prev, ...updated }))}
                  onStartInvestigation={handleStartInvestigation}
                  onBack={() => setCurrentStep(2)}
                  isReady={Boolean(metadata.title && evidenceFiles.length > 0)}
                />
              )}
            </div>
          )}

          {/* Step 4: Active Pipeline Progress */}
          {currentStep === 4 && (
            <PipelineProgressView
              stages={pipelineStages}
              currentStageIndex={currentStageIndex}
            />
          )}

          {/* Step 5: Full Results View */}
          {currentStep === 5 && resultsData && (
            <ResultsView
              metadata={resultsData.metadata}
              events={resultsData.events}
              anomalies={resultsData.anomalies}
              hypotheses={resultsData.hypotheses}
              report={resultsData.report}
              onReset={handleReset}
            />
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
