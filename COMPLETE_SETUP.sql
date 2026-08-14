-- =====================================================
-- COMPLETE DATABASE SETUP FOR NEW SUPABASE PROJECT
-- =====================================================
-- Run this ONCE in your new Supabase SQL Editor:
-- https://supabase.com/dashboard/project/qccwgssqemkfxkgustuh/sql/new
-- =====================================================

-- PART 1: CREATE ORDERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  vat INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL,
  payment_id TEXT,
  payment_method TEXT DEFAULT 'yoco'
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Anyone can insert orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
ON public.orders FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS orders_order_number_idx ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS orders_email_idx ON public.orders(email);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);

-- =====================================================
-- PART 2: CREATE USER ROLES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User roles policies
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage roles"
ON public.user_roles FOR ALL
TO service_role
USING (true);

-- =====================================================
-- PART 3: AUTO-ADMIN TRIGGER
-- =====================================================

-- Function to automatically assign admin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert admin role for every new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PART 4: GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.orders TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_roles TO postgres, anon, authenticated, service_role;

-- =====================================================
-- PART 5: VERIFY SETUP
-- =====================================================

-- Check tables exist
SELECT 'Tables created:' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('orders', 'user_roles');

-- Check trigger exists
SELECT 'Trigger created:' as status;
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' AND trigger_name = 'on_auth_user_created';

-- =====================================================
-- ✅ SETUP COMPLETE!
-- =====================================================
-- 
-- Next steps:
-- 1. Go to Authentication > Users
-- 2. Create users:
--    - ericmnisi856@gmail.com / Connectstudio@123
--    - accounts@connectstudio.co.za / Connectstudio@123
-- 3. They will automatically get admin role!
-- 4. Update .env file with your Supabase keys
-- 5. Restart dev server
-- 6. Test login and admin access!
--
-- =====================================================

COMMENT ON TABLE public.orders IS 'Customer orders with Yoco payment integration';
COMMENT ON TABLE public.user_roles IS 'User roles for admin access control';
COMMENT ON FUNCTION public.handle_new_user IS 'Automatically assigns admin role to new users';
COMMENT ON TRIGGER on_auth_user_created ON auth.users IS 'Auto-assigns admin role on user creation';
