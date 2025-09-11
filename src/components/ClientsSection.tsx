import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Client {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  order_index: number;
}

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('order_index');

        if (error) {
          console.error('Error fetching clients:', error);
        } else if (data) {
          setClients(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return (
      <section id="clients" className="bg-white flex items-center justify-center py-20">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </section>
    );
  }

  const duplicatedClients = Array(5).fill([...clients]).flat();

  return (
    <>
      <style>
        {`
          .clients-scrolling-wrapper {
            display: flex;
            overflow: hidden;
            width: 100%;
            -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
            mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
          }

          .clients-scrolling-content {
            display: flex;
            flex-shrink: 0;
            animation: clients-scroll 20s linear infinite;
          }

          @keyframes clients-scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .client-logo {
            flex: 0 0 auto;
            margin: 0 2rem;
            transition: transform 0.3s ease;
          }

          .client-logo img {
            height: 80px; /* Adjust height as needed */
            width: auto;
            object-fit: contain;
            filter: grayscale(100%);
            transition: filter 0.3s ease;
          }

          .client-logo:hover img {
          filter: grayscale(0%);
            transform: scale(1.1);
          }
        `}
      </style>
      <section id="clients" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">Our Clients</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div>
        </div>
        <div className="clients-scrolling-wrapper">
          <div className="clients-scrolling-content">
            {duplicatedClients.map((client, index) => (
              <div key={`${client.id}-${index}`} className="client-logo">
                <img src={client.logo_url} alt={client.name} loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ClientsSection;