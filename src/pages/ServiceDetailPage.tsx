import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import parse from 'html-react-parser';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  page_content: string;
  image_url: string;
}

const ServiceDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('services')
          .select('id, title, page_content, image_url')
          .eq('slug', slug)
          .single();

        if (error) {
          throw new Error('Service not found. Please check the URL and try again.');
        }
        
        if (data) {
          setService(data);
        } else {
          throw new Error('Service data could not be loaded.');
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-6">
        <h2 className="text-2xl font-bold text-red-600 mb-4">An Error Occurred</h2>
        <p className="text-gray-700 mb-8">{error}</p>
        <Button asChild>
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
        </Button>
      </div>
    );
  }

  if (!service) {
    return null; // Should be handled by error state
  }

  return (
    <div className="bg-white text-gray-800">
      <header className="relative">
        <img src={service.image_url} alt={service.title} className="w-full h-96 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center px-4">{service.title}</h1>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto py-12 px-6 prose lg:prose-xl">
        <div>
            {parse(service.page_content || '')}
        </div>
      </main>

      <footer className="text-center py-12">
        <Button asChild variant="outline">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Home</Link>
        </Button>
      </footer>
    </div>
  );
};

export default ServiceDetailPage;
