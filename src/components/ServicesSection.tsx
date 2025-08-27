import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ServicePopup from '@/components/ServicePopup';

interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string;
  popup_description: string;
  popup_button_text: string;
  popup_button_link: string;
  order_index: number;
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
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
        <div className="animate-pulse">Loading...</div>
      </section>
    );
  }

  return (
    <section id="services" className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">Our Services</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div> {/* Blue underline */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="glass-card-hover p-6 group"
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
              <p className="text-gray-700 leading-relaxed mb-4">
                {service.description}
              </p>
              <button 
                onClick={() => setSelectedService(service)}
                className="text-blue-500 hover:underline font-semibold"
              >
                Learn more
              </button>
            </div>
          ))}
        </div>
      </div>
      {selectedService && (
        <ServicePopup 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </section>
  );
};

export default ServicesSection;