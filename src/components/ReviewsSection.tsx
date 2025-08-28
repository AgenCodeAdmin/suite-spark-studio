import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CustomerReview {
  id: string;
  customer_name: string;
  designation: string;
  company_name: string;
  review_text: string;
  order_index: number;
}

const ReviewsSection = () => {
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('customer_reviews')
          .select('*')
          .order('order_index');

        if (error) {
          console.error('Error fetching customer reviews:', error);
        } else if (data) {
          setCustomerReviews(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <section id="reviews" className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      </section>
    );
  }

  const duplicatedReviews = [...customerReviews, ...customerReviews];

  return (
    <>
      <style>
        {`
          .scrolling-wrapper {
            display: flex;
            overflow: hidden;
            width: 100%;
            padding-top: 2rem;
            padding-bottom: 2rem;
            -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
            mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
          }

          .scrolling-content {
            display: flex;
            flex-shrink: 0;
            animation: scroll 40s linear infinite;
          }

          @keyframes scroll {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .review-card {
            flex: 0 0 auto;
            width: 80vw; /* Smaller width for mobile */
            max-width: 320px; /* Adjust max-width */
            margin: 0 1rem;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .review-text {
            white-space: pre-wrap; /* Preserve formatting */
            word-wrap: break-word;
          }

          .scrolling-wrapper:hover .scrolling-content {
            animation-play-state: paused;
          }

          .review-card:hover {
            transform: translateY(-10px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          }

          /* Media Queries for responsiveness */
          @media (min-width: 640px) {
            .review-card {
              width: 45vw;
              font-size: 0.9rem;
            }
          }

          @media (min-width: 768px) {
            .review-card {
              width: 30vw;
              font-size: 0.95rem;
            }
          }

          @media (min-width: 1024px) {
            .review-card {
              width: 22vw;
              font-size: 1rem;
            }
          }

          @media (min-width: 1280px) {
            .review-card {
              width: 20vw;
            }
          }
        `}
      </style>
      <section id="reviews" className="bg-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-gray-900 text-center mb-4">What Our Clients Say</h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-12 rounded-full"></div>
        </div>
        <div className="scrolling-wrapper">
          <div className="scrolling-content">
            {duplicatedReviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className="review-card glass-card-hover p-6 rounded-lg shadow-lg glow-on-hover"
              >
                <p className="review-text text-gray-700 mb-6 leading-relaxed italic break-words whitespace-normal">
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
    </>
  );
};

export default ReviewsSection;
