import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AboutContent {
  title: string;
  description: string;
  image_url: string;
}

const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [loading]);

  const defaultContent: AboutContent = {
    title: 'About Our Digital Suite',
    description: 'We are a leading digital suite provider specializing in comprehensive business solutions.',
    image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
  };

  const content = aboutContent || defaultContent;

  if (loading) {
    return (
      <section id="about" className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </section>
    );
  }

  return (
    <>
      <style>
        {`
          .image-zoom-hover {
            transition: transform 0.3s ease-in-out;
          }

          .image-zoom-hover:hover {
            transform: scale(1.05);
          }

          .text-rise-animation {
            animation: rise-up 0.8s ease-out forwards;
            opacity: 0;
          }

          @keyframes rise-up {
            from {
              transform: translateY(40px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
      <section id="about" ref={sectionRef} className="min-h-screen bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">About Us</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2 order-1">
              <img
                src={content.image_url}
                alt="About Us"
                className="w-full h-full object-contain rounded-xl shadow-lg image-zoom-hover"
              />
            </div>
            <div className={`lg:col-span-3 order-2 space-y-6 ${isVisible ? 'text-rise-animation' : 'opacity-0'}`}>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {content.title}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed break-words">
                {content.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;