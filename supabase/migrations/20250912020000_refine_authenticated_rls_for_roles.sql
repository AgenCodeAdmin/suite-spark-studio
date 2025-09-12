-- Create a helper function to check if the current user is an editor or admin.
CREATE OR REPLACE FUNCTION public.is_editor_or_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role = 'admin' OR role = 'editor'));
END;
$$;

-- Re-apply RLS policies for general public tables to refine authenticated user access based on roles.
DO $$
DECLARE
    tbl_name text;
BEGIN
    FOR tbl_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name NOT IN ('contact_submissions', 'admin_users', 'profiles') -- Exclude profiles as it has its own specific RLS
    LOOP
        -- Drop existing authenticated CRUD policies
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated read access for %I" ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated insert for %I" ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated update for %I" ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated delete for %I" ON public.%I;', tbl_name, tbl_name);

        -- New policies based on roles:

        -- All authenticated users (including viewers) can read
        EXECUTE format('CREATE POLICY "Allow all authenticated read for %I" ON public.%I FOR SELECT TO authenticated USING (true);', tbl_name, tbl_name);

        -- Only editors and admins can insert
        EXECUTE format('CREATE POLICY "Allow editor_or_admin insert for %I" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());', tbl_name, tbl_name);

        -- Only editors and admins can update
        EXECUTE format('CREATE POLICY "Allow editor_or_admin update for %I" ON public.%I FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());', tbl_name, tbl_name);

        -- Only editors and admins can delete
        EXECUTE format('CREATE POLICY "Allow editor_or_admin delete for %I" ON public.%I FOR DELETE TO authenticated USING (public.is_editor_or_admin());', tbl_name, tbl_name);
    END LOOP;
END
$$ LANGUAGE plpgsql;

-- Specific Rules for contact_submissions (refine authenticated CRUD based on roles)
-- Drop existing authenticated CRUD policies for contact_submissions
DROP POLICY IF EXISTS "Allow authenticated read for contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated insert for contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated update for contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated delete for contact_submissions" ON public.contact_submissions;

-- All authenticated users can read contact_submissions
CREATE POLICY "Allow all authenticated read for contact_submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (true);

-- Only editors and admins can insert contact_submissions (though anonymous can also insert)
CREATE POLICY "Allow editor_or_admin insert for contact_submissions" ON public.contact_submissions FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());

-- Only editors and admins can update contact_submissions
CREATE POLICY "Allow editor_or_admin update for contact_submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());

-- Only editors and admins can delete contact_submissions
CREATE POLICY "Allow editor_or_admin delete for contact_submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.is_editor_or_admin());
