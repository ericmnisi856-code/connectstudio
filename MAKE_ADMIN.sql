-- =====================================================
-- SETUP ADMIN ACCESS - Studio Connect
-- =====================================================
-- 
-- PRIMARY ADMIN: ericmnisi856@gmail.com
-- This is the ONLY initial admin who can create other admins
--
-- INSTRUCTIONS FOR SUPABASE:
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Copy and run ALL the queries below in order
-- 3. Sign in to the application with ericmnisi856@gmail.com
-- 4. You will have admin access immediately
--
-- =====================================================

-- STEP 1: Create user_roles table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- STEP 2: Create policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  )
);

-- STEP 3: Make ericmnisi856@gmail.com admin
-- This will work only AFTER the user signs in for the first time
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'ericmnisi856@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- STEP 4: Verify admin was created
SELECT 
  au.email,
  ur.role,
  ur.created_at
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'admin';

-- =====================================================
-- If user hasn't signed up yet, you'll need to:
-- 1. Sign up first at /auth
-- 2. Then come back and run STEP 3 again
-- =====================================================
