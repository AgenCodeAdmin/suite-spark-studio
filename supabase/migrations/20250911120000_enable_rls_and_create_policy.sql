
-- Enable RLS for the contact_submissions table
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on contact_submissions to avoid conflicts
DROP POLICY IF EXISTS "Allow public insert access" ON public.contact_submissions;

-- Create a new policy to allow public insert access
CREATE POLICY "Allow public insert access"
ON public.contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);
