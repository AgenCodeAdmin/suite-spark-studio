import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  logo_url: string;
  description: string;
  order_index: number;
}

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
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

  const openModal = (client: Client) => {
    setSelectedClient(client);
  };

  const closeModal = () => {
    setSelectedClient(null);
  };

  if (loading) {
    return (
      <section id="clients" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="clients" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by leading companies across various industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {clients.map((client, index) => (
              <div
                key={client.id}
                className="glass-card-hover p-6 cursor-pointer group"
                onClick={() => openModal(client)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={client.logo_url}
                  alt={client.name}
                  className="w-full h-24 object-contain mx-auto group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-center mt-4 font-semibold text-gray-900">
                  {client.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedClient && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedClient.name}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedClient.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientsSection;