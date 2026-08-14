-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow service role to manage all roles
CREATE POLICY "Service role can manage roles"
ON public.user_roles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Function to check if user has role
CREATE OR REPLACE FUNCTION public.has_role(check_user_id UUID, check_role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = check_user_id
    AND role = check_role::text
  );
END;
$$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Insert admin role for the first authenticated user (UPDATE THIS WITH YOUR USER ID)
-- To get your user ID, sign in and run: SELECT auth.uid();
-- Then update this query with your actual user_id

-- Example: INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR-USER-ID-HERE', 'admin');

COMMENT ON TABLE public.user_roles IS 'Stores user roles for authorization';
COMMENT ON FUNCTION public.has_role IS 'Check if a user has a specific role';
