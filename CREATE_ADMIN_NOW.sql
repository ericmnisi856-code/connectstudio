-- =====================================================
-- IMMEDIATE ADMIN FIX - RUN THIS IN SUPABASE NOW!
-- =====================================================

-- Step 1: Create the user in Supabase Auth (if not exists)
-- Go to Supabase Dashboard > Authentication > Users
-- Click "Invite User" or "Add User"
-- Email: ericmnisi856@gmail.com
-- Password: Connectstudio@123
-- Then come back and run steps below

-- Step 2: Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON public.user_roles;

-- Step 4: Create new policies
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage roles"
ON public.user_roles FOR ALL
TO service_role
USING (true);

-- Step 5: Make ericmnisi856@gmail.com admin RIGHT NOW
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'ericmnisi856@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 6: Verify it worked
SELECT 
  au.email,
  ur.role,
  ur.created_at as role_created
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE au.email = 'ericmnisi856@gmail.com';

-- You should see: ericmnisi856@gmail.com | admin | (timestamp)
