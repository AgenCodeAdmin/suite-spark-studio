
-- Comprehensive RLS Policies

-- Tables for General Rule (Anon Read, Authenticated CRUD)
DO $$
DECLARE
    tbl_name text;
BEGIN
    FOR tbl_name IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name NOT IN ('contact_submissions', 'admin_users')
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow public read access for %I" ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated read access for %I" ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated insert for %I" ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated update for %I" ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated delete for %I" ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow admin to insert %I" ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow admin to update %I" ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('DROP POLICY IF EXISTS "Allow admin full access" ON public.%I;', tbl_name, tbl_name);

        -- Public Read Policy
        EXECUTE format('CREATE POLICY "Allow public read access for %I" ON public.%I FOR SELECT TO anon USING (true);', tbl_name, tbl_name);

        -- Authenticated CRUD Policies
        EXECUTE format('CREATE POLICY "Allow authenticated read access for %I" ON public.%I FOR SELECT TO authenticated USING (true);', tbl_name, tbl_name);
        EXECUTE format('CREATE POLICY "Allow authenticated insert for %I" ON public.%I FOR INSERT TO authenticated WITH CHECK (true);', tbl_name, tbl_name);
        EXECUTE format('CREATE POLICY "Allow authenticated update for %I" ON public.%I FOR UPDATE TO authenticated USING (true) WITH CHECK (true);', tbl_name, tbl_name);
        EXECUTE format('CREATE POLICY "Allow authenticated delete for %I" ON public.%I FOR DELETE TO authenticated USING (true);', tbl_name, tbl_name);
    END LOOP;
END
$$ LANGUAGE plpgsql;

-- Specific Rules for contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
-- Drop all existing policies for contact_submissions to ensure a clean slate
DROP POLICY IF EXISTS "Allow anonymous insert for contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated read for contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow admin to select contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow admin to update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to select all records" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update all records" ON public.contact_submissions;

-- Anonymous can INSERT
CREATE POLICY "Allow anonymous insert for contact_submissions" ON public.contact_submissions FOR INSERT TO anon WITH CHECK (true);

-- Authenticated CRUD Policies
CREATE POLICY "Allow authenticated read for contact_submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert for contact_submissions" ON public.contact_submissions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update for contact_submissions" ON public.contact_submissions FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete for contact_submissions" ON public.contact_submissions FOR DELETE TO authenticated USING (true);
