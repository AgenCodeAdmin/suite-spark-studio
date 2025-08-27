p-- Create tables for dynamic website content

-- Hero section content
CREATE TABLE public.hero_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  background_image_url TEXT,
  cta_text TEXT DEFAULT 'Get Started Now',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- About section content
CREATE TABLE public.about_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Services section
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Clients section
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Pricing plans
CREATE TABLE public.pricing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Customer reviews
CREATE TABLE public.customer_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  company_name TEXT NOT NULL,
  review_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Footer content
CREATE TABLE public.footer_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_address TEXT NOT NULL,
  links JSONB DEFAULT '[]',
  social_media JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin users for authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for all tables
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (landing page content)
CREATE POLICY "Allow public read access to hero content" ON public.hero_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access to about content" ON public.about_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access to services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow public read access to clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public read access to pricing plans" ON public.pricing_plans FOR SELECT USING (true);
CREATE POLICY "Allow public read access to customer reviews" ON public.customer_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public read access to footer content" ON public.footer_content FOR SELECT USING (true);

-- Admin users can only read their own data for authentication
CREATE POLICY "Allow public read access to admin users for auth" ON public.admin_users FOR SELECT USING (true);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON public.hero_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON public.about_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_customer_reviews_updated_at BEFORE UPDATE ON public.customer_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_footer_content_updated_at BEFORE UPDATE ON public.footer_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.hero_content (headline, subheadline, background_image_url) VALUES 
('Transform Your Business with Digital Excellence', 'Comprehensive digital solutions for modern businesses - from social media management to custom software development', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80');

INSERT INTO public.about_content (title, description, image_url) VALUES 
('About Our Digital Suite', 'We are a leading digital suite provider specializing in Social Media Management, Custom Internal Software Development, and Business Analytics. Our mission is to empower businesses of all sizes with cutting-edge digital solutions that drive growth and efficiency.', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80');

INSERT INTO public.services (title, description, image_url, order_index) VALUES 
('Social Media Management', 'Comprehensive social media strategy, content creation, and community management to boost your online presence.', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1339&q=80', 1),
('Custom Software Development', 'Tailored internal software solutions designed to streamline your business operations and increase productivity.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 2),
('Business Analytics', 'Data-driven insights and comprehensive analytics to help you make informed business decisions and optimize performance.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', 3);

INSERT INTO public.clients (name, logo_url, description, order_index) VALUES 
('TechCorp Solutions', 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 'Leading technology company that transformed their digital presence with our comprehensive social media strategy.', 1),
('Global Dynamics', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 'International corporation that streamlined operations with our custom software development services.', 2),
('InnovateFirst', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 'Startup that scaled efficiently using our business analytics and data-driven insights.', 3),
('Enterprise Plus', 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 'Large enterprise that optimized their entire digital ecosystem with our integrated solutions.', 4);

INSERT INTO public.pricing_plans (name, price, features, is_featured, order_index) VALUES 
('Starter Plan', '$499/mo', ARRAY['Social Media Management', 'Basic Analytics Dashboard', 'Monthly Reports', 'Email Support'], false, 1),
('Gold Plan', '$999/mo', ARRAY['Everything in Starter', 'Custom Software Module', 'Advanced Analytics', 'Weekly Strategy Calls', 'Priority Support'], true, 2),
('Diamond Plan', '$1,999/mo', ARRAY['Everything in Gold', 'Full Custom Software Suite', 'Real-time Analytics', 'Dedicated Account Manager', '24/7 Support', 'Monthly Strategy Review'], false, 3);

INSERT INTO public.customer_reviews (customer_name, designation, company_name, review_text, order_index) VALUES 
('Sarah Johnson', 'CEO', 'TechCorp Solutions', 'The digital transformation we experienced with this team was incredible. Our social media engagement increased by 300% and the custom software solution streamlined our entire workflow.', 1),
('Michael Chen', 'CTO', 'Global Dynamics', 'Their technical expertise and business analytics insights helped us identify key growth opportunities. The ROI on our investment was evident within the first quarter.', 2),
('Emma Rodriguez', 'Marketing Director', 'InnovateFirst', 'Professional, reliable, and results-driven. The comprehensive approach to digital solutions made all the difference for our growing business.', 3);

INSERT INTO public.footer_content (company_name, company_address, links, social_media) VALUES 
('Digital Suite Pro', '123 Innovation Drive, Tech City, TC 12345', 
'[{"text": "Privacy Policy", "url": "#privacy"}, {"text": "Terms of Service", "url": "#terms"}, {"text": "Support", "url": "#support"}]',
'{"instagram": "https://instagram.com/digitalsuitepro", "facebook": "https://facebook.com/digitalsuitepro", "whatsapp": "https://wa.me/1234567890"}');

INSERT INTO public.admin_users (username, password_hash) VALUES 
('admin', '$2b$10$rOdwkTGJc9QJvxP.xbx3e.QX9QXkZ5.1nZjZQ5Qr.KJj9Z5Q0ZjJ2'); -- password: admin123