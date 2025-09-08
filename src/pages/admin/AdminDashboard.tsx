import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { LogOut, Menu, ChevronRight } from 'lucide-react';
import AccordionCrud from '@/pages/admin/AccordionCrud';
import LogoCarouselCrud from '@/pages/admin/LogoCarouselCrud';
import PainPointsCrud from '@/pages/admin/PainPointsCrud';
import ProgressStagesCrud from '@/pages/admin/ProgressStagesCrud';
import ContactSubmissionsCrud from '@/pages/admin/ContactSubmissionsCrud';
import FaqCrud from '@/pages/admin/FaqCrud';
import ServiceCrud from '@/pages/admin/ServiceCrud';
import HeroCrud from '@/pages/admin/HeroCrud';
import AboutCrud from '@/pages/admin/AboutCrud';
import ClientsCrud from '@/pages/admin/ClientsCrud';
import PricingCrud from '@/pages/admin/PricingCrud';
import ReviewsCrud from '@/pages/admin/ReviewsCrud';
import FooterCrud from '@/pages/admin/FooterCrud';
import GlobalSettingsCrud from '@/pages/admin/GlobalSettingsCrud';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isContentManagementOpen, setIsContentManagementOpen] = useState(true);

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

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="glass-card">
                <Menu className="h-6 w-6" />
              </Button>
              <div className="glass-card p-4">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your website content</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="glass-card">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="contact-submissions">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-start">
              <div className={cn(
                  "transition-all duration-300 ease-in-out shrink-0",
                  isSidebarOpen ? "w-full sm:w-64" : "w-0"
              )}>
                  <TabsList className={cn(
                      "glass-card flex-col space-y-1 w-full",
                      isSidebarOpen ? "p-2" : "p-0 overflow-hidden border-none"
                  )}>
                    <TabsTrigger value="contact-submissions" className="w-full justify-start text-base font-bold">
                      Contact Submissions
                    </TabsTrigger>
                    
                    <Collapsible open={isContentManagementOpen} onOpenChange={setIsContentManagementOpen} className="w-full space-y-1">
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-base font-bold hover:bg-muted rounded-md">
                          <span>Content Management</span>
                          <ChevronRight className={cn("h-5 w-5 transition-transform", isContentManagementOpen && "rotate-90")} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="space-y-1 pl-4">
                        <TabsTrigger value="hero" className="w-full justify-start">Hero Section</TabsTrigger>
                        <TabsTrigger value="about" className="w-full justify-start">About</TabsTrigger>
                        <TabsTrigger value="services" className="w-full justify-start">Services</TabsTrigger>
                        <TabsTrigger value="clients" className="w-full justify-start">Clients</TabsTrigger>
                        <TabsTrigger value="pricing" className="w-full justify-start">Pricing</TabsTrigger>
                        <TabsTrigger value="reviews" className="w-full justify-start">Reviews</TabsTrigger>
                        <TabsTrigger value="footer" className="w-full justify-start">Footer</TabsTrigger>
                        <TabsTrigger value="accordion" className="w-full justify-start">Accordion Content</TabsTrigger>
                        <TabsTrigger value="logo-carousel" className="w-full justify-start">Logo Carousel</TabsTrigger>
                        <TabsTrigger value="pain-points" className="w-full justify-start">Business Problems</TabsTrigger>
                        <TabsTrigger value="progress-stages" className="w-full justify-start">Progress Stages</TabsTrigger>
                        <TabsTrigger value="faqs" className="w-full justify-start">FAQs</TabsTrigger>
                        <TabsTrigger value="global-settings" className="w-full justify-start">Global Settings</TabsTrigger>
                      </CollapsibleContent>
                    </Collapsible>
                  </TabsList>
              </div>
              <div className="flex-grow">
                <TabsContent value="hero"><HeroCrud /></TabsContent>
                <TabsContent value="about"><AboutCrud /></TabsContent>
                <TabsContent value="services"><ServiceCrud /></TabsContent>
                <TabsContent value="clients"><ClientsCrud /></TabsContent>
                <TabsContent value="pricing"><PricingCrud /></TabsContent>
                <TabsContent value="reviews"><ReviewsCrud /></TabsContent>
                <TabsContent value="footer"><FooterCrud /></TabsContent>
                <TabsContent value="accordion"><AccordionCrud /></TabsContent>
                <TabsContent value="logo-carousel"><LogoCarouselCrud /></TabsContent>
                <TabsContent value="pain-points"><PainPointsCrud /></TabsContent>
                <TabsContent value="progress-stages"><ProgressStagesCrud /></TabsContent>
                <TabsContent value="contact-submissions"><ContactSubmissionsCrud /></TabsContent>
                <TabsContent value="faqs"><FaqCrud /></TabsContent>
                <TabsContent value="global-settings"><GlobalSettingsCrud /></TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
