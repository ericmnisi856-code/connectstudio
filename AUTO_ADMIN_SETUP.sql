-- =====================================================
-- AUTO-ASSIGN ADMIN ROLE TO ALL NEW USERS
-- =====================================================
-- Run this in Supabase SQL Editor to enable automatic admin access
-- https://supabase.com/dashboard/project/mwbyyojkbtbizcrxeqrf/sql/new
-- =====================================================

-- Step 1: Create function to assign admin role automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert admin role for the new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_roles TO postgres, anon, authenticated, service_role;

-- Step 4: Assign admin role to ALL existing users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 5: Verify setup
SELECT 
  au.email,
  au.created_at as user_created,
  ur.role,
  ur.created_at as role_assigned
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
ORDER BY au.created_at DESC;

-- =====================================================
-- ✅ DONE! Now:
-- 1. All existing users have admin role
-- 2. All future signups will automatically get admin role
-- 3. Refresh your browser and access /admin
-- =====================================================

COMMENT ON FUNCTION public.handle_new_user IS 'Automatically assigns admin role to new users';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Auto-assigns admin role on user creation';
