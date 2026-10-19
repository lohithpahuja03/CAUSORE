import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import SolutionSection from '../components/SolutionSection';
import HowItWorks from '../components/HowItWorks';
import Capabilities from '../components/Capabilities';
import TargetUsers from '../components/TargetUsers';
import Differentiation from '../components/Differentiation';
import LimitationsTrust from '../components/LimitationsTrust';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <HowItWorks />
        <Capabilities />
        <TargetUsers />
        <Differentiation />
        <LimitationsTrust />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
