-- =====================================================
-- CREATE ADMIN USER - COPY AND RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
-- Go to: https://supabase.com/dashboard/project/mwbyyojkbtbizcrxeqrf/sql/new
-- Paste this ENTIRE script and click RUN
-- =====================================================

-- Step 1: Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 2: Create RLS policies
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

-- Step 3: Check if user exists
DO $$
DECLARE
  user_exists BOOLEAN;
  user_uuid UUID;
BEGIN
  -- Check if user exists
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'ericmnisi856@gmail.com'
  ) INTO user_exists;

  IF NOT user_exists THEN
    RAISE NOTICE 'User does not exist. Creating user account...';
    RAISE NOTICE '⚠️  IMPORTANT: Go to Authentication > Users in Supabase Dashboard';
    RAISE NOTICE '⚠️  Click "Add User" and create:';
    RAISE NOTICE '⚠️  Email: ericmnisi856@gmail.com';
    RAISE NOTICE '⚠️  Password: Connectstudio@123';
    RAISE NOTICE '⚠️  Check "Auto Confirm User"';
    RAISE NOTICE '⚠️  Then run this script again!';
  ELSE
    -- Get user ID
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'ericmnisi856@gmail.com';
    
    -- Assign admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_uuid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE '✅ Admin role assigned to ericmnisi856@gmail.com';
  END IF;
END $$;

-- Step 4: Verify the setup
SELECT 
  au.email,
  au.created_at as user_created,
  ur.role,
  ur.created_at as role_assigned
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE au.email = 'ericmnisi856@gmail.com';

-- Expected result:
-- email: ericmnisi856@gmail.com
-- role: admin
-- If you see NULL for role, the user doesn't exist yet - create it in Auth Dashboard first!
