-- ========================================
-- COPY THIS ENTIRE SCRIPT AND RUN IT IN SUPABASE NOW
-- ========================================
-- Go to: https://supabase.com
-- Select your project
-- Click: SQL Editor (left sidebar)
-- Paste this entire script
-- Click: Run (or press Ctrl+Enter)
-- ========================================

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

-- Verify it worked
SELECT column_name FROM information_schema.columns WHERE table_name = 'products' ORDER BY ordinal_position;
