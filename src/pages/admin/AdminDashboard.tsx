import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Save, Plus, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // State for all content types
  const [heroContent, setHeroContent] = useState({
    headline: '',
    subheadline: '',
    background_image_url: '',
    cta_text: 'Get Started Now'
  });

  const [aboutContent, setAboutContent] = useState({
    title: '',
    description: '',
    image_url: ''
  });

  const [services, setServices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [pricingPlans, setPricingPlans] = useState<any[]>([]);
  const [customerReviews, setCustomerReviews] = useState<any[]>([]);
  const [footerContent, setFooterContent] = useState({
    company_name: '',
    company_address: '',
    links: '[]',
    social_media: '{}'
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    fetchAllContent();
  }, [navigate]);

  const fetchAllContent = async () => {
    try {
      // Fetch all content in parallel
      const [heroRes, aboutRes, servicesRes, clientsRes, pricingRes, reviewsRes, footerRes] = await Promise.all([
        supabase.from('hero_content').select('*').single(),
        supabase.from('about_content').select('*').single(),
        supabase.from('services').select('*').order('order_index'),
        supabase.from('clients').select('*').order('order_index'),
        supabase.from('pricing_plans').select('*').order('order_index'),
        supabase.from('customer_reviews').select('*').order('order_index'),
        supabase.from('footer_content').select('*').single()
      ]);

      if (heroRes.data) setHeroContent(heroRes.data);
      if (aboutRes.data) setAboutContent(aboutRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (clientsRes.data) setClients(clientsRes.data);
      if (pricingRes.data) setPricingPlans(pricingRes.data);
      if (reviewsRes.data) setCustomerReviews(reviewsRes.data);
      if (footerRes.data) {
        setFooterContent({
          ...footerRes.data,
          links: JSON.stringify(footerRes.data.links),
          social_media: JSON.stringify(footerRes.data.social_media)
        });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const saveHeroContent = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('hero_content')
        .upsert(heroContent);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Hero content updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update hero content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAboutContent = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('about_content')
        .upsert(aboutContent);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'About content updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update about content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addService = () => {
    setServices([...services, {
      title: '',
      description: '',
      image_url: '',
      order_index: services.length
    }]);
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const saveServices = async () => {
    setLoading(true);
    try {
      // Delete all existing services and insert new ones
      await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      const { error } = await supabase
        .from('services')
        .insert(services.map((service, index) => ({
          ...service,
          order_index: index
        })));

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Services updated successfully',
      });
      
      fetchAllContent();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="glass-card p-4">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your website content</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="glass-card">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="hero" className="space-y-6">
            <TabsList className="glass-card p-2">
              <TabsTrigger value="hero">Hero Section</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="footer">Footer</TabsTrigger>
            </TabsList>

            {/* Hero Content */}
            <TabsContent value="hero">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Manage the main hero section content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      value={heroContent.headline}
                      onChange={(e) => setHeroContent({...heroContent, headline: e.target.value})}
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subheadline">Subheadline</Label>
                    <Textarea
                      id="subheadline"
                      value={heroContent.subheadline}
                      onChange={(e) => setHeroContent({...heroContent, subheadline: e.target.value})}
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bg-image">Background Image URL</Label>
                    <Input
                      id="bg-image"
                      value={heroContent.background_image_url}
                      onChange={(e) => setHeroContent({...heroContent, background_image_url: e.target.value})}
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta-text">CTA Button Text</Label>
                    <Input
                      id="cta-text"
                      value={heroContent.cta_text}
                      onChange={(e) => setHeroContent({...heroContent, cta_text: e.target.value})}
                      className="glass-card"
                    />
                  </div>
                  <Button onClick={saveHeroContent} disabled={loading} className="btn-primary-glass">
                    <Save className="w-4 h-4 mr-2" />
                    Save Hero Content
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* About Content */}
            <TabsContent value="about">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>About Section</CardTitle>
                  <CardDescription>Manage the about section content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="about-title">Title</Label>
                    <Input
                      id="about-title"
                      value={aboutContent.title}
                      onChange={(e) => setAboutContent({...aboutContent, title: e.target.value})}
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="about-description">Description</Label>
                    <Textarea
                      id="about-description"
                      value={aboutContent.description}
                      onChange={(e) => setAboutContent({...aboutContent, description: e.target.value})}
                      className="glass-card"
                      rows={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="about-image">Image URL</Label>
                    <Input
                      id="about-image"
                      value={aboutContent.image_url}
                      onChange={(e) => setAboutContent({...aboutContent, image_url: e.target.value})}
                      className="glass-card"
                    />
                  </div>
                  <Button onClick={saveAboutContent} disabled={loading} className="btn-primary-glass">
                    <Save className="w-4 h-4 mr-2" />
                    Save About Content
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Content */}
            <TabsContent value="services">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Services Section</CardTitle>
                  <CardDescription>Manage your services</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {services.map((service, index) => (
                    <div key={index} className="glass-card p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Service {index + 1}</h4>
                        <Button 
                          onClick={() => removeService(index)} 
                          variant="destructive" 
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Service Title"
                        value={service.title}
                        onChange={(e) => updateService(index, 'title', e.target.value)}
                        className="glass-card"
                      />
                      <Textarea
                        placeholder="Service Description"
                        value={service.description}
                        onChange={(e) => updateService(index, 'description', e.target.value)}
                        className="glass-card"
                      />
                      <Input
                        placeholder="Image URL"
                        value={service.image_url}
                        onChange={(e) => updateService(index, 'image_url', e.target.value)}
                        className="glass-card"
                      />
                    </div>
                  ))}
                  <div className="flex space-x-3">
                    <Button onClick={addService} variant="outline" className="glass-card">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                    <Button onClick={saveServices} disabled={loading} className="btn-primary-glass">
                      <Save className="w-4 h-4 mr-2" />
                      Save Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs would follow similar patterns */}
            <TabsContent value="clients">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Clients Section</CardTitle>
                  <CardDescription>Coming soon - Client management interface</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Pricing Plans</CardTitle>
                  <CardDescription>Coming soon - Pricing management interface</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>Coming soon - Review management interface</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="footer">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Footer Content</CardTitle>
                  <CardDescription>Coming soon - Footer management interface</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
