import React, { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';

const AboutSection = lazy(() => import('@/components/AboutSection'));
const ServicesSection = lazy(() => import('@/components/ServicesSection'));
const PainPointsSection = lazy(() => import('@/components/PainPointsSection'));
const ProgressSection = lazy(() => import('@/components/ProgressSection'));
const ClientsSection = lazy(() => import('@/components/ClientsSection'));
const PricingSection = lazy(() => import('@/components/PricingSection'));
const ReviewsSection = lazy(() => import('@/components/ReviewsSection'));
const ContactUsSection = lazy(() => import('@/components/ContactUsSection'));
const FaqSection = lazy(() => import('@/components/FaqSection'));
const FooterSection = lazy(() => import('@/components/FooterSection'));
const AccordionSection = lazy(() => import('@/components/AccordionSection'));
const LogoCarouselSection = lazy(() => import('@/components/LogoCarouselSection'));

const SectionLoader = () => <div>Loading...</div>;

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center">
        <Navbar />
      </div>
      <HeroSection />
      <Suspense fallback={<SectionLoader />}>
        <AboutSection />
        <LogoCarouselSection />
        <PainPointsSection />
        <ServicesSection />
        <AccordionSection />
        <ProgressSection />
        <FaqSection />
        {/* <ClientsSection /> */}
        <PricingSection />
        {/* <ReviewsSection /> */}
        <ContactUsSection />
        <FooterSection />
      </Suspense>
    </div>
  );
};

export default LandingPage;