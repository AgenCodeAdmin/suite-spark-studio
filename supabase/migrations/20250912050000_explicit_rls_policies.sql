-- Drop all existing RLS policies for all public tables
DO $$
DECLARE
    tbl_name text;
    policy_name text;
BEGIN
    FOR tbl_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        -- Disable RLS temporarily to drop all policies
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY;', tbl_name);

        FOR policy_name IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl_name
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', policy_name, tbl_name);
        END LOOP;

        -- Re-enable RLS
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl_name);
    END LOOP;
END
$$ LANGUAGE plpgsql;

-- Create helper functions (ensure they are up-to-date)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'editor'));
END;
$$;

-- Explicitly apply RLS policies for each table

-- public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles." ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile." ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can insert new profiles." ON public.profiles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete profiles." ON public.profiles FOR DELETE USING (public.is_admin());

-- public.contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert for contact_submissions" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated read for contact_submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin update for contact_submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for contact_submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.is_editor_or_admin());

-- List all other public content tables and apply policies explicitly
-- (Replace with your actual table names from your schema)
-- You can get this list from your Supabase dashboard -> Database -> Tables -> public schema
-- Or from the previous `information_schema.tables` query.
-- For example:
-- public.about_content
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for about_content" ON public.about_content FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for about_content" ON public.about_content FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for about_content" ON public.about_content FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for about_content" ON public.about_content FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for about_content" ON public.about_content FOR DELETE USING (public.is_editor_or_admin());

-- public.accordion_content
ALTER TABLE public.accordion_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for accordion_content" ON public.accordion_content FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for accordion_content" ON public.accordion_content FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for accordion_content" ON public.accordion_content FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for accordion_content" ON public.accordion_content FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for accordion_content" ON public.accordion_content FOR DELETE USING (public.is_editor_or_admin());

-- public.clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for clients" ON public.clients FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for clients" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for clients" ON public.clients FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for clients" ON public.clients FOR DELETE USING (public.is_editor_or_admin());

-- public.customer_reviews
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for customer_reviews" ON public.customer_reviews FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for customer_reviews" ON public.customer_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for customer_reviews" ON public.customer_reviews FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for customer_reviews" ON public.customer_reviews FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for customer_reviews" ON public.customer_reviews FOR DELETE USING (public.is_editor_or_admin());

-- public.faqs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for faqs" ON public.faqs FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for faqs" ON public.faqs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for faqs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for faqs" ON public.faqs FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for faqs" ON public.faqs FOR DELETE USING (public.is_editor_or_admin());

-- public.footer_content
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for footer_content" ON public.footer_content FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for footer_content" ON public.footer_content FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for footer_content" ON public.footer_content FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for footer_content" ON public.footer_content FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for footer_content" ON public.footer_content FOR DELETE USING (public.is_editor_or_admin());

-- public.hero_content
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for hero_content" ON public.hero_content FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for hero_content" ON public.hero_content FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for hero_content" ON public.hero_content FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for hero_content" ON public.hero_content FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for hero_content" ON public.hero_content FOR DELETE USING (public.is_editor_or_admin());

-- public.logo_carousel
ALTER TABLE public.logo_carousel ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for logo_carousel" ON public.logo_carousel FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for logo_carousel" ON public.logo_carousel FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for logo_carousel" ON public.logo_carousel FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for logo_carousel" ON public.logo_carousel FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for logo_carousel" ON public.logo_carousel FOR DELETE USING (public.is_editor_or_admin());

-- public.pain_points
ALTER TABLE public.pain_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for pain_points" ON public.pain_points FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for pain_points" ON public.pain_points FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for pain_points" ON public.pain_points FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for pain_points" ON public.pain_points FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for pain_points" ON public.pain_points FOR DELETE USING (public.is_editor_or_admin());

-- public.pricing_plans
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for pricing_plans" ON public.pricing_plans FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for pricing_plans" ON public.pricing_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for pricing_plans" ON public.pricing_plans FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for pricing_plans" ON public.pricing_plans FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for pricing_plans" ON public.pricing_plans FOR DELETE USING (public.is_editor_or_admin());

-- public.progress_stages
ALTER TABLE public.progress_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for progress_stages" ON public.progress_stages FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for progress_stages" ON public.progress_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for progress_stages" ON public.progress_stages FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for progress_stages" ON public.progress_stages FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for progress_stages" ON public.progress_stages FOR DELETE USING (public.is_editor_or_admin());

-- public.services
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for services" ON public.services FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for services" ON public.services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for services" ON public.services FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for services" ON public.services FOR DELETE USING (public.is_editor_or_admin());

-- public.submission_service_interests
ALTER TABLE public.submission_service_interests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for submission_service_interests" ON public.submission_service_interests FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for submission_service_interests" ON public.submission_service_interests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for submission_service_interests" ON public.submission_service_interests FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for submission_service_interests" ON public.submission_service_interests FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for submission_service_interests" ON public.submission_service_interests FOR DELETE USING (public.is_editor_or_admin());

-- public.submission_statuses
ALTER TABLE public.submission_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for submission_statuses" ON public.submission_statuses FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for submission_statuses" ON public.submission_statuses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for submission_statuses" ON public.submission_statuses FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for submission_statuses" ON public.submission_statuses FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for submission_statuses" ON public.submission_statuses FOR DELETE USING (public.is_editor_or_admin());

-- public.website_settings
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for website_settings" ON public.website_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for website_settings" ON public.website_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for website_settings" ON public.website_settings FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for website_settings" ON public.website_settings FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for website_settings" ON public.website_settings FOR DELETE USING (public.is_editor_or_admin());

-- public.admin_users (assuming it's a content table for now, if unused, it can be removed later)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read for admin_users" ON public.admin_users FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated read for admin_users" ON public.admin_users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin insert for admin_users" ON public.admin_users FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin update for admin_users" ON public.admin_users FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for admin_users" ON public.admin_users FOR DELETE USING (public.is_editor_or_admin());