import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, Trash2 } from 'lucide-react';

const FooterCrud = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [footerContent, setFooterContent] = useState<any>({
    id: null,
    company_name: '',
    company_address: '',
    links: [],
    social_media: {}
  });
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchFooterContent = async () => {
    try {
      const { data, error } = await supabase.from('footer_content').select('*').limit(1).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setFooterContent(data);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch footer content.', variant: 'destructive' });
      console.error('Error fetching footer content:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterContent();
  }, []);

  const saveFooterContent = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('footer_content').upsert(footerContent, { onConflict: 'id' });
      if (error) throw error;
      toast({ title: 'Success', description: 'Footer content updated successfully' });
      fetchFooterContent();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update footer content', variant: 'destructive' });
      console.error('Error saving footer content:', error);
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
        <CardTitle>Footer Content</CardTitle>
        <CardDescription>Manage footer information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="company-name">Company Name</Label>
          <Input id="company-name" value={footerContent.company_name || ''} onChange={(e) => setFooterContent({ ...footerContent, company_name: e.target.value })} className="glass-card" />
        </div>
        <div>
          <Label htmlFor="company-address">Company Address</Label>
          <Textarea id="company-address" value={footerContent.company_address || ''} onChange={(e) => setFooterContent({ ...footerContent, company_address: e.target.value })} className="glass-card" rows={3} />
        </div>
        <div>
          <Label>Links</Label>
          {(footerContent.links || []).map((link: any, index: number) => (
            <div key={index} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
              <Input placeholder="Link Text" value={link.text} onChange={(e) => { const newLinks = [...footerContent.links]; newLinks[index].text = e.target.value; setFooterContent({ ...footerContent, links: newLinks }); }} className="glass-card" />
              <Input placeholder="Link URL" value={link.url} onChange={(e) => { const newLinks = [...footerContent.links]; newLinks[index].url = e.target.value; setFooterContent({ ...footerContent, links: newLinks }); }} className="glass-card" />
              <Button variant="destructive" size="sm" onClick={() => { const newLinks = footerContent.links.filter((_: any, i: number) => i !== index); setFooterContent({ ...footerContent, links: newLinks }); }}><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => { const newLinks = [...(footerContent.links || []), { text: '', url: '' }]; setFooterContent({ ...footerContent, links: newLinks }); }} className="glass-card"><Plus className="w-4 h-4 mr-2" />Add Link</Button>
        </div>
        <div>
          <Label>Social Media</Label>
          <div className="space-y-2">
            <Input placeholder="Instagram URL" value={footerContent.social_media?.instagram || ''} onChange={(e) => setFooterContent({ ...footerContent, social_media: { ...footerContent.social_media, instagram: e.target.value } })} className="glass-card" />
            <Input placeholder="Facebook URL" value={footerContent.social_media?.facebook || ''} onChange={(e) => setFooterContent({ ...footerContent, social_media: { ...footerContent.social_media, facebook: e.target.value } })} className="glass-card" />
            <Input placeholder="WhatsApp URL" value={footerContent.social_media?.whatsapp || ''} onChange={(e) => setFooterContent({ ...footerContent, social_media: { ...footerContent.social_media, whatsapp: e.target.value } })} className="glass-card" />
          </div>
        </div>
        <Button onClick={saveFooterContent} disabled={loading} className="btn-primary-glass"><Save className="w-4 h-4 mr-2" />Save Footer Content</Button>
      </CardContent>
    </Card>
  );
};

export default FooterCrud;
