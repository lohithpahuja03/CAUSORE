'use client';

import React from 'react';
import { Network, ArrowRight, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface Props {
  services: string[];
}

export default function DependencyGraphViewer({ services }: Props) {
  // Topological flow: postgres-core <- payment-service <- checkout-api <- api-gateway
  const nodes = [
    {
      id: 'postgres-core',
      name: 'postgres-core',
      type: 'Database (Primary)',
      status: 'HEALTHY',
      statusClass: 'badge-observed',
      role: 'Leaf Downstream',
      metric: 'CPU 18% • 10/500 Conns',
    },
    {
      id: 'payment-service',
      name: 'payment-service',
      type: 'Core Microservice',
      status: 'TRIGGER / EXHAUSTED',
      statusClass: 'badge-sev1',
      role: 'Root Failure Originator',
      metric: 'HikariCP Pool 10/10 • Timeout 142/m',
    },
    {
      id: 'checkout-api',
      name: 'checkout-api',
      type: 'BFF Orchestrator',
      status: 'DEGRADED',
      statusClass: 'badge-inferred',
      role: 'Circuit Breaker Open',
      metric: 'p99 Latency: 30.0s',
    },
    {
      id: 'api-gateway',
      name: 'api-gateway',
      type: 'Edge Reverse Proxy',
      status: 'DEGRADED',
      statusClass: 'badge-sev1',
      role: 'Customer Facing Ingress',
      metric: 'HTTP 504: 420 req/s dropped',
    },
  ];

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
          Directed Dependency Graph & Failure Propagation Path
        </span>
        <span className="mono" style={{ color: 'var(--brand-cyan)' }}>
          Blast Radius: 4 Interdependent Components
        </span>
      </div>

      {/* Visual Topological Pipeline */}
      <div style={{
        backgroundColor: '#070a10',
        border: '1px solid var(--border-medium)',
        borderRadius: '8px',
        padding: '2.5rem 1.5rem',
        overflowX: 'auto',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: '780px',
          gap: '1rem',
        }}>
          {nodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div style={{
                flex: 1,
                backgroundColor: 'var(--bg-surface)',
                border: `1px solid ${node.status === 'TRIGGER / EXHAUSTED' ? '#ef4444' : 'var(--border-medium)'}`,
                borderRadius: '8px',
                padding: '1.25rem',
                boxShadow: node.status === 'TRIGGER / EXHAUSTED' ? '0 0 15px rgba(239, 68, 68, 0.2)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    0{idx + 1} // {node.type}
                  </span>
                  <span className={`badge ${node.statusClass}`} style={{ fontSize: '0.625rem' }}>
                    {node.status}
                  </span>
                </div>

                <h4 className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>
                  {node.name}
                </h4>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.75rem' }}>
                  {node.role}
                </span>

                <div style={{
                  padding: '0.4rem 0.6rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '4px',
                  fontSize: '0.725rem',
                  fontFamily: 'var(--font-mono)',
                  color: node.status === 'TRIGGER / EXHAUSTED' ? '#f87171' : 'var(--text-muted)'
                }}>
                  {node.metric}
                </div>
              </div>

              {/* Propagation Arrow */}
              {idx < nodes.length - 1 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'var(--text-muted)',
                  padding: '0 0.5rem'
                }}>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#f87171', marginBottom: '2px' }}>
                    cascades
                  </span>
                  <ArrowRight size={22} color="#f87171" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{
        padding: '1rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '6px',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5
      }}>
        <strong style={{ color: 'var(--text-primary)' }}>Topological Analysis:</strong> Error propagation flows backwards from downstream client-side pool exhaustion in <code>payment-service</code> to caller <code>checkout-api</code> (circuit breaker trip), ultimately manifesting as HTTP 504 timeouts at the ingress <code>api-gateway</code>.
      </div>
    </div>
  );
}
