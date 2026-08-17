# 🔍 TROUBLESHOOTING YOUR CURRENT ERROR

## What Error Are You Getting?

Please tell me the EXACT error message you're seeing. Common errors:

### Error 1: "relation 'user_roles' does not exist"
**SOLUTION**: Run `COMPLETE_DATABASE_SETUP.sql` instead of just the products migration
- This file includes BOTH user_roles AND products tables in the correct order
- Location: `COMPLETE_DATABASE_SETUP.sql` in your project root

### Error 2: "Missing Supabase environment variable(s)"
**SOLUTION**: Double-check all environment variables in Netlify
- Go to Netlify Dashboard → Site Settings → Environment Variables
- Make sure you have ALL 9 variables (see `NETLIFY_ENV_VARIABLES.txt`)
- Redeploy after adding variables

### Error 3: "permission denied for table products"
**SOLUTION**: RLS policies need to be created
- Run the `COMPLETE_DATABASE_SETUP.sql` script
- This creates all necessary RLS policies

### Error 4: Products not showing up
**SOLUTION**: Enable realtime replication
1. Supabase Dashboard → Database → Replication
2. Find `products` table
3. Toggle the switch to enable
4. Refresh your shop page

### Error 5: "Admin access required" when signed in
**SOLUTION**: Your user needs admin role
- The `COMPLETE_DATABASE_SETUP.sql` script assigns admin to:
  - ericmnisi856@gmail.com
  - accounts@connectstudio.co.za
- If you're signed in with a different email, you need to add it

---

## Quick Fix: Run This in Supabase SQL Editor

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New query**
4. Open file: `COMPLETE_DATABASE_SETUP.sql`
5. Copy EVERYTHING from that file
6. Paste into SQL Editor
7. Click **Run** (or press Ctrl+Enter)

### What This Does:
✅ Creates `user_roles` table  
✅ Creates `products` table  
✅ Sets up RLS policies for both tables  
✅ Assigns admin role to your two users  
✅ Inserts 6 initial products  
✅ Creates triggers for auto-admin assignment  

---

## After Running the SQL

### Step 1: Enable Realtime
1. In Supabase Dashboard → **Database** → **Replication**
2. Find the **`products`** table
3. Toggle switch to **enable** replication

### Step 2: Test It
1. Sign in to your admin panel at `/admin`
2. Click the **Products** tab
3. Try creating a new product
4. Open `/products` in another browser tab
5. The new product should appear INSTANTLY without refresh

---

## Still Having Issues?

Tell me:
1. What exact error message you see
2. Where you see it (browser console, Supabase, Netlify logs)
3. What step you're on

I'll help you fix it immediately!

---

## Files Reference

- **`COMPLETE_DATABASE_SETUP.sql`** - Run this first! (combines both migrations)
- **`REALTIME_PRODUCTS_SETUP.md`** - Complete setup instructions
- **`NETLIFY_ENV_VARIABLES.txt`** - List of required environment variables
- **`FIX_ADMIN_ACCESS_NOW.sql`** - Standalone admin setup (not needed if you run COMPLETE_DATABASE_SETUP.sql)

