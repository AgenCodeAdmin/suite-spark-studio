
-- Create a new policy to allow authenticated users to select all records
CREATE POLICY "Allow authenticated users to select all records"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);
