/**
 * CAUSORE Verified Sample Dataset
 * Explicitly badged as [Sample / Demo] in accordance with BRAIN.md Rule 29
 */

import {
  IncidentMetadata,
  NormalizedEvent,
  Anomaly,
  CandidateRootCause,
  InvestigationReport
} from '../types';

export const DEMO_INCIDENT_METADATA: IncidentMetadata = {
  id: 'inv-202610-checkout-cascade',
  title: 'Checkout Gateway Timeout & Cascading Failure',
  description:
    'Cascading HTTP 504 timeouts across checkout-api following canary rollout of payment-service v2.4.1. Core purchase flow stalled for 28 minutes.',
  severity: 'SEV-1',
  environment: 'production-us-east-1',
  affectedServices: ['api-gateway', 'checkout-api', 'payment-service', 'postgres-core'],
  startTime: '2026-10-18T14:00:00Z',
  endTime: '2026-10-18T14:28:30Z',
  createdAt: '2026-10-18T14:32:00Z'
};

export const DEMO_NORMALIZED_EVENTS: NormalizedEvent[] = [
  {
    id: 'evt-001',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:00:15Z',
    service: 'payment-service',
    level: 'INFO',
    message: 'Deploy canary v2.4.1 completed across 4/20 pods. Commit SHA: a8f1bc4 (chore: tune connection parameters)',
    sourceFile: 'deployments_audit.log',
    sourceLine: 412,
    attributes: { commit: 'a8f1bc4', author: 'release-bot', cluster: 'k8s-prod-useast1' },
    fingerprint: 'fp_deploy_canary_rollout'
  },
  {
    id: 'evt-002',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:01:45Z',
    service: 'payment-service',
    level: 'WARN',
    message: 'DB connection pool acquisition latency threshold exceeded: 420ms (p99 baseline: 6ms)',
    sourceFile: 'payment-service.log',
    sourceLine: 1842,
    attributes: { pool_active: 10, pool_max: 10, pool_idle: 0 },
    fingerprint: 'fp_db_pool_acquisition_warn'
  },
  {
    id: 'evt-003',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:02:15Z',
    service: 'payment-service',
    level: 'ERROR',
    message: 'org.postgresql.util.PSQLException: Connection acquisition timed out after 30000ms. Pool empty.',
    sourceFile: 'payment-service.log',
    sourceLine: 1899,
    attributes: { caller: 'process_stripe_webhook', thread: 'worker-18' },
    fingerprint: 'fp_postgres_pool_exhausted'
  },
  {
    id: 'evt-004',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:02:40Z',
    service: 'checkout-api',
    level: 'WARN',
    message: 'Circuit breaker to payment-service transitioned to HALF-OPEN (upstream latency > 5000ms)',
    sourceFile: 'checkout-api.log',
    sourceLine: 8201,
    attributes: { circuit_id: 'cb_payment_v1', failure_rate: '68%' },
    fingerprint: 'fp_circuit_breaker_trip'
  },
  {
    id: 'evt-005',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:03:02Z',
    service: 'api-gateway',
    level: 'ERROR',
    message: 'HTTP 504 Gateway Timeout on POST /v1/checkout/charge. Upstream server failed to respond in 30.0s.',
    sourceFile: 'nginx_access.log',
    sourceLine: 54120,
    attributes: { status: 504, request_time: 30.002, client_ip: '203.0.113.19' },
    fingerprint: 'fp_gateway_timeout_504'
  },
  {
    id: 'evt-006',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:04:10Z',
    service: 'postgres-core',
    level: 'INFO',
    message: 'CPU utilization: 18.4%. Memory: 42%. Active transactions: 10. Max allowed connections: 500.',
    sourceFile: 'rds_metrics.csv',
    sourceLine: 142,
    attributes: { db_cpu: 18.4, active_backends: 10, max_connections: 500 },
    fingerprint: 'fp_db_metrics_normal'
  },
  {
    id: 'evt-007',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:24:00Z',
    service: 'payment-service',
    level: 'INFO',
    message: 'Emergency rollback to v2.4.0 initiated by on-call engineer (pagerduty-id: Q98JLZ1)',
    sourceFile: 'deployments_audit.log',
    sourceLine: 501,
    attributes: { rollback_to: 'v2.4.0', initiator: 'sre-oncall' },
    fingerprint: 'fp_rollback_initiated'
  },
  {
    id: 'evt-008',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:28:15Z',
    service: 'api-gateway',
    level: 'INFO',
    message: 'Error rate on /v1/checkout normalized to 0.02% (HTTP 200 OK: 99.98%)',
    sourceFile: 'nginx_access.log',
    sourceLine: 58900,
    attributes: { status: 200, p99_latency_ms: 82 },
    fingerprint: 'fp_traffic_normalized'
  }
];

export const DEMO_ANOMALIES: Anomaly[] = [
  {
    id: 'anom-01',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:02:15Z',
    service: 'payment-service',
    anomalyType: 'error_spike',
    score: 0.96,
    description: 'Postgres connection acquisition timeout rate spiked from 0/min to 142/min (Z-Score: +8.4).',
    baselineValue: 0.0,
    observedValue: 142.0
  },
  {
    id: 'anom-02',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:03:02Z',
    service: 'api-gateway',
    anomalyType: 'volume_drop',
    score: 0.91,
    description: 'Successful HTTP 200 responses on /v1/checkout dropped 98.4% within 60 seconds.',
    baselineValue: 450.0,
    observedValue: 7.0
  },
  {
    id: 'anom-03',
    investigationId: 'inv-202610-checkout-cascade',
    timestamp: '2026-10-18T14:02:40Z',
    service: 'checkout-api',
    anomalyType: 'latency_cliff',
    score: 0.89,
    description: 'Upstream payment dispatch p99 latency jumped from 85ms to 30,000ms cliff.',
    baselineValue: 85.0,
    observedValue: 30000.0
  }
];

export const DEMO_HYPOTHESES: CandidateRootCause[] = [
  {
    id: 'hypo-01',
    candidate: 'Client-side connection pool starvation in payment-service container',
    confidence: 0.88,
    status: 'INFERRED',
    supportingEvidence: [
      'Canary deployment v2.4.1 (commit a8f1bc4) deployed at 14:00:15 UTC, 2 minutes before initial failure.',
      'Connection acquisition timeout spiked to 142 errors/min at 14:02:15 UTC (payment-service.log:1899).',
      'Pool metrics show pool_active: 10, pool_max: 10 with zero available connections.',
      'Upstream circuit breaker tripped in checkout-api at 14:02:40 UTC directly following pool timeout.'
    ],
    contradictingEvidence: [
      'PostgreSQL database server CPU remained low (18.4%) and database connection limit (500) was never approached.'
    ],
    relevantTimelineEvents: ['evt-001', 'evt-002', 'evt-003', 'evt-004', 'evt-005'],
    affectedServices: ['payment-service', 'checkout-api', 'api-gateway'],
    possibleContributingFactors: [
      'Commit a8f1bc4 modified HikariCP pool configuration from 50 to 10 connections per pod.',
      'Canary traffic of 20% quickly saturated the artificially lowered 10-connection limit.'
    ],
    missingEvidence: [
      'JVM thread dump from payment-service pods during the 14:02–14:15 window was not provided.',
      'HikariCP pool JMX metrics stream was not uploaded.'
    ],
    recommendedVerification: [
      'Verify DB_POOL_MAX_SIZE environment variable value in v2.4.1 container spec.',
      'Inspect git diff for commit a8f1bc4 in payment-service repository.',
      'Run query `SELECT * FROM pg_stat_activity WHERE application_name = "payment-service";` to verify active connection states.'
    ]
  },
  {
    id: 'hypo-02',
    candidate: 'Database server deadlock or hardware IOPS exhaustion',
    confidence: 0.14,
    status: 'INFERRED',
    supportingEvidence: [
      'Clients logged PostgreSQL connection timeout errors.'
    ],
    contradictingEvidence: [
      'PostgreSQL host CPU was stable at 18.4% (rds_metrics.csv:142).',
      'Total active database backends was 10 out of 500 maximum connections.',
      'No deadlock detected or logged in PostgreSQL core telemetry.'
    ],
    relevantTimelineEvents: ['evt-003', 'evt-006'],
    affectedServices: ['postgres-core'],
    possibleContributingFactors: [
      'Coincidental backup job'
    ],
    missingEvidence: [
      'Detailed pg_stat_statements query latency breakdown'
    ],
    recommendedVerification: [
      'Review RDS CloudWatch DiskQueueDepth and ReadIOPS metrics.'
    ]
  }
];

export const DEMO_REPORT: InvestigationReport = {
  investigationId: 'inv-202610-checkout-cascade',
  title: 'RCA Report: Checkout Gateway Timeout & Cascading Failure',
  severity: 'SEV-1',
  durationMinutes: 28,
  executiveSummary:
    'On October 18, 2026, at 14:00:15 UTC, payment-service canary deployment v2.4.1 was deployed to production. At 14:02:15 UTC, payment-service suffered complete client-side database connection-pool exhaustion due to an unintended reduction in pool size from 50 to 10. This triggered cascading HTTP 504 timeouts at the API gateway, dropping 98.4% of checkout requests. The incident was mitigated at 14:24:00 UTC by rolling back to v2.4.0.',
  topHypotheses: DEMO_HYPOTHESES,
  anomaliesDetected: DEMO_ANOMALIES,
  criticalTimelineEvents: DEMO_NORMALIZED_EVENTS,
  missingEvidenceSummary: [
    'JVM thread dumps from payment-service container pods.',
    'Granular HikariCP connection pool JMX metrics.',
    'pg_stat_statements query duration profile.'
  ],
  actionItems: [
    '[Action] Add automated lint rule in CI to prevent reducing DB_POOL_MAX_SIZE below safety baseline (50).',
    '[Action] Add canary health check gate requiring connection acquisition latency < 50ms before routing traffic.',
    '[Action] Export HikariCP pool metrics to Prometheus with an alert at 80% saturation.'
  ],
  generatedAt: '2026-10-18T14:35:00Z'
};
