import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const AboutCrud = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aboutContent, setAboutContent] = useState<{id: string | null; title: string; description: string; image_url: string}>({
    id: null,
    title: '',
    description: '',
    image_url: ''
  });
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchAboutContent = async () => {
    try {
      const { data, error } = await supabase.from('about_content').select('*').single();
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }
      if (data) {
        setAboutContent(data);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch about content.', variant: 'destructive' });
      console.error('Error fetching about content:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const saveAboutContent = async () => {
    setLoading(true);
    try {
      const { id, ...rest } = aboutContent;
      const dataToSave = id ? { ...rest, id } : rest;
      const { error } = await supabase.from('about_content').upsert(dataToSave);
      if (error) throw error;
      toast({ title: 'Success', description: 'About content updated successfully' });
      fetchAboutContent();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update about content', variant: 'destructive' });
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
        <CardTitle>About Section</CardTitle>
        <CardDescription>Manage the about section content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="about-title">Title</Label>
          <Input id="about-title" value={aboutContent.title} onChange={(e) => setAboutContent({ ...aboutContent, title: e.target.value })} className="glass-card" />
        </div>
        <div>
          <Label htmlFor="about-description">Description</Label>
          <Textarea id="about-description" value={aboutContent.description} onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })} className="glass-card" rows={5} />
        </div>
        <div>
          <Label htmlFor="about-image">Image URL</Label>
          <Input id="about-image" value={aboutContent.image_url} onChange={(e) => setAboutContent({ ...aboutContent, image_url: e.target.value })} className="glass-card" />
        </div>
        <Button onClick={saveAboutContent} disabled={loading} className="btn-primary-glass"><Save className="w-4 h-4 mr-2" />Save About Content</Button>
      </CardContent>
    </Card>
  );
};

export default AboutCrud;
