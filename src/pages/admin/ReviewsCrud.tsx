import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2 } from 'lucide-react';

const ReviewsCrud = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [customerReviews, setCustomerReviews] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase.from('customer_reviews').select('*').order('order_index');
      if (error) throw error;
      if (data) setCustomerReviews(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch reviews.', variant: 'destructive' });
      console.error('Error fetching reviews:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const addReview = () => {
    setCustomerReviews([...customerReviews, { customer_name: '', designation: '', company_name: '', review_text: '', order_index: customerReviews.length }]);
  };

  const updateReview = (index: number, field: string, value: string) => {
    if (field === 'review_text' && value.length > 186) {
      return;
    }
    const updated = [...customerReviews];
    updated[index] = { ...updated[index], [field]: value };
    setCustomerReviews(updated);
  };

  const removeReview = (index: number) => {
    setCustomerReviews(customerReviews.filter((_, i) => i !== index));
  };

  const saveReviews = async () => {
    setLoading(true);
    try {
      await supabase.from('customer_reviews').delete().not('id', 'is', null);
      const reviewsToSave = customerReviews
        .filter(review => review.customer_name?.trim() !== '' && review.review_text?.trim() !== '' && review.review_text.length <= 186)
        .map((review, index) => ({
            customer_name: review.customer_name,
            designation: review.designation,
            company_name: review.company_name,
            review_text: review.review_text,
            order_index: index
        }));

      if (reviewsToSave.length > 0) {
        const { error } = await supabase.from('customer_reviews').insert(reviewsToSave);
        if (error) throw error;
      }
      toast({ title: 'Success', description: 'Reviews updated successfully' });
      fetchReviews();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update reviews', variant: 'destructive' });
      console.error('Error saving reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div></div>;
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <CardDescription>Manage customer testimonials</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {customerReviews.map((review, index) => (
          <div key={review.id || index} className="glass-card p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Review {index + 1}</h4>
              <Button onClick={() => removeReview(index)} variant="destructive" size="sm"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <Input placeholder="Customer Name" value={review.customer_name || ''} onChange={(e) => updateReview(index, 'customer_name', e.target.value)} className="glass-card" />
            <Input placeholder="Designation" value={review.designation || ''} onChange={(e) => updateReview(index, 'designation', e.target.value)} className="glass-card" />
            <Input placeholder="Company Name" value={review.company_name || ''} onChange={(e) => updateReview(index, 'company_name', e.target.value)} className="glass-card" />
            <Textarea placeholder="Review Text" value={review.review_text || ''} onChange={(e) => updateReview(index, 'review_text', e.target.value)} className="glass-card" rows={3} maxLength={186} />
            <p className="text-sm text-gray-500 text-right">{(review.review_text || '').length}/186</p>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button onClick={addReview} variant="outline" className="glass-card"><Plus className="w-4 h-4 mr-2" />Add Review</Button>
          <Button onClick={saveReviews} disabled={loading} className="btn-primary-glass"><Save className="w-4 h-4 mr-2" />Save Reviews</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsCrud;
