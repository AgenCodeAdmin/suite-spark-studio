import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2 } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';

const PricingCrud = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchPricingPlans = async () => {
    try {
      const { data, error } = await supabase.from('pricing_plans').select('*').order('order_index');
      if (error) throw error;
      if (data) setPricingPlans(data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch pricing plans.', variant: 'destructive' });
      console.error('Error fetching pricing plans:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  const addPricingPlan = () => {
    setPricingPlans([...pricingPlans, { name: '', price: '', description: '', icon: '', is_featured: false, order_index: pricingPlans.length, choose_plan_link: '' }]);
  };

  const updatePricingPlan = (index: number, field: string, value: any) => {
    const updated = [...pricingPlans];
    updated[index] = { ...updated[index], [field]: value };
    setPricingPlans(updated);
  };

  const removePricingPlan = (index: number) => {
    setPricingPlans(pricingPlans.filter((_, i) => i !== index));
  };

  const savePricingPlans = async () => {
    setLoading(true);
    try {
      await supabase.from('pricing_plans').delete().not('id', 'is', null);
      const plansToSave = pricingPlans
        .filter(plan => plan.name?.trim() !== '' && plan.price?.trim() !== '')
        .map((plan, index) => ({
            name: plan.name,
            price: plan.price,
            description: plan.description,
            icon: plan.icon,
            is_featured: plan.is_featured,
            order_index: index,
            choose_plan_link: plan.choose_plan_link || null
        }));

      if (plansToSave.length > 0) {
        const { error } = await supabase.from('pricing_plans').insert(plansToSave);
        if (error) throw error;
      }
      toast({ title: 'Success', description: 'Pricing plans updated successfully' });
      fetchPricingPlans();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update pricing plans', variant: 'destructive' });
      console.error('Error saving pricing plans:', error);
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
        <CardTitle>Pricing Plans</CardTitle>
        <CardDescription>Manage your pricing plans</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {pricingPlans.map((plan, index) => (
          <div key={plan.id || index} className="glass-card p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Plan {index + 1}</h4>
              <Button onClick={() => removePricingPlan(index)} variant="destructive" size="sm"><Trash2 className="w-4 h-4" /></Button>
            </div>
            <Input placeholder="Plan Name" value={plan.name} onChange={(e) => updatePricingPlan(index, 'name', e.target.value)} className="glass-card" />
            <Input placeholder="Price (e.g., $499/mo)" value={plan.price} onChange={(e) => updatePricingPlan(index, 'price', e.target.value)} className="glass-card" />
            <Input placeholder="Icon (e.g., 'Check', 'Star', from lucide-react)" value={plan.icon || ''} onChange={(e) => updatePricingPlan(index, 'icon', e.target.value)} className="glass-card" />
            <Input placeholder="Choose Plan Link" value={plan.choose_plan_link} onChange={(e) => updatePricingPlan(index, 'choose_plan_link', e.target.value)} className="glass-card" />
            <RichTextEditor description={plan.description || ''} onChange={(html) => updatePricingPlan(index, 'description', html)} />
            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={plan.is_featured} onChange={(e) => updatePricingPlan(index, 'is_featured', e.target.checked)} className="rounded" />
              <Label>Featured Plan</Label>
            </div>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <Button onClick={addPricingPlan} variant="outline" className="glass-card"><Plus className="w-4 h-4 mr-2" />Add Plan</Button>
          <Button onClick={savePricingPlans} disabled={loading} className="btn-primary-glass"><Save className="w-4 h-4 mr-2" />Save Plans</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCrud;
