-- Create a helper function to check if the current user is an admin.
-- This function is SECURITY DEFINER to bypass RLS on the profiles table when called within RLS policies.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$;

-- Recreate RLS policies for the profiles table to use the is_admin() function and avoid recursion.

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert new profiles." ON public.profiles;
DROP POLICY IF EXISTS "Admins can delete profiles." ON public.profiles;

-- Policy for authenticated users to view their own profile.
CREATE POLICY "Users can view their own profile." ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Policy for admins to view all profiles.
CREATE POLICY "Admins can view all profiles." ON public.profiles
FOR SELECT USING (public.is_admin());

-- Policy for authenticated users to update their own profile.
CREATE POLICY "Users can update their own profile." ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Policy for admins to update any profile.
CREATE POLICY "Admins can update any profile." ON public.profiles
FOR UPDATE USING (public.is_admin());

-- Policy for admins to insert new profiles.
CREATE POLICY "Admins can insert new profiles." ON public.profiles
FOR INSERT WITH CHECK (public.is_admin());

-- Policy for admins to delete profiles.
CREATE POLICY "Admins can delete profiles." ON public.profiles
FOR DELETE USING (public.is_admin());