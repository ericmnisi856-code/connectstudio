-- ================================================================
-- COMPLETE ADMIN ACCESS FIX FOR BOTH USERS
-- ================================================================
-- This script grants FULL admin access to:
-- 1. ericmnisi856@gmail.com
-- 2. accounts@connectstudio.co.za
-- ================================================================

-- Step 1: Ensure user_roles table exists with proper structure
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Step 2: Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;

-- Step 4: Create comprehensive RLS policies
-- Allow users to read their own roles
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Allow admins to read all roles
CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to insert new roles
CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to update roles
CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admins to delete roles
CREATE POLICY "Admins can delete roles"
  ON user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Step 5: Grant admin role to BOTH specified users
-- This uses UPSERT to avoid conflicts if roles already exist

-- User 1: ericmnisi856@gmail.com
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'ericmnisi856@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- User 2: accounts@connectstudio.co.za
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'accounts@connectstudio.co.za'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 6: Create helper function to check admin status
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
$$;

-- Step 7: Create function to auto-assign admin role for super admin emails
CREATE OR REPLACE FUNCTION auto_assign_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  super_admin_emails text[] := ARRAY[
    'ericmnisi856@gmail.com',
    'accounts@connectstudio.co.za'
  ];
BEGIN
  -- Check if the new user's email is in the super admin list
  IF NEW.email = ANY(super_admin_emails) THEN
    -- Insert admin role (ignore if already exists)
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 8: Create trigger to automatically assign admin role on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_admin_role();

-- Step 9: Grant necessary permissions
GRANT ALL ON user_roles TO authenticated;
GRANT ALL ON user_roles TO service_role;

-- Step 10: Verify the setup
DO $$
DECLARE
  user1_count integer;
  user2_count integer;
BEGIN
  -- Check user 1
  SELECT COUNT(*) INTO user1_count
  FROM user_roles ur
  JOIN auth.users u ON ur.user_id = u.id
  WHERE u.email = 'ericmnisi856@gmail.com' AND ur.role = 'admin';
  
  -- Check user 2
  SELECT COUNT(*) INTO user2_count
  FROM user_roles ur
  JOIN auth.users u ON ur.user_id = u.id
  WHERE u.email = 'accounts@connectstudio.co.za' AND ur.role = 'admin';
  
  -- Report results
  RAISE NOTICE 'Admin setup verification:';
  RAISE NOTICE '  ericmnisi856@gmail.com: % admin role(s)', user1_count;
  RAISE NOTICE '  accounts@connectstudio.co.za: % admin role(s)', user2_count;
  
  IF user1_count = 0 THEN
    RAISE WARNING 'User ericmnisi856@gmail.com not found or not yet signed up!';
  END IF;
  
  IF user2_count = 0 THEN
    RAISE WARNING 'User accounts@connectstudio.co.za not found or not yet signed up!';
  END IF;
END $$;

-- ================================================================
-- INSTRUCTIONS TO RUN THIS SCRIPT:
-- ================================================================
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project
-- 3. Click "SQL Editor" in the left sidebar
-- 4. Click "New query"
-- 5. Copy and paste this ENTIRE script
-- 6. Click "Run" or press Ctrl+Enter
-- 7. Check the results panel for verification messages
-- 
-- BOTH USERS MUST SIGN UP/SIGN IN FIRST!
-- If a user hasn't signed up yet, this script will create the
-- infrastructure but won't assign the admin role until they do.
-- The trigger will automatically assign admin role when they sign up.
-- ================================================================

-- ================================================================
-- WHAT THIS SCRIPT DOES:
-- ================================================================
-- ✅ Creates user_roles table if it doesn't exist
-- ✅ Sets up proper Row Level Security (RLS) policies
-- ✅ Grants admin role to BOTH specified email addresses
-- ✅ Creates helper function to check admin status
-- ✅ Creates automatic trigger to assign admin on signup
-- ✅ Grants necessary database permissions
-- ✅ Verifies the setup and reports results
-- ================================================================
