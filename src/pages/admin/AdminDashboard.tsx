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
import AccordionCrud from '@/pages/admin/AccordionCrud'


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // State for all content types
  const [heroContent, setHeroContent] = useState({
    id: null, // Add id to state
    headline: '',
    subheadline: '',
    background_image_url: '',
    cta_text: 'Get Started Now',
    cta_link: ''
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
    id: null,
    company_name: '',
    company_address: '',
    links: [],
    social_media: {}
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin/login');
      }
    };

    checkUser();
    fetchAllContent();
  }, [navigate]);

  const fetchAllContent = async () => {
    try {
      // Fetch all content in parallel
      const [heroRes, aboutRes, servicesRes, clientsRes, pricingRes, reviewsRes, footerRes] = await Promise.all([
        supabase.from('hero_content').select('*').limit(1).single(),
        supabase.from('about_content').select('*').single(),
        supabase.from('services').select('*').order('order_index'),
        supabase.from('clients').select('*').order('order_index'),
        supabase.from('pricing_plans').select('*').order('order_index'),
        supabase.from('customer_reviews').select('*').order('order_index'),
        supabase.from('footer_content').select('*').limit(1).single()
      ]);

      if (heroRes.data) {
        setHeroContent({ ...heroRes.data, id: heroRes.data.id });
      } else {
        // Initialize id to null for initial insert, Supabase will generate it
        setHeroContent({
          id: null,
          headline: '',
          subheadline: '',
          background_image_url: '',
          cta_text: 'Get Started Now',
          cta_link: ''
        });
      }
      if (aboutRes.data) setAboutContent(aboutRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (clientsRes.data) setClients(clientsRes.data);
      if (pricingRes.data) setPricingPlans(pricingRes.data);
      if (reviewsRes.data) setCustomerReviews(reviewsRes.data);
      if (footerRes.data) {
        setFooterContent(footerRes.data);
      } else {
        // Initialize with a default object if no data is found
        setFooterContent({
          id: null,
          company_name: '',
          company_address: '',
          links: [],
          social_media: {},
        });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const saveHeroContent = async () => {
    setLoading(true);
    console.log('heroContent before save:', heroContent);
    try {
      const { error } = await supabase
        .from('hero_content')
        .upsert(heroContent);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Hero content updated successfully',
      });
      fetchAllContent();
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
      const { id, ...rest } = aboutContent;
      const dataToSave = id ? { ...rest, id } : rest;

      const { error } = await supabase
        .from('about_content')
        .upsert(dataToSave);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'About content updated successfully',
      });
      fetchAllContent();
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

  // Services management
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
      await supabase.from('services').delete().gte('id', '00000000-0000-0000-0000-000000000000');
      
      const servicesToSave = services.filter(service => 
        service.title.trim() !== '' && service.description.trim() !== ''
      );
      
      if (servicesToSave.length > 0) {
        const { error } = await supabase
          .from('services')
          .insert(servicesToSave.map((service, index) => ({
            title: service.title,
            description: service.description,
            image_url: service.image_url || null,
            popup_description: service.popup_description,
            popup_button_text: service.popup_button_text,
            popup_button_link: service.popup_button_link,
            order_index: index
          })));

        if (error) throw error;
      }

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

  // Clients management
  const addClient = () => {
    setClients([...clients, {
      name: '',
      logo_url: '',
      description: '',
      order_index: clients.length
    }]);
  };

  const updateClient = (index: number, field: string, value: string) => {
    const updated = [...clients];
    updated[index] = { ...updated[index], [field]: value };
    setClients(updated);
  };

  const removeClient = (index: number) => {
    setClients(clients.filter((_, i) => i !== index));
  };

  const saveClients = async () => {
    setLoading(true);
    try {
      await supabase.from('clients').delete().gte('id', '00000000-0000-0000-0000-000000000000');
      
      const clientsToSave = clients.filter(client => 
        client.name.trim() !== '' && client.logo_url.trim() !== ''
      );
      
      if (clientsToSave.length > 0) {
        const { error } = await supabase
          .from('clients')
          .insert(clientsToSave.map((client, index) => ({
            name: client.name,
            logo_url: client.logo_url,
            description: client.description || '',
            order_index: index
          })));

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Clients updated successfully',
      });
      
      fetchAllContent();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update clients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Pricing management
  const addPricingPlan = () => {
    setPricingPlans([...pricingPlans, {
      name: '',
      price: '',
      features: [],
      is_featured: false,
      order_index: pricingPlans.length
    }]);
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
      await supabase.from('pricing_plans').delete().gte('id', '00000000-0000-0000-0000-000000000000');
      
      const plansToSave = pricingPlans.filter(plan => 
        plan.name.trim() !== '' && plan.price.trim() !== ''
      );
      
      if (plansToSave.length > 0) {
        const { error } = await supabase
          .from('pricing_plans')
          .insert(plansToSave.map((plan, index) => ({
            name: plan.name,
            price: plan.price,
            features: plan.features,
            is_featured: plan.is_featured,
            order_index: index
          })));

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Pricing plans updated successfully',
      });
      
      fetchAllContent();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update pricing plans',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Reviews management
  const addReview = () => {
    setCustomerReviews([...customerReviews, {
      customer_name: '',
      designation: '',
      company_name: '',
      review_text: '',
      order_index: customerReviews.length
    }]);
  };

  const updateReview = (index: number, field: string, value: string) => {
    if (field === 'review_text' && value.length > 186) {
      return; // Do not update state if character limit is exceeded
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
      await supabase.from('customer_reviews').delete().gte('id', '00000000-0000-0000-0000-000000000000');
      
      const reviewsToSave = customerReviews.filter(review => 
        review.customer_name.trim() !== '' && review.review_text.trim() !== '' && review.review_text.length <= 186
      );
      
      if (reviewsToSave.length > 0) {
        const { error } = await supabase
          .from('customer_reviews')
          .insert(reviewsToSave.map((review, index) => ({
            customer_name: review.customer_name,
            designation: review.designation,
            company_name: review.company_name,
            review_text: review.review_text,
            order_index: index
          })));

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Reviews updated successfully',
      });
      
      fetchAllContent();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveFooterContent = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('footer_content')
        .upsert(footerContent, { onConflict: 'id' });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Footer content updated successfully',
      });

      // Fetch the latest data and update the state
      const { data, error: fetchError } = await supabase
        .from('footer_content')
        .select('*')
        .limit(1)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setFooterContent(data);
      }

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update footer content',
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
              <TabsTrigger value="accordion">Accordion Content</TabsTrigger>
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
                      maxLength={25}
                      className="glass-card"
                    />
                    <p className="text-sm text-gray-500 text-right">
                      {heroContent.headline.length}/25
                    </p>
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
                  <div>
                    <Label htmlFor="cta-link">CTA Button Link</Label>
                    <Input
                      id="cta-link"
                      value={heroContent.cta_link}
                      onChange={(e) => setHeroContent({...heroContent, cta_link: e.target.value})}
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
                      <Textarea
                        placeholder="Popup Description"
                        value={service.popup_description}
                        onChange={(e) => updateService(index, 'popup_description', e.target.value)}
                        className="glass-card"
                      />
                      <Input
                        placeholder="Popup Button Text"
                        value={service.popup_button_text}
                        onChange={(e) => updateService(index, 'popup_button_text', e.target.value)}
                        className="glass-card"
                      />
                      <Input
                        placeholder="Popup Button Link"
                        value={service.popup_button_link}
                        onChange={(e) => updateService(index, 'popup_button_link', e.target.value)}
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

            {/* Clients Content */}
            <TabsContent value="clients">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Clients Section</CardTitle>
                  <CardDescription>Manage your client logos and information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {clients.map((client, index) => (
                    <div key={index} className="glass-card p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Client {index + 1}</h4>
                        <Button 
                          onClick={() => removeClient(index)} 
                          variant="destructive" 
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Client Name"
                        value={client.name}
                        onChange={(e) => updateClient(index, 'name', e.target.value)}
                        className="glass-card"
                      />
                      <Input
                        placeholder="Logo URL"
                        value={client.logo_url}
                        onChange={(e) => updateClient(index, 'logo_url', e.target.value)}
                        className="glass-card"
                      />
                      <Textarea
                        placeholder="Client Description"
                        value={client.description}
                        onChange={(e) => updateClient(index, 'description', e.target.value)}
                        className="glass-card"
                      />
                    </div>
                  ))}
                  <div className="flex space-x-3">
                    <Button onClick={addClient} variant="outline" className="glass-card">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Client
                    </Button>
                    <Button onClick={saveClients} disabled={loading} className="btn-primary-glass">
                      <Save className="w-4 h-4 mr-2" />
                      Save Clients
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pricing Content */}
            <TabsContent value="pricing">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Pricing Plans</CardTitle>
                  <CardDescription>Manage your pricing plans</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {pricingPlans.map((plan, index) => (
                    <div key={index} className="glass-card p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Plan {index + 1}</h4>
                        <Button 
                          onClick={() => removePricingPlan(index)} 
                          variant="destructive" 
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Plan Name"
                        value={plan.name}
                        onChange={(e) => updatePricingPlan(index, 'name', e.target.value)}
                        className="glass-card"
                      />
                      <Input
                        placeholder="Price (e.g., $499/mo)"
                        value={plan.price}
                        onChange={(e) => updatePricingPlan(index, 'price', e.target.value)}
                        className="glass-card"
                      />
                      <Textarea
                        placeholder="Features (one per line)"
                        value={plan.features.join('\n')}
                        onChange={(e) => updatePricingPlan(index, 'features', e.target.value.split('\n').filter(f => f.trim()))}
                        className="glass-card"
                        rows={4}
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={plan.is_featured}
                          onChange={(e) => updatePricingPlan(index, 'is_featured', e.target.checked)}
                          className="rounded"
                        />
                        <Label>Featured Plan</Label>
                      </div>
                    </div>
                  ))}
                  <div className="flex space-x-3">
                    <Button onClick={addPricingPlan} variant="outline" className="glass-card">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Plan
                    </Button>
                    <Button onClick={savePricingPlans} disabled={loading} className="btn-primary-glass">
                      <Save className="w-4 h-4 mr-2" />
                      Save Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Content */}
            <TabsContent value="reviews">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>Manage customer testimonials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {customerReviews.map((review, index) => (
                    <div key={index} className="glass-card p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Review {index + 1}</h4>
                        <Button 
                          onClick={() => removeReview(index)} 
                          variant="destructive" 
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Customer Name"
                        value={review.customer_name}
                        onChange={(e) => updateReview(index, 'customer_name', e.target.value)}
                        className="glass-card"
                      />
                      <Input
                        placeholder="Designation"
                        value={review.designation}
                        onChange={(e) => updateReview(index, 'designation', e.target.value)}
                        className="glass-card"
                      />
                      <Input
                        placeholder="Company Name"
                        value={review.company_name}
                        onChange={(e) => updateReview(index, 'company_name', e.target.value)}
                        className="glass-card"
                      />
                      <Textarea
                        placeholder="Review Text"
                        value={review.review_text}
                        onChange={(e) => updateReview(index, 'review_text', e.target.value)}
                        className="glass-card"
                        rows={3}
                        maxLength={186}
                      />
                      <p className="text-sm text-gray-500 text-right">
                        {review.review_text.length}/186
                      </p>
                    </div>
                  ))}
                  <div className="flex space-x-3">
                    <Button onClick={addReview} variant="outline" className="glass-card">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Review
                    </Button>
                    <Button onClick={saveReviews} disabled={loading} className="btn-primary-glass">
                      <Save className="w-4 h-4 mr-2" />
                      Save Reviews
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          
            {/* Footer Content */}
            <TabsContent value="footer">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Footer Content</CardTitle>
                  <CardDescription>Manage footer information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input
                      id="company-name"
                      value={footerContent.company_name}
                      onChange={(e) => setFooterContent({...footerContent, company_name: e.target.value})}
                      className="glass-card"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-address">Company Address</Label>
                    <Textarea
                      id="company-address"
                      value={footerContent.company_address}
                      onChange={(e) => setFooterContent({...footerContent, company_address: e.target.value})}
                      className="glass-card"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Links</Label>
                    {footerContent.links.map((link, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                          placeholder="Link Text"
                          value={link.text}
                          onChange={(e) => {
                            const newLinks = [...footerContent.links];
                            newLinks[index].text = e.target.value;
                            setFooterContent({ ...footerContent, links: newLinks });
                          }}
                          className="glass-card"
                        />
                        <Input
                          placeholder="Link URL"
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...footerContent.links];
                            newLinks[index].url = e.target.value;
                            setFooterContent({ ...footerContent, links: newLinks });
                          }}
                          className="glass-card"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newLinks = footerContent.links.filter((_, i) => i !== index);
                            setFooterContent({ ...footerContent, links: newLinks });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newLinks = [...footerContent.links, { text: '', url: '' }];
                        setFooterContent({ ...footerContent, links: newLinks });
                      }}
                      className="glass-card"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                  <div>
                    <Label>Social Media</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Instagram URL"
                        value={footerContent.social_media.instagram || ''}
                        onChange={(e) => setFooterContent({ ...footerContent, social_media: { ...footerContent.social_media, instagram: e.target.value } })}
                        className="glass-card"
                      />
                      <Input
                        placeholder="Facebook URL"
                        value={footerContent.social_media.facebook || ''}
                        onChange={(e) => setFooterContent({ ...footerContent, social_media: { ...footerContent.social_media, facebook: e.target.value } })}
                        className="glass-card"
                      />
                      <Input
                        placeholder="WhatsApp URL"
                        value={footerContent.social_media.whatsapp || ''}
                        onChange={(e) => setFooterContent({ ...footerContent, social_media: { ...footerContent.social_media, whatsapp: e.target.value } })}
                        className="glass-card"
                      />
                    </div>
                  </div>
                  <Button onClick={saveFooterContent} disabled={loading} className="btn-primary-glass">
                    <Save className="w-4 h-4 mr-2" />
                    Save Footer Content
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accordion Content */}
            <TabsContent value="accordion">
              <AccordionCrud />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

