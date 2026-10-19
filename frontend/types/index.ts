/**
 * CAUSORE Core TypeScript Data Models & Contracts
 * Strictly aligned with BRAIN.md Constitution
 */

export type EpistemologicalStatus = 'OBSERVED' | 'CORRELATED' | 'INFERRED' | 'UNKNOWN';

export type IncidentSeverity = 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4';

export interface IncidentMetadata {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  environment: string;
  affectedServices: string[];
  startTime: string; // ISO 8601 UTC
  endTime?: string;   // ISO 8601 UTC
  createdAt: string;
}

export interface NormalizedEvent {
  id: string;
  investigationId: string;
  timestamp: string; // ISO 8601 UTC
  service: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
  sourceFile: string;
  sourceLine?: number;
  attributes?: Record<string, unknown>;
  fingerprint?: string;
}

export interface Anomaly {
  id: string;
  investigationId: string;
  timestamp: string;
  service: string;
  anomalyType: 'error_spike' | 'latency_cliff' | 'volume_drop' | 'unusual_pattern';
  score: number; // 0.0 to 1.0
  description: string;
  baselineValue: number;
  observedValue: number;
}

export interface CandidateRootCause {
  id: string;
  candidate: string;
  confidence: number; // 0.0 to 1.0
  status: EpistemologicalStatus;
  supportingEvidence: string[];
  contradictingEvidence: string[];
  relevantTimelineEvents: string[];
  affectedServices: string[];
  possibleContributingFactors: string[];
  missingEvidence: string[];
  recommendedVerification: string[];
}

export interface InvestigationReport {
  investigationId: string;
  title: string;
  severity: IncidentSeverity;
  durationMinutes: number;
  executiveSummary: string;
  topHypotheses: CandidateRootCause[];
  anomaliesDetected: Anomaly[];
  criticalTimelineEvents: NormalizedEvent[];
  missingEvidenceSummary: string[];
  actionItems: string[];
  generatedAt: string;
}
