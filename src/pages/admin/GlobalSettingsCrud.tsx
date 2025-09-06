import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const GlobalSettingsCrud = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [contactUsLink, setContactUsLink] = useState<string>('');
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchGlobalSettings = async () => {
    try {
      const { data, error } = await supabase.from('website_settings').select('setting_value').eq('setting_name', 'contact_us_link').single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setContactUsLink(data.setting_value);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch global settings.', variant: 'destructive' });
      console.error('Error fetching global settings:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  const saveGlobalSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('website_settings').upsert({ setting_name: 'contact_us_link', setting_value: contactUsLink }, { onConflict: 'setting_name' });
      if (error) throw error;
      toast({ title: 'Success', description: 'Global settings updated successfully' });
      fetchGlobalSettings();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update global settings', variant: 'destructive' });
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
        <CardTitle>Global Settings</CardTitle>
        <CardDescription>Manage global website settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="contact-us-link">Contact Us Button Link</Label>
          <Input id="contact-us-link" value={contactUsLink} onChange={(e) => setContactUsLink(e.target.value)} className="glass-card" />
        </div>
        <Button onClick={saveGlobalSettings} disabled={loading} className="btn-primary-glass"><Save className="w-4 h-4 mr-2" />Save Global Settings</Button>
      </CardContent>
    </Card>
  );
};

export default GlobalSettingsCrud;
