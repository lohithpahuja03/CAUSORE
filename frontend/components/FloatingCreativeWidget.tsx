'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Activity, Radio, Cpu, ShieldCheck, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export default function FloatingCreativeWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.65rem',
      }}
    >
      {/* Expanded Telemetry HUD Panel */}
      {isExpanded && (
        <div
          style={{
            width: '310px',
            backgroundColor: '#12151b',
            border: '1px solid #eab308',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(234, 179, 8, 0.25)',
            backgroundImage: 'radial-gradient(rgba(234, 179, 8, 0.16) 1.25px, transparent 1.25px)',
            backgroundSize: '16px 16px',
            animation: 'float-levitate 5s ease-in-out infinite',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.65rem',
              borderBottom: '1px solid rgba(234, 179, 8, 0.25)',
              marginBottom: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Radio size={14} color="#facc15" />
              <span
                className="mono"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#facc15',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                Causore HUD // Live Telemetry
              </span>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
              }}
              title="Minimize HUD"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Real-time Status Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.75rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.4rem 0.6rem',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>Deterministic Engine:</span>
              <span className="mono" style={{ color: '#10b981', fontWeight: 600 }}>READY (35/35)</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.4rem 0.6rem',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>Timestamp Normalizer:</span>
              <span className="mono" style={{ color: '#facc15', fontWeight: 600 }}>UTC ISO-8601</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.4rem 0.6rem',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>Anomaly Sensitivity:</span>
              <span className="mono" style={{ color: '#facc15', fontWeight: 600 }}>2-Sigma (95% CI)</span>
            </div>

            {/* Equalizer Waveform Animation */}
            <div
              style={{
                marginTop: '0.25rem',
                padding: '0.6rem',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '6px',
                border: '1px solid rgba(234, 179, 8, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span className="mono" style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                SIGNAL MONITOR
              </span>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '18px' }}>
                {[0.4, 0.8, 0.2, 0.9, 0.5, 0.7, 0.3, 1.0, 0.6].map((delay, i) => (
                  <span
                    key={i}
                    style={{
                      width: '3px',
                      backgroundColor: '#eab308',
                      borderRadius: '2px',
                      animation: `equalizer-bar ${0.8 + delay * 0.4}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </div>
            </div>

            <Link
              href="/investigate"
              className="btn btn-primary btn-sm"
              style={{
                marginTop: '0.4rem',
                width: '100%',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(234, 179, 8, 0.4)',
              }}
            >
              <Sparkles size={13} />
              <span>Launch Causore Engine</span>
            </Link>
          </div>
        </div>
      )}

      {/* Floating Animated Radar Orb (Bottom-Right Creative Design) */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          position: 'relative',
          width: '56px',
          height: '56px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'float-levitate 4s ease-in-out infinite',
        }}
        title="Causore Active Telemetry Radar (Click to toggle HUD)"
      >
        {/* Expanding Pulsing Wave Rings */}
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(234, 179, 8, 0.7)',
            animation: 'radar-sweep-wave 2.8s cubic-bezier(0, 0.2, 0.8, 1) infinite',
            pointerEvents: 'none',
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '1.5px solid rgba(250, 204, 21, 0.5)',
            animation: 'radar-sweep-wave 2.8s cubic-bezier(0, 0.2, 0.8, 1) infinite 1.4s',
            pointerEvents: 'none',
          }}
        />

        {/* Orbiting Golden Particle on Outer Ring */}
        <div
          style={{
            position: 'absolute',
            inset: '-6px',
            borderRadius: '50%',
            border: '1px dashed rgba(234, 179, 8, 0.35)',
            animation: 'orbit-ring 6s linear infinite',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#facc15',
              boxShadow: '0 0 10px #facc15',
            }}
          />
        </div>

        {/* Center Metallic Grey & Matte Yellow Orb */}
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: '#12151b',
            border: '2px solid #eab308',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(234, 179, 8, 0.45)',
            transition: 'transform 0.2s ease, border-color 0.2s ease',
          }}
        >
          {isExpanded ? (
            <ChevronDown size={22} color="#facc15" />
          ) : (
            <Activity size={22} color="#facc15" />
          )}
        </div>
      </div>
    </div>
  );
}
