import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface HeroContent {
  headline: string;
  subheadline: string;
  background_image_url: string;
  cta_text: string;
}

const HeroSection = () => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_content')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching hero content:', error);
        } else if (data) {
          setHeroContent(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  if (loading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </section>
    );
  }

  const defaultContent: HeroContent = {
    headline: 'Transform Your Business with Digital Excellence',
    subheadline: 'Comprehensive digital solutions for modern businesses',
    background_image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
    cta_text: 'Get Started Now'
  };

  const content = heroContent || defaultContent;

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${content.background_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="glass-card p-12 fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {content.headline}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {content.subheadline}
          </p>
          <Button className="btn-primary-glass text-lg px-12 py-4 float">
            {content.cta_text}
          </Button>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default HeroSection;