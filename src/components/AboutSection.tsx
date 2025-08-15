import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AboutContent {
  title: string;
  description: string;
  image_url: string;
}

const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const { data, error } = await supabase
          .from('about_content')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching about content:', error);
        } else if (data) {
          setAboutContent(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  const defaultContent: AboutContent = {
    title: 'About Our Digital Suite',
    description: 'We are a leading digital suite provider specializing in comprehensive business solutions.',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  };

  const content = aboutContent || defaultContent;

  if (loading) {
    return (
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Text Content - 60% on desktop */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div className="glass-card p-8 fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {content.title}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {content.description}
              </p>
            </div>
          </div>

          {/* Image - 40% on desktop */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="glass-card-hover p-4">
              <img
                src={content.image_url}
                alt="About Us"
                className="w-full h-80 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;