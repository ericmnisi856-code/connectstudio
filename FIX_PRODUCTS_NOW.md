# Fix Products Table Schema - Step by Step

## Problem
The products table in Supabase is missing several columns that the product wizard needs:
- `tagline` - Short product description
- `compare_at` - Original price for discounts
- `rating` - Product rating (0-5)
- `reviews` - Number of reviews
- `badge` - Special badge (e.g., "Best Seller")
- `image` - Product image URL
- `highlights` - Product features list
- `use_cases` - Use case descriptions

## Solution
Run this SQL script in Supabase:

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com](https://supabase.com)
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Update Script
Copy and paste this SQL into the editor:

```sql
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
```

### Step 3: Execute
Click the **Run** button (or press Ctrl+Enter)

### Step 4: Verify
You should see a success message. The table now has all the columns needed for the product wizard.

## After Running the Script
You should now be able to:
1. Navigate to Admin Dashboard → Products tab
2. Click "Add New Product" button
3. Fill out the product wizard
4. Submit and see the product appear in the shop

## Troubleshooting
If you get an error:
- Make sure you're logged in with an admin account
- Check that you have the `admin` role in the `user_roles` table
- Verify the products table exists

## Need Admin Access?
If you're not an admin, run this first:

```sql
-- Check your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Add admin role (replace user_id with your actual ID)
INSERT INTO user_roles (user_id, role)
VALUES ('your-actual-user-id-here', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```
