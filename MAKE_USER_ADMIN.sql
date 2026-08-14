-- =====================================================
-- MAKE ericmnisi275@gmail.com ADMIN
-- =====================================================
-- Copy this SQL and run it in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mwbyyojkbtbizcrxeqrf/sql/new
-- =====================================================

-- Assign admin role to user
INSERT INTO public.user_roles (user_id, role)
VALUES ('6419cdfa-1d14-4b9b-81f6-5f722949761e', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify it worked
SELECT 
  au.email,
  ur.role,
  ur.created_at
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE au.email = 'ericmnisi275@gmail.com';

-- You should see: ericmnisi275@gmail.com | admin | (timestamp)
