import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  is_featured: boolean;
  order_index: number;
}

interface CustomerReview {
  id: string;
  customer_name: string;
  designation: string;
  company_name: string;
  review_text: string;
  order_index: number;
}

const PricingSection = () => {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const [plansResponse, reviewsResponse] = await Promise.all([
          supabase.from('pricing_plans').select('*').order('order_index'),
          supabase.from('customer_reviews').select('*').order('order_index')
        ]);

        if (plansResponse.error) {
          console.error('Error fetching pricing plans:', plansResponse.error);
        } else if (plansResponse.data) {
          setPricingPlans(plansResponse.data);
        }

        if (reviewsResponse.error) {
          console.error('Error fetching customer reviews:', reviewsResponse.error);
        } else if (reviewsResponse.data) {
          setCustomerReviews(reviewsResponse.data);
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
      <section id="pricing" className="py-20 bg-gradient-to-b from-blue-50/30 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-blue-50/30 to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Pricing Plans */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Flexible pricing options designed to scale with your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={`glass-card-hover p-8 relative ${
                plan.is_featured ? 'ring-2 ring-blue-500 scale-105' : ''
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

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.is_featured 
                    ? 'btn-primary-glass' 
                    : 'bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50'
                }`}
              >
                Choose Plan
              </Button>
            </div>
          ))}
        </div>

        {/* Contact Us Button */}
        <div className="text-center mb-20">
          <Button className="btn-primary-glass text-lg px-12 py-4">
            Contact Us
          </Button>
        </div>

        {/* Customer Reviews */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What Our Clients Say
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {customerReviews.map((review, index) => (
            <div
              key={review.id}
              className="glass-card-hover p-6"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{review.review_text}"
              </p>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">
                  {review.customer_name}
                </h4>
                <p className="text-gray-600">
                  {review.designation}
                </p>
                <p className="text-gray-600">
                  {review.company_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;