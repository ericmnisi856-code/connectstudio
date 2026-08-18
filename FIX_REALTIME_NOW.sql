-- ================================================================
-- FIX REALTIME FOR PRODUCTS TABLE
-- ================================================================

-- Check if products table exists
SELECT 'Products table has ' || COUNT(*) || ' products' as status FROM products;

-- Add products to realtime publication
-- (This command is safe to run even if products is already in the publication)
DO $$
BEGIN
  -- Try to add products to realtime
  ALTER PUBLICATION supabase_realtime ADD TABLE products;
  RAISE NOTICE 'Products added to realtime!';
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Products already in realtime - all good!';
  WHEN OTHERS THEN
    RAISE NOTICE 'Error: %', SQLERRM;
END $$;

-- Verify products is in realtime publication
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Products table IS in realtime publication!'
    ELSE '❌ Products table NOT in realtime publication'
  END as realtime_status
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' AND tablename = 'products';

-- Show all tables currently in realtime
SELECT '📋 Tables in realtime: ' || string_agg(tablename, ', ') as tables
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
