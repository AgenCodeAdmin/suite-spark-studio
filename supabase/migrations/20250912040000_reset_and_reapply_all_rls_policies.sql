-- Drop all existing RLS policies for all public tables
DO $$
DECLARE
    tbl_name text;
    policy_name text;
BEGIN
    FOR tbl_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        -- Disable RLS temporarily to drop all policies
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY;', tbl_name);

        FOR policy_name IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = tbl_name
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', policy_name, tbl_name);
        END LOOP;

        -- Re-enable RLS
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl_name);
    END LOOP;
END
$$ LANGUAGE plpgsql;

-- Create helper functions (ensure they are up-to-date)
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

-- Apply RLS policies for public.profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles." ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile." ON public.profiles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can insert new profiles." ON public.profiles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete profiles." ON public.profiles FOR DELETE USING (public.is_admin());

-- Apply RLS policies for public.contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous insert for contact_submissions" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated read for contact_submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow editor_or_admin update for contact_submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());
CREATE POLICY "Allow editor_or_admin delete for contact_submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (public.is_editor_or_admin());

-- Apply RLS policies for all other public content tables
DO $$
DECLARE
    tbl_name text;
BEGIN
    FOR tbl_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name NOT IN ('profiles', 'contact_submissions')
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl_name); -- Ensure RLS is enabled
        EXECUTE format('CREATE POLICY "Allow public read for %I" ON public.%I FOR SELECT TO anon USING (true);', tbl_name, tbl_name);
        EXECUTE format('CREATE POLICY "Allow authenticated read for %I" ON public.%I FOR SELECT TO authenticated USING (true);', tbl_name, tbl_name);
        EXECUTE format('CREATE POLICY "Allow editor_or_admin insert for %I" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_editor_or_admin());', tbl_name, tbl_name);
        EXECUTE format('CREATE POLICY "Allow editor_or_admin update for %I" ON public.%I FOR UPDATE TO authenticated USING (public.is_editor_or_admin()) WITH CHECK (public.is_editor_or_admin());', tbl_name, tbl_name);
        EXECUTE format('CREATE POLICY "Allow editor_or_admin delete for %I" ON public.%I FOR DELETE TO authenticated USING (public.is_editor_or_admin());', tbl_name, tbl_name);
    END LOOP;
END
$$ LANGUAGE plpgsql;
