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
import AccordionCrud from '@/pages/admin/AccordionCrud';
import LogoCarouselCrud from '@/pages/admin/LogoCarouselCrud';
import PainPointsCrud from '@/pages/admin/PainPointsCrud';
import ProgressStagesCrud from '@/pages/admin/ProgressStagesCrud';
import ContactSubmissionsCrud from '@/pages/admin/ContactSubmissionsCrud';
import FaqCrud from '@/pages/admin/FaqCrud';
import RichTextEditor from '@/components/ui/RichTextEditor';
import ServiceCrud from '@/pages/admin/ServiceCrud';
import HeroCrud from '@/pages/admin/HeroCrud';
import AboutCrud from '@/pages/admin/AboutCrud';
import ClientsCrud from '@/pages/admin/ClientsCrud';
import PricingCrud from '@/pages/admin/PricingCrud';
import ReviewsCrud from '@/pages/admin/ReviewsCrud';
import FooterCrud from '@/pages/admin/FooterCrud';
import GlobalSettingsCrud from '@/pages/admin/GlobalSettingsCrud';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/admin/login');
      }
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // ... other functions remain ...
  

  

  

  

  

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
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
            <TabsList className="glass-card p-2 sm:p-3 flex-wrap overflow-x-auto">
              <TabsTrigger value="hero">Hero Section</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="footer">Footer</TabsTrigger>
              <TabsTrigger value="accordion">Accordion Content</TabsTrigger>
              <TabsTrigger value="logo-carousel">Logo Carousel</TabsTrigger>
              <TabsTrigger value="pain-points">Business Problems</TabsTrigger>
              <TabsTrigger value="progress-stages">Progress Stages</TabsTrigger>
              <TabsTrigger value="contact-submissions">Contact Submissions</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="global-settings">Global Settings</TabsTrigger>
            </TabsList>

            {/* 6. REPLACED content with new component */}
            <TabsContent value="hero">
              <HeroCrud />
            </TabsContent>

            <TabsContent value="about">
              <AboutCrud />
            </TabsContent>

            <TabsContent value="services">
              <ServiceCrud />
            </TabsContent>

            <TabsContent value="clients">
              <ClientsCrud />
            </TabsContent>

            <TabsContent value="pricing">
              <PricingCrud />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsCrud />
            </TabsContent>

            <TabsContent value="footer">
              <FooterCrud />
            </TabsContent>

            <TabsContent value="accordion"><AccordionCrud /></TabsContent>
            <TabsContent value="logo-carousel"><LogoCarouselCrud /></TabsContent>
            <TabsContent value="pain-points"><PainPointsCrud /></TabsContent>
            <TabsContent value="progress-stages"><ProgressStagesCrud /></TabsContent>
            <TabsContent value="contact-submissions"><ContactSubmissionsCrud /></TabsContent>
            <TabsContent value="faqs"><FaqCrud /></TabsContent>

            <TabsContent value="global-settings">
              <GlobalSettingsCrud />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
