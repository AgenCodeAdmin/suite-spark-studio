import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import * as icons from 'lucide-react';
import parse from 'html-react-parser';

// Define the type for the props of the DynamicIcon component
interface DynamicIconProps extends icons.LucideProps {
  name: keyof typeof icons;
}

// DynamicIcon component to render Lucide icons by name
const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    // Return a default icon or null if the icon name is not found
    return <icons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  description: string;
  icon: string;
  is_featured: boolean;
  order_index: number;
  choose_plan_link: string;
}

const PricingSection = () => {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [contactUsLink, setContactUsLink] = useState<string>('#');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const { data: pricingData, error: pricingError } = await supabase
          .from('pricing_plans')
          .select('*')
          .order('order_index');

        if (pricingError) {
          console.error('Error fetching pricing plans:', pricingError);
        } else if (pricingData) {
          setPricingPlans(pricingData);
        }

        const { data: settingsData, error: settingsError } = await supabase
          .from('website_settings')
          .select('setting_value')
          .eq('setting_name', 'contact_us_link')
          .single();

        if (settingsError) {
          console.error('Error fetching contact us link:', settingsError);
        } else if (settingsData) {
          setContactUsLink(settingsData.setting_value);
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  if (loading) {
    return (
      <section id="pricing" className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">Pricing Designed for Your Success</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`glass-card-hover p-8 relative flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.is_featured ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {plan.is_featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="absolute top-4 left-4">
                <div className="flex items-center justify-center w-10 h-10 border-2 border-blue-500 rounded-full">
                  <span className="text-blue-500 font-bold text-lg">{plan.order_index + 1}</span>
                </div>
              </div>
              
              <div className="text-center mb-8 pt-12">
                <div className="flex justify-center mb-4">
                  <DynamicIcon name={plan.icon as keyof typeof icons} size={48} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {plan.price}
                </div>
              </div>

              <div className="space-y-2 mb-8 flex-grow tiptap-content whitespace-pre-wrap leading-snug">
                {parse(plan.description || '')}
              </div>

              {/* <Button 
                className={`w-full mt-auto transition-all duration-300 hover:scale-105 transform hover:shadow-lg ${
                  plan.is_featured 
                    ? 'btn-primary-glass' 
                    : 'bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => window.open(plan.choose_plan_link || '#', '_blank')}
              >
                Choose Plan
              </Button> */}
            </div>
          ))}
        </div>

        <div className="text-center mb-20">
          <Button 
            className="btn-primary-glass text-lg px-12 py-4"
            onClick={() => window.open(contactUsLink || '#', '_blank')}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;