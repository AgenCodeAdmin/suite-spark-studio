-- Drop the overly permissive SELECT policy for authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to select all records" ON public.contact_submissions;

-- Drop the overly permissive UPDATE policy for authenticated users
DROP POLICY IF EXISTS "Allow authenticated users to update all records" ON public.contact_submissions;

-- Allow admin to SELECT all contact submissions
CREATE POLICY "Allow admin to select contact submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');

-- Allow admin to UPDATE all contact submissions
CREATE POLICY "Allow admin to update contact submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true')
WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'is_admin' = 'true');