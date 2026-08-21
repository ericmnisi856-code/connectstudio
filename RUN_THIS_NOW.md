# 🚀 QUICK FIX - Run This SQL NOW!

## Copy this entire block and paste into Supabase SQL Editor:

```sql
-- REMOVE ALL RESTRICTIONS
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Anyone can view products" ON products;

CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);
CREATE POLICY "Anyone can insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete products" ON products FOR DELETE USING (true);

GRANT ALL ON products TO anon;
GRANT ALL ON products TO authenticated;
```

## How to Run:
1. Open Supabase Dashboard → SQL Editor
2. Paste the code above
3. Click RUN (or press Ctrl+Enter)
4. Done! Anyone can now add products

## ⚠️ Warning
This removes ALL security. Anyone can add/edit/delete products without logging in.

## 📖 More Info
See `OPEN_PRODUCT_CREATION.md` for full details and rollback instructions.
