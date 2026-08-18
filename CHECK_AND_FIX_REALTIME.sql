-- ================================================================
-- CHECK IF PRODUCTS EXISTS AND FIX REALTIME
-- ================================================================

-- Check if products table exists
SELECT 'Products table EXISTS with ' || COUNT(*) || ' products!' as status FROM products;

-- Check current realtime publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Remove products from realtime if it exists (clean slate)
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS products;

-- Add products to realtime
ALTER PUBLICATION supabase_realtime ADD TABLE products;

-- Verify it's added
SELECT 'Products table is NOW in realtime publication!' as result
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' AND tablename = 'products';

-- Show all tables in realtime
SELECT tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
