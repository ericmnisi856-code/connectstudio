-- ================================================================
-- UPDATE PRODUCTS TABLE TO MATCH FRONTEND SCHEMA
-- ================================================================

-- Drop old products table
DROP TABLE IF EXISTS products CASCADE;

-- Create products table with correct schema matching Product type
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  model text NOT NULL,
  category text NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  compare_at numeric CHECK (compare_at >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating numeric NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews integer NOT NULL DEFAULT 0 CHECK (reviews >= 0),
  badge text,
  image text,
  highlights jsonb DEFAULT '[]'::jsonb,
  specs jsonb DEFAULT '[]'::jsonb,
  use_cases jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone can read products
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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON products TO authenticated;
GRANT SELECT ON products TO anon;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Verify
SELECT '✅ Products table updated with correct schema!' as result;
