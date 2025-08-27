import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ClientsSection from '@/components/ClientsSection';
import PricingSection from '@/components/PricingSection';
import ReviewsSection from '@/components/ReviewsSection'; // New import
import FooterSection from '@/components/FooterSection';
import AccordionSection from '@/components/AccordionSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
        <Navbar />
      </div>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <AccordionSection /> {/* New Accordion Section */}
      <ClientsSection />
      <PricingSection />
      <ReviewsSection /> {/* New Reviews Section */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;