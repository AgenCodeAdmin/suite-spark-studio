import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';

// The service type is now simplified as popup fields are no longer needed here.
interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  order_index: number;
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, title, slug, description, image_url, order_index') // Select only needed columns
          .order('order_index');

        if (error) {
          console.error('Error fetching services:', error);
        } else if (data) {
          setServices(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section id="services" className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="bg-white py-20">
      <style>
        {`
          @keyframes shine {
            0% {
              background-position: 100%;
            }
            100% {
              background-position: -100%;
            }
          }
          .shiny-text {
            background: linear-gradient(
              120deg,
              #3b82f6 30%,
              #C4C4C4 90%,
              #3b82f6 70%
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            display: inline-block;
            animation: shine 4s linear infinite;
          }
        `}
      </style>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">Our Services</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div> {/* Blue underline */}
        <div className="flex flex-wrap justify-center gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="glass-card-hover p-6 group lg:basis-[42%]"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-6">
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <div className="text-gray-700 leading-relaxed mb-4 tiptap-content">
                {parse(service.description)}
              </div>
              <Link 
                to={`/service/${service.slug}`}
                className="hover:underline font-semibold shiny-text"
              >
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* The ServicePopup and related state have been removed */}
    </section>
  );
};

export default ServicesSection;
