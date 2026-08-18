-- ================================================================
-- CREATE PRODUCTS TABLE ONLY
-- Run this in Supabase SQL Editor
-- ================================================================

-- Drop products table if it exists (clean slate)
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
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

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow ANYONE to read products (public shop)
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

-- Create indexes
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_slug_idx ON products(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial products
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
  '{"ports": "5× 10/100/1000 Mbps", "switching_capacity": "10 Gbps", "forwarding_rate": "7.44 Mpps", "power": "5W max", "dimensions": "180×101×26 mm"}'::jsonb);

-- Grant permissions
GRANT ALL ON products TO authenticated;
GRANT SELECT ON products TO anon;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Verify
SELECT 'Products table created with ' || COUNT(*) || ' products!' as result FROM products;
