import React from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import PainPointsSection from '@/components/PainPointsSection'; // New import
import ProgressSection from '@/components/ProgressSection'; // New import
import ClientsSection from '@/components/ClientsSection';
import PricingSection from '@/components/PricingSection';
import ReviewsSection from '@/components/ReviewsSection';
import ContactUsSection from '@/components/ContactUsSection'; // New import
import FaqSection from '@/components/FaqSection'; // New import
import FooterSection from '@/components/FooterSection';
import AccordionSection from '@/components/AccordionSection';
import LogoCarouselSection from '@/components/LogoCarouselSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
        <Navbar />
      </div>
      <HeroSection />
      <AboutSection />
      <LogoCarouselSection />
      <PainPointsSection /> {/* New section */}
      <ServicesSection />
      <AccordionSection />
      <ProgressSection /> {/* New section */}
      <FaqSection /> {/* New section */}
      {/* <ClientsSection /> */}
      {/* <PricingSection />  */}
      {/* <ReviewsSection /> */}
      <ContactUsSection /> {/* New section */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;