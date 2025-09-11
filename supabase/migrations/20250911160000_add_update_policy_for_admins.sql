
-- Create a new policy to allow authenticated users to update all records
CREATE POLICY "Allow authenticated users to update all records"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
