import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import parse from 'html-react-parser';
import { Button } from '@/components/ui/button';
import LightRays from '@/components/ui/light-rays';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeroContent {
  headline: string;
  subheadline: string;
  background_image_url: string;
  cta_text: string;
  cta_link: string;
}

const HeroSection = () => {
  const isMobile = useIsMobile();
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_content')
          .select('*')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching hero content:', error);
        } else if (data) {
          console.log('Hero content fetched:', data);
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
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </section>
    );
  }

  

  if (!heroContent) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-600">
          <p>No Hero content found. Please add content from the Admin Dashboard.</p>
        </div>
      </section>
    );
  }

  const content = heroContent;

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900"
    >
      <LightRays
        raysOrigin="top-left"
        raysColor="#ffffff"
        raysSpeed={2}
        lightSpread={isMobile ? 120 : 100}
        rayLength={isMobile ? 24.0 : 5}
        saturation={isMobile ? 4.0 : 4.0}
        fadeDistance={isMobile ? 10.0 : 10.0}
        followMouse={true}
        mouseInfluence={1.5}
        noiseAmount={0.0}
        distortion={15}
        className="absolute top-0 left-0 w-full h-full"
      />

      <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full lg:w-3/3 mx-auto">
          <h1 className="text-3xl md:text-6xl font-bold text-white mb-8 leading-tight bounce-animation max-w-full break-words">
            {content.headline}
          </h1>
          <div className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 mx-auto rise-animation break-word px-4 tiptap-content">
            {parse(content.subheadline)}
          </div>
          <a href={content.cta_link} target="_blank" rel="noopener noreferrer">
            <Button className="glow-on-hover text-black text-lg px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              {content.cta_text}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;