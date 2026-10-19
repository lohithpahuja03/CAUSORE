'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, ShieldAlert, Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--header-height)',
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '6px',
            backgroundColor: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)'
          }}>
            <Terminal size={18} strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)'
            }}>
              CAUSORE
            </span>
            <span style={{
              fontSize: '0.65rem',
              padding: '0.1rem 0.35rem',
              borderRadius: '3px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              fontFamily: 'var(--font-mono)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
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
          fontWeight: 500,
        }} className="desktop-nav">
          <a href="#product" style={{ transition: 'color 0.15s' }} className="nav-link">Product</a>
          <a href="#how-it-works" style={{ transition: 'color 0.15s' }} className="nav-link">How It Works</a>
          <a href="#capabilities" style={{ transition: 'color 0.15s' }} className="nav-link">Capabilities</a>
          <a href="#users" style={{ transition: 'color 0.15s' }} className="nav-link">Who Uses It</a>
          <a href="#differentiation" style={{ transition: 'color 0.15s' }} className="nav-link">Differentiation</a>
          <a href="https://github.com/lohithpahuja03/CAUSORE" target="_blank" rel="noopener noreferrer" style={{ transition: 'color 0.15s' }} className="nav-link">Docs & Code</a>
        </nav>

        {/* Primary CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/investigate" className="btn btn-primary" id="navbar-cta-investigate">
            <span>Investigate an Incident</span>
            <ArrowRight size={16} />
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-primary)',
              padding: '0.45rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-medium)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <a href="#product" onClick={() => setMobileMenuOpen(false)}>Product</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
          <a href="#capabilities" onClick={() => setMobileMenuOpen(false)}>Capabilities</a>
          <a href="#users" onClick={() => setMobileMenuOpen(false)}>Who Uses It</a>
          <a href="#differentiation" onClick={() => setMobileMenuOpen(false)}>Differentiation</a>
          <a href="https://github.com/lohithpahuja03/CAUSORE" target="_blank" rel="noopener noreferrer">Docs & GitHub</a>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
        }
        @media (max-width: 859px) {
          .mobile-toggle { display: block !important; }
        }
        .nav-link:hover {
          color: var(--text-primary);
        }
      `}</style>
    </header>
  );
}
