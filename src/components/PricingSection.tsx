import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import parse from 'html-react-parser';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  is_featured: boolean;
  order_index: number;
  choose_plan_link: string; // New field
}

const PricingSection = () => {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [contactUsLink, setContactUsLink] = useState<string>('#'); // New state for contact us link
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        // Fetch pricing plans
        const { data: pricingData, error: pricingError } = await supabase
          .from('pricing_plans')
          .select('*')
          .order('order_index');

        if (pricingError) {
          console.error('Error fetching pricing plans:', pricingError);
        } else if (pricingData) {
          setPricingPlans(pricingData);
        }

        // Fetch contact us link
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
        {/* Pricing Plans */}
        <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">Choose Your Plan</h2>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div> {/* Blue underline */}

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
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-blue-600 mb-4">
                  {plan.price}
                </div>
              </div>

              <div className="space-y-4 mb-8 flex-grow tiptap-content">
                {parse(plan.features.join(''))}
              </div>

              <Button 
                className={`w-full mt-auto transition-all duration-300 hover:scale-105 transform hover:shadow-lg ${
                  plan.is_featured 
                    ? 'btn-primary-glass' 
                    : 'bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => window.open(plan.choose_plan_link || '#', '_blank')}
              >
                Choose Plan
              </Button>
            </div>
          ))}
        </div>

        {/* Contact Us Button */}
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