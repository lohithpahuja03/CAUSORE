import type { Metadata } from 'next';
import './globals.css';
import FloatingCreativeWidget from '../components/FloatingCreativeWidget';

export const metadata: Metadata = {
  title: 'CAUSORE — Evidence-Driven Incident Investigation Platform',
  description:
    'Evidence-driven incident investigation for modern engineering teams. CAUSORE processes telemetry, reconstructs timelines, identifies anomalies, and evaluates competing root-cause hypotheses.',
  keywords: [
    'incident investigation',
    'root cause analysis',
    'SRE',
    'DevOps',
    'observability',
    'telemetry correlation',
    'timeline reconstruction',
    'RCA',
  ],
  authors: [{ name: 'CAUSORE Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-grid">
        {children}
        <FloatingCreativeWidget />
      </body>
    </html>
  );
}
