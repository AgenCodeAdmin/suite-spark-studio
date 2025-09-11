
-- Enable RLS and set policies for website_settings
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.website_settings;
CREATE POLICY "Allow public read access" ON public.website_settings FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Allow admin full access" ON public.website_settings;
CREATE POLICY "Allow admin full access" ON public.website_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Enable RLS and set policies for progress_stages
ALTER TABLE public.progress_stages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.progress_stages;
CREATE POLICY "Allow public read access" ON public.progress_stages FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Allow admin full access" ON public.progress_stages;
CREATE POLICY "Allow admin full access" ON public.progress_stages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Enable RLS and set policies for faqs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.faqs;
CREATE POLICY "Allow public read access" ON public.faqs FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Allow admin full access" ON public.faqs;
CREATE POLICY "Allow admin full access" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Enable RLS and set policies for pain_points
ALTER TABLE public.pain_points ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.pain_points;
CREATE POLICY "Allow public read access" ON public.pain_points FOR SELECT TO anon USING (true);
DROP POLICY IF EXISTS "Allow admin full access" ON public.pain_points;
CREATE POLICY "Allow admin full access" ON public.pain_points FOR ALL TO authenticated USING (true) WITH CHECK (true);
