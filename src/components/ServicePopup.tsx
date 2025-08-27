import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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

interface ServicePopupProps {
  service: Service;
  onClose: () => void;
}

const ServicePopup: React.FC<ServicePopupProps> = ({ service, onClose }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="bg-white w-full h-full overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10">
          <X size={32} />
        </button>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 text-left">{service.title}</h2>
          <div className="mb-8 max-h-96 flex justify-center">
            <img
              src={service.image_url}
              alt={service.title}
              className="w-auto h-full object-contain rounded-xl shadow-lg"
            />
          </div>
          <div className="mt-20 text-gray-800 leading-relaxed text-base sm:text-lg" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            <p>
              {service.popup_description}
            </p>
          </div>
          <div className="mt-8 text-center">
            <a href={service.popup_button_link} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="btn-primary-glass text-lg">
                {service.popup_button_text}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePopup;
