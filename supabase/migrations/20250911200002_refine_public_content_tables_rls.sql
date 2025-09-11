-- hero_content
DROP POLICY IF EXISTS "Allow insert and update for hero_content" ON public.hero_content;
CREATE POLICY "Allow admin to insert hero_content" ON public.hero_content FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update hero_content" ON public.hero_content FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- about_content
DROP POLICY IF EXISTS "Allow insert and update for about_content" ON public.about_content;
CREATE POLICY "Allow admin to insert about_content" ON public.about_content FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update about_content" ON public.about_content FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- services
DROP POLICY IF EXISTS "Allow insert and update for services" ON public.services;
CREATE POLICY "Allow admin to insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update services" ON public.services FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- clients
DROP POLICY IF EXISTS "Allow insert and update for clients" ON public.clients;
CREATE POLICY "Allow admin to insert clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update clients" ON public.clients FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- pricing_plans
DROP POLICY IF EXISTS "Allow insert and update for pricing_plans" ON public.pricing_plans;
CREATE POLICY "Allow admin to insert pricing_plans" ON public.pricing_plans FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update pricing_plans" ON public.pricing_plans FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- customer_reviews
DROP POLICY IF EXISTS "Allow insert and update for customer_reviews" ON public.customer_reviews;
CREATE POLICY "Allow admin to insert customer_reviews" ON public.customer_reviews FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update customer_reviews" ON public.customer_reviews FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- footer_content
DROP POLICY IF EXISTS "Allow insert and update for footer_content" ON public.footer_content;
CREATE POLICY "Allow admin to insert footer_content" ON public.footer_content FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update footer_content" ON public.footer_content FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- logo_carousel
DROP POLICY IF EXISTS "Allow admin access to logo_carousel" ON public.logo_carousel;
CREATE POLICY "Allow admin to insert logo_carousel" ON public.logo_carousel FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update logo_carousel" ON public.logo_carousel FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- pain_points
DROP POLICY IF EXISTS "Allow admin access to pain_points" ON public.pain_points;
CREATE POLICY "Allow admin to insert pain_points" ON public.pain_points FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update pain_points" ON public.pain_points FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- progress_stages
DROP POLICY IF EXISTS "Allow admin full access" ON public.progress_stages;
CREATE POLICY "Allow admin to insert progress_stages" ON public.progress_stages FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update progress_stages" ON public.progress_stages FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- faqs
DROP POLICY IF EXISTS "Allow admin full access" ON public.faqs;
CREATE POLICY "Allow admin to insert faqs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update faqs" ON public.faqs FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- website_settings
DROP POLICY IF EXISTS "Allow admin full access" ON public.website_settings;
CREATE POLICY "Allow admin to insert website_settings" ON public.website_settings FOR INSERT TO authenticated WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');
CREATE POLICY "Allow admin to update website_settings" ON public.website_settings FOR UPDATE TO authenticated USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true') WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');