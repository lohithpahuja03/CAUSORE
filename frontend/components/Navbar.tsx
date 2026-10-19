'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, Menu, X, ArrowRight, Zap } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(11, 13, 17, 0.88)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border-medium)',
      backgroundImage: 'radial-gradient(rgba(234, 179, 8, 0.08) 1px, transparent 1px)',
      backgroundSize: '16px 16px',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--header-height)',
      }}>
        {/* Animated Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Animated Logo Container with Neon Conic Glow & Radar Blip */}
          <div style={{
            position: 'relative',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {/* Rotating Conic Gradient Outer Halo */}
            <div style={{
              position: 'absolute',
              inset: '-2px',
              borderRadius: '8px',
              background: 'conic-gradient(from 0deg, #eab308, #ca8a04, transparent 65%, #facc15)',
              animation: 'logo-spin-conic 4s linear infinite',
              opacity: 0.85,
              filter: 'blur(1px)',
            }} />

            {/* Inner Core Box with Pulse Animation */}
            <div style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: '#12151b',
              border: '1px solid #eab308',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#facc15',
              animation: 'logo-pulse 3s ease-in-out infinite',
              boxShadow: '0 0 12px rgba(234, 179, 8, 0.5)',
            }}>
              <Terminal size={17} strokeWidth={2.7} color="#facc15" />
            </div>

            {/* Live Pulsing Radar Dot */}
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#facc15',
              boxShadow: '0 0 8px #facc15',
              animation: 'logo-badge-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)'
            }}>
              CAUS<span style={{ color: '#eab308' }}>ORE</span>
            </span>
            <span style={{
              fontSize: '0.65rem',
              padding: '0.1rem 0.4rem',
              borderRadius: '4px',
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              color: '#facc15',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(234, 179, 8, 0.4)'
            }}>
              v0.1
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{
          display: 'none',
          alignItems: 'center',
          gap: '1.75rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          fontWeight: 600,
        }} className="desktop-nav">
          <a href="#product" style={{ transition: 'color 0.15s' }} className="nav-link">Product</a>
          <a href="#how-it-works" style={{ transition: 'color 0.15s' }} className="nav-link">How It Works</a>
          <a href="#capabilities" style={{ transition: 'color 0.15s' }} className="nav-link">Capabilities</a>
          <a href="#users" style={{ transition: 'color 0.15s' }} className="nav-link">Who Uses It</a>
          <a href="#differentiation" style={{ transition: 'color 0.15s' }} className="nav-link">Differentiation</a>
          <a href="https://github.com/lohithpahuja03/CAUSORE" target="_blank" rel="noopener noreferrer" style={{ transition: 'color 0.15s' }} className="nav-link">GitHub</a>
        </nav>

        {/* Primary CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/investigate" className="btn btn-primary" id="navbar-cta-investigate">
            <Zap size={15} />
            <span>Investigate Incident</span>
            <ArrowRight size={15} />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              background: 'transparent',
              border: '1px solid var(--border-medium)',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem',
          backgroundColor: '#0b0d11',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <a href="#product" onClick={() => setMobileMenuOpen(false)}>Product</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#capabilities" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
          <a href="#users" onClick={() => setMobileMenuOpen(false)}>Who Uses It</a>
          <a href="#differentiation" onClick={() => setMobileMenuOpen(false)}>Differentiation</a>
          <a href="https://github.com/lohithpahuja03/CAUSORE" target="_blank" rel="noopener noreferrer">GitHub Docs</a>
          <Link href="/investigate" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
            Launch Investigation
          </Link>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
        .nav-link:hover {
          color: #facc15 !important;
        }
      `}</style>
    </header>
  );
}
