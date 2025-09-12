-- Create the user_roles ENUM type
CREATE TYPE public.user_roles AS ENUM ('admin', 'editor', 'viewer');

-- Create the profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL, -- Added email column for easier lookup
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role public.user_roles DEFAULT 'viewer' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view their own profile
CREATE POLICY "Users can view their own profile." ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Policy for authenticated users to update their own profile
CREATE POLICY "Users can update their own profile." ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles." ON public.profiles
FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to insert new profiles (e.g., when inviting new users)
CREATE POLICY "Admins can insert new profiles." ON public.profiles
FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to update any profile (e.g., changing roles)
CREATE POLICY "Admins can update any profile." ON public.profiles
FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Policy for admins to delete profiles
CREATE POLICY "Admins can delete profiles." ON public.profiles
FOR DELETE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create a function to set the updated_at column automatically
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the updated_at column on profiles table
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at_timestamp();

-- Trigger to automatically create a profile for new users, including their email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
