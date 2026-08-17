-- ================================================================
-- COMPLETE DATABASE SETUP - RUN THIS ONCE IN SUPABASE
-- ================================================================
-- This script sets up EVERYTHING:
-- 1. User roles and admin permissions
-- 2. Products table with real-time updates
-- 3. All necessary RLS policies
-- ================================================================

-- ================================================================
-- PART 1: USER ROLES AND ADMIN SETUP
-- ================================================================

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable Row Level Security for user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON user_roles;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete roles"
  ON user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Grant admin role to super admin emails
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email IN ('ericmnisi856@gmail.com', 'accounts@connectstudio.co.za')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create helper function to check admin status
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

-- Create function to auto-assign admin role for super admin emails
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
  IF NEW.email = ANY(super_admin_emails) THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign admin role on user creation
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_admin_role();

-- Grant permissions for user_roles
GRANT ALL ON user_roles TO authenticated;
GRANT ALL ON user_roles TO service_role;

-- ================================================================
-- PART 2: PRODUCTS TABLE SETUP
-- ================================================================

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  model text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  description text,
  features jsonb DEFAULT '[]'::jsonb,
  specs jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Allow anyone to read products (public shop)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- Only admins can insert products
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update products
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete products
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial products from catalog
INSERT INTO products (slug, name, model, category, price, stock, description, features, specs) VALUES
('rg-eg105gw', 'Ruijie Reyee 5-Port Gigabit Desktop Switch', 'RG-EG105GW', 'switches', 399.00, 25, 'Compact 5-port Gigabit Ethernet switch perfect for small office or home networks.', 
  '["5× Gigabit Ethernet ports","Plug-and-play operation","Fanless silent operation","Desktop compact design"]'::jsonb,
  '{"ports": "5× 10/100/1000 Mbps", "switching_capacity": "10 Gbps", "forwarding_rate": "7.44 Mpps", "power": "5W max", "dimensions": "180×101×26 mm"}'::jsonb),
  
('rg-eg108gw', 'Ruijie Reyee 8-Port Gigabit Desktop Switch', 'RG-EG108GW', 'switches', 599.00, 30, 'Reliable 8-port Gigabit switch with advanced energy-saving features.', 
  '["8× Gigabit Ethernet ports","Energy-efficient design","Plug-and-play setup","Silent fanless cooling"]'::jsonb,
  '{"ports": "8× 10/100/1000 Mbps", "switching_capacity": "16 Gbps", "forwarding_rate": "11.9 Mpps", "power": "6W max", "dimensions": "235×101×26 mm"}'::jsonb),
  
('rg-eg310gh-p', 'Ruijie Reyee 8-Port PoE+ Gigabit Switch', 'RG-EG310GH-P', 'switches', 2499.00, 15, 'Smart PoE+ switch with 8 Gigabit ports and 2 SFP uplinks.', 
  '["8× Gigabit PoE+ ports","2× Gigabit SFP uplinks","120W PoE budget","Cloud management","VLAN support"]'::jsonb,
  '{"ports": "8× 10/100/1000 Mbps PoE+, 2× SFP", "poe_budget": "120W", "switching_capacity": "20 Gbps", "forwarding_rate": "14.88 Mpps", "power": "150W max", "dimensions": "294×180×44 mm"}'::jsonb),
  
('rg-ew1200g-pro', 'Ruijie Reyee Dual-Band Wi-Fi 6 Access Point', 'RG-EW1200G PRO', 'access-points', 1299.00, 40, 'Enterprise-grade Wi-Fi 6 access point with dual-band support.', 
  '["Wi-Fi 6 (802.11ax)","Dual-band (2.4 GHz + 5 GHz)","MU-MIMO support","Cloud management","PoE powered"]'::jsonb,
  '{"wireless_standard": "802.11ax/ac/n/g/b/a", "max_speed": "1.775 Gbps", "concurrent_users": "128", "coverage": "100m radius", "power": "802.3af PoE", "dimensions": "Ø200×36 mm"}'::jsonb),
  
('rg-eg210g-p', 'Ruijie Reyee 8-Port Gigabit PoE Switch', 'RG-EG210G-P', 'switches', 1899.00, 20, '8-port smart PoE switch with 2 SFP uplinks and cloud management.', 
  '["8× Gigabit PoE ports","2× Gigabit SFP uplinks","65W PoE budget","Cloud-managed","Fanless design"]'::jsonb,
  '{"ports": "8× 10/100/1000 Mbps PoE, 2× SFP", "poe_budget": "65W", "switching_capacity": "20 Gbps", "forwarding_rate": "14.88 Mpps", "power": "75W max", "dimensions": "294×180×44 mm"}'::jsonb),
  
('rg-eg105g-pro', 'Ruijie Reyee 5-Port Gigabit Desktop Switch Pro', 'RG-EG105G PRO', 'switches', 549.00, 35, 'Enhanced 5-port Gigabit switch with metal housing.', 
  '["5× Gigabit Ethernet ports","Metal housing","Energy-efficient","Plug-and-play","Fanless operation"]'::jsonb,
  '{"ports": "5× 10/100/1000 Mbps", "switching_capacity": "10 Gbps", "forwarding_rate": "7.44 Mpps", "power": "5W max", "dimensions": "180×101×26 mm"}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Grant permissions for products
GRANT ALL ON products TO authenticated;
GRANT SELECT ON products TO anon;

-- Enable realtime for products table
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- ================================================================
-- VERIFICATION
-- ================================================================

DO $$
DECLARE
  user1_count integer;
  user2_count integer;
  product_count integer;
BEGIN
  -- Check admin users
  SELECT COUNT(*) INTO user1_count
  FROM user_roles ur
  JOIN auth.users u ON ur.user_id = u.id
  WHERE u.email = 'ericmnisi856@gmail.com' AND ur.role = 'admin';
  
  SELECT COUNT(*) INTO user2_count
  FROM user_roles ur
  JOIN auth.users u ON ur.user_id = u.id
  WHERE u.email = 'accounts@connectstudio.co.za' AND ur.role = 'admin';
  
  -- Check products
  SELECT COUNT(*) INTO product_count FROM products;
  
  -- Report results
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE 'DATABASE SETUP COMPLETE!';
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE 'Admin Users:';
  RAISE NOTICE '  ericmnisi856@gmail.com: % admin role(s)', user1_count;
  RAISE NOTICE '  accounts@connectstudio.co.za: % admin role(s)', user2_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Products: % products inserted', product_count;
  RAISE NOTICE '════════════════════════════════════════';
  
  IF user1_count = 0 THEN
    RAISE WARNING 'User ericmnisi856@gmail.com not found - will be auto-assigned admin on signup';
  END IF;
  
  IF user2_count = 0 THEN
    RAISE WARNING 'User accounts@connectstudio.co.za not found - will be auto-assigned admin on signup';
  END IF;
END $$;

-- ================================================================
-- SUCCESS! 
-- ================================================================
-- Next steps:
-- 1. Go to Database → Replication in Supabase Dashboard
-- 2. Enable replication for 'products' table
-- 3. Sign in with admin accounts and test!
-- ================================================================
