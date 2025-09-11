-- Add public read policies for progress_stages
DROP POLICY IF EXISTS "Allow public read access for progress_stages" ON public.progress_stages;
CREATE POLICY "Allow public read access for progress_stages" ON public.progress_stages FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Allow authenticated read access for progress_stages" ON public.progress_stages;
CREATE POLICY "Allow authenticated read access for progress_stages" ON public.progress_stages FOR SELECT TO authenticated USING (true);

-- Add public read policies for faqs
DROP POLICY IF EXISTS "Allow public read access for faqs" ON public.faqs;
CREATE POLICY "Allow public read access for faqs" ON public.faqs FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Allow authenticated read access for faqs" ON public.faqs;
CREATE POLICY "Allow authenticated read access for faqs" ON public.faqs FOR SELECT TO authenticated USING (true);

-- Add public read policies for website_settings (global_settings)
DROP POLICY IF EXISTS "Allow public read access for website_settings" ON public.website_settings;
CREATE POLICY "Allow public read access for website_settings" ON public.website_settings FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Allow authenticated read access for website_settings" ON public.website_settings;
CREATE POLICY "Allow authenticated read access for website_settings" ON public.website_settings FOR SELECT TO authenticated USING (true);