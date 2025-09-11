-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow public read access to admin users for auth" ON public.admin_users;

-- Add a policy that allows no one to select from admin_users directly,
-- as this table should only be accessed by the authentication system or secure backend functions.
-- If there's a specific need for admins to view other admins, a more granular policy
-- based on user roles/claims would be needed, but for now, restricting all direct access is safest.
CREATE POLICY "Restrict all direct access to admin_users"
ON public.admin_users
FOR ALL
TO public
USING (false)
WITH CHECK (false);