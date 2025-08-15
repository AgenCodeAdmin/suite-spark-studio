import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ClientsSection from '@/components/ClientsSection';
import PricingSection from '@/components/PricingSection';
import FooterSection from '@/components/FooterSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ClientsSection />
      <PricingSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;