import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import parse from 'html-react-parser';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface AccordionItem {
  id: string;
  heading: string;
  description: string;
  image_url: string;
  order_index: number;
}

const AccordionSection = () => {
  const { data: accordionItems, isLoading, error } = useQuery<AccordionItem[]>(
    { queryKey: ['accordionContent'], queryFn: async () => {
      const { data, error } = await supabase.from('accordion_content').select('*').order('order_index');
      if (error) throw new Error(error.message);
      return data || [];
    }}
  );

  const [activeImage, setActiveImage] = useState<string | undefined>(undefined);
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (accordionItems && accordionItems.length > 0) {
      setActiveImage(accordionItems[0].image_url);
      setActiveAccordionItem(`item-${accordionItems[0].id}`);
    }
  }, [accordionItems]);

  if (isLoading) {
    return (
      <section id="accordion" className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="accordion" className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-500">Error: {error.message}</div>
      </section>
    );
  }

  const handleAccordionChange = (value: string) => {
    if (value) {
      setActiveAccordionItem(value);
      const selectedItem = accordionItems?.find(item => `item-${item.id}` === value);
      setActiveImage(selectedItem?.image_url);
    } else if (accordionItems && accordionItems.length > 0) {
      // If all items are collapsed, reopen the first one
      const firstItemId = `item-${accordionItems[0].id}`;
      setActiveAccordionItem(firstItemId);
      setActiveImage(accordionItems[0].image_url);
    }
  };

  return (
    <section id="accordion" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">Our Approach</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div>

        <div className="border rounded-xl p-4 sm:p-6 md:p-8">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Text Accordion - 100% on small, 60% on medium+ */}
            <div className="md:col-span-7">
              <Accordion type="single" value={activeAccordionItem} onValueChange={handleAccordionChange} className="w-full">
                {accordionItems?.map((item) => (
                  <AccordionItem key={item.id} value={`item-${item.id}`}>
                    <AccordionTrigger className="text-2xl font-semibold text-gray-900 hover:no-underline text-left">
                      {item.heading}
                    </AccordionTrigger>
                    <AccordionContent className="text-lg text-gray-700 leading-relaxed pre-wrap">
                      {parse(item.description)}
                      {/* Image for small screens */}
                      <div className="md:hidden mt-4">
                        {activeImage === item.image_url && (
                          <img 
                            src={item.image_url}
                            alt={item.heading}
                            className="w-full h-full object-contain rounded-xl shadow-lg image-zoom-hover"
                          />
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Image - Hidden on small, 40% on medium+ */}
            <div className="hidden md:block md:col-span-5 sticky top-24">
              <div className="flex justify-center items-center h-full">
                {activeImage ? (
                  <img 
                    src={activeImage}
                    alt="Our Approach"
                    className="w-full h-full object-contain rounded-xl shadow-lg image-zoom-hover"
                  />
                ) : (
                  <div className="w-[400px] h-[400px] flex items-center justify-center bg-gray-100 rounded-xl">
                    <p className="text-gray-500">Select an item to see the image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccordionSection;
