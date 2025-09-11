
-- Refine RLS for progress_stages
DROP POLICY IF EXISTS "Allow admin to insert progress_stages" ON public.progress_stages;
DROP POLICY IF EXISTS "Allow admin to update progress_stages" ON public.progress_stages;
DROP POLICY IF EXISTS "Allow admin full access" ON public.progress_stages;

CREATE POLICY "Allow authenticated insert for progress_stages" ON public.progress_stages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update for progress_stages" ON public.progress_stages FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete for progress_stages" ON public.progress_stages FOR DELETE TO authenticated USING (true);

-- Refine RLS for faqs
DROP POLICY IF EXISTS "Allow admin to insert faqs" ON public.faqs;
DROP POLICY IF EXISTS "Allow admin to update faqs" ON public.faqs;
DROP POLICY IF EXISTS "Allow admin full access" ON public.faqs;

CREATE POLICY "Allow authenticated insert for faqs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update for faqs" ON public.faqs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete for faqs" ON public.faqs FOR DELETE TO authenticated USING (true);

-- Refine RLS for website_settings
DROP POLICY IF EXISTS "Allow admin to insert website_settings" ON public.website_settings;
DROP POLICY IF EXISTS "Allow admin to update website_settings" ON public.website_settings;
DROP POLICY IF EXISTS "Allow admin full access" ON public.website_settings;

CREATE POLICY "Allow authenticated insert for website_settings" ON public.website_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update for website_settings" ON public.website_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete for website_settings" ON public.website_settings FOR DELETE TO authenticated USING (true);
