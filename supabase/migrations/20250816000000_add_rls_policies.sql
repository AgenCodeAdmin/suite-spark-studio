-- Add missing RLS policies for INSERT and UPDATE operations

-- Add policy for about_content table
CREATE POLICY "Allow insert and update for about_content" 
ON public.about_content 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add policies for other content tables to ensure consistency
CREATE POLICY "Allow insert and update for hero_content" 
ON public.hero_content 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow insert and update for services" 
ON public.services 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow insert and update for clients" 
ON public.clients 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow insert and update for pricing_plans" 
ON public.pricing_plans 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow insert and update for customer_reviews" 
ON public.customer_reviews 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow insert and update for footer_content" 
ON public.footer_content 
FOR ALL 
USING (true) 
WITH CHECK (true);