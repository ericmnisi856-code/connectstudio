-- =====================================================
-- MAKE SUPER ADMINS - RUN THIS NOW!
-- =====================================================
-- Go to: https://supabase.com/dashboard/project/mwbyyojkbtbizcrxeqrf/sql/new
-- Copy and paste this ENTIRE script, then click RUN
-- =====================================================

-- Step 1: Create the users if they don't exist (via Supabase Dashboard first)
-- You MUST create these users in Authentication > Users first:
-- 1. ericmnisi856@gmail.com / Connectstudio@123
-- 2. accounts@connectstudio.co.za / Connectstudio@123

-- Step 2: Make sure user_roles table exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage roles"
ON public.user_roles FOR ALL
TO service_role
USING (true);

-- Step 4: Assign admin role to BOTH users by their user IDs
-- User IDs obtained from user creation
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('762b5dd6-6111-408d-84aa-d1a9c6228f89', 'admin'),  -- ericmnisi856@gmail.com
  ('3c58237d-02c0-4986-9624-2c86500f46e1', 'admin')   -- accounts@connectstudio.co.za
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 5: Verify both users have admin role
SELECT 
  au.email,
  au.created_at as user_created,
  ur.role,
  ur.created_at as role_assigned
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE au.email IN ('ericmnisi856@gmail.com', 'accounts@connectstudio.co.za')
ORDER BY au.email;

-- =====================================================
-- ✅ Expected Result:
-- Two rows showing:
-- 1. ericmnisi856@gmail.com | admin | (timestamp)
-- 2. accounts@connectstudio.co.za | admin | (timestamp)
-- 
-- If you see NULL for role, the user doesn't exist yet.
-- Create them in: Authentication > Users > Add user
-- Then run this script again!
-- =====================================================

COMMENT ON TABLE public.user_roles IS 'Super admin users with full permissions';
