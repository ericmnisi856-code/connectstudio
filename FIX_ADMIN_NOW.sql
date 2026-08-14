-- =====================================================
-- GRANT ADMIN ACCESS - RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
-- Go to: https://supabase.com/dashboard/project/mwbyyojkbtbizcrxeqrf/sql/new
-- Copy and paste this ENTIRE script, then click RUN
-- =====================================================

-- Step 1: Temporarily allow authenticated users to insert their own roles
-- (This is just for initial setup)
DROP POLICY IF EXISTS "Allow users to set own initial role" ON public.user_roles;
CREATE POLICY "Allow users to set own initial role"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Step 2: Insert admin role for ericmnisi275@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('6419cdfa-1d14-4b9b-81f6-5f722949761e', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Remove the temporary policy (security best practice)
DROP POLICY IF EXISTS "Allow users to set own initial role" ON public.user_roles;

-- Step 4: Verify the admin role was assigned
SELECT 
  au.email,
  au.id as user_id,
  ur.role,
  ur.created_at as role_assigned_at
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE au.email = 'ericmnisi275@gmail.com';

-- Expected result:
-- email: ericmnisi275@gmail.com
-- user_id: 6419cdfa-1d14-4b9b-81f6-5f722949761e
-- role: admin
-- role_assigned_at: (current timestamp)

-- =====================================================
-- ✅ DONE! Now you can:
-- 1. Refresh your admin page: http://localhost:8081/admin
-- 2. You should now have access!
-- =====================================================
