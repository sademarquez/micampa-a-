
-- 1. Create an ENUM type for user roles to ensure data consistency.
CREATE TYPE public.user_role AS ENUM ('master', 'candidato', 'votante');

-- 2. Create the profiles table to store user-specific data.
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  role user_role DEFAULT 'votante' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- Foreign key to track who created the user, nullable because master user is created by system
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Add comments to explain the table and columns
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';
COMMENT ON COLUMN public.profiles.id IS 'References auth.users.id, the unique identifier from the authentication system.';
COMMENT ON COLUMN public.profiles.name IS 'The full name of the user.';
COMMENT ON COLUMN public.profiles.role IS 'The role of the user within the application (master, candidato, or votante).';
COMMENT ON COLUMN public.profiles.created_by IS 'The user who created this profile. Used for tracking hierarchy.';

-- 3. Enable Row Level Security (RLS) on the profiles table.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for the profiles table.
-- Users can see all profiles. This is needed for user management and messaging.
CREATE POLICY "Allow authenticated users to read all profiles"
  ON public.profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Users can update their own profile.
CREATE POLICY "Allow users to update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Create a function to handle new user sign-ups.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    'votante' -- New users default to 'votante'
  );
  RETURN new;
END;
$$;

-- 6. Create a trigger to call the function when a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger to update 'updated_at' on profile modification
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
