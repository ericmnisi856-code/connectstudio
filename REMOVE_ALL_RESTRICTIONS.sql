-- ================================================================
-- REMOVE ALL RESTRICTIONS - ALLOW ANYONE TO ADD PRODUCTS
-- ================================================================
-- Run this in your Supabase SQL Editor to remove all restrictions
-- ================================================================

-- Step 1: Drop all existing restrictive policies
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Anyone can view products" ON products;

-- Step 2: Create open policies that allow ANYONE to do ANYTHING
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);

-- Step 3: Grant full permissions to anonymous users
GRANT ALL ON products TO anon;
GRANT ALL ON products TO authenticated;

-- ================================================================
-- DONE! Now ANYONE can add/edit/delete products
-- No authentication required!
-- ================================================================

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'products'
ORDER BY policyname;
