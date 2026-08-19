-- TEST: Add a new product directly to verify schema works
-- Run this in Supabase SQL Editor to test

INSERT INTO products (
  slug, name, model, category, tagline, description, 
  price, stock, rating, reviews, 
  highlights, specs, use_cases
) VALUES (
  'test-product-123',
  'Test Router XYZ',
  'TEST-XYZ-001',
  'wireless',
  'A test router for debugging purposes',
  'This is a test product created to verify the database schema and API functionality.',
  1299.00,
  50,
  4.5,
  25,
  '["Easy setup", "Fast wireless", "Reliable connection"]'::jsonb,
  '[{"label": "Speed", "value": "AC1200"}, {"label": "Range", "value": "100m"}]'::jsonb,
  '["Home office", "Small business"]'::jsonb
);

-- Verify the product was inserted
SELECT * FROM products WHERE slug = 'test-product-123';

-- Check if you can see this product from the frontend
-- Go to your admin panel products tab and look for "Test Router XYZ"