-- ================================================================
-- UPDATE PRODUCTS TABLE SCHEMA
-- Run this in Supabase SQL Editor to add missing fields
-- ================================================================

-- Add missing columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tagline text,
ADD COLUMN IF NOT EXISTS compare_at numeric CHECK (compare_at >= 0),
ADD COLUMN IF NOT EXISTS rating numeric DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
ADD COLUMN IF NOT EXISTS reviews integer DEFAULT 0 CHECK (reviews >= 0),
ADD COLUMN IF NOT EXISTS badge text,
ADD COLUMN IF NOT EXISTS image text,
ADD COLUMN IF NOT EXISTS highlights jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS use_cases jsonb DEFAULT '[]'::jsonb;

-- Update the updated_at trigger (already exists but let's make sure)
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Update the RLS policy to include the new columns
-- The existing policy should work, but let's verify
DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Test the new schema with a sample product
INSERT INTO products (slug, name, model, category, price, stock, description, tagline, compare_at, rating, reviews, badge, image, highlights, use_cases, specs)
VALUES (
  'test-product-001',
  'Test Product',
  'TP-001',
  'eg',
  1999.00,
  10,
  'This is a test product description to verify the new schema works correctly.',
  'The ultimate network solution for small businesses',
  2499.00,
  4.8,
  12,
  'Best Seller',
  '/images/logo.png',
  '["High performance", "Cloud managed", "Easy installation"]'::jsonb,
  '["Small office", "Retail store", "Warehouse"]'::jsonb,
  '{"brand": "Ruijie", "model": "TP-001", "weight": "1.5kg"}'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- Show current products structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Show inserted products
SELECT id, name, model, category, price, stock FROM products ORDER BY created_at DESC LIMIT 5;
-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS products_tagline_idx ON products USING gin (to_tsvector('simple', tagline));
CREATE INDEX IF NOT EXISTS products_badge_idx ON products(badge);
CREATE INDEX IF NOT EXISTS products_category_tagline_idx ON products(category, tagline);
