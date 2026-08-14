# 🚀 SUPABASE MIGRATION GUIDE

## New Supabase Project
**Project ID:** `qccwgssqemkfxkgustuh`
**URL:** https://supabase.com/dashboard/project/qccwgssqemkfxkgustuh

---

## 📋 STEP 1: Get Your Supabase Keys

1. **Go to your Supabase project:**
   https://supabase.com/dashboard/project/qccwgssqemkfxkgustuh/settings/api

2. **Copy these keys:**
   - **Project URL:** `https://qccwgssqemkfxkgustuh.supabase.co`
   - **anon/public key:** (starts with `eyJ...`)
   - Copy the ENTIRE key

3. **Update `.env` file:**
   - Open `studio-green-flow-main/.env`
   - Replace `YOUR_NEW_PUBLISHABLE_KEY_HERE` with your anon key
   - Save the file

Example `.env`:
```env
SUPABASE_PROJECT_ID="qccwgssqemkfxkgustuh"
SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_URL="https://qccwgssqemkfxkgustuh.supabase.co"
VITE_SUPABASE_PROJECT_ID="qccwgssqemkfxkgustuh"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://qccwgssqemkfxkgustuh.supabase.co"

# Yoco Payment Gateway Keys (TEST MODE)
YOCO_SECRET_KEY="sk_test_f65fbbd2lVeRkvPc7704c37b6dc8"
VITE_YOCO_PUBLIC_KEY="pk_test_1e07de9cvnz96YN03cb4"
```

---

## 📋 STEP 2: Run Database Migrations

### Option A: SQL Editor (Easiest)

1. **Go to SQL Editor:**
   https://supabase.com/dashboard/project/qccwgssqemkfxkgustuh/sql/new

2. **Create Orders Table:**
   - Click "New query"
   - Copy from `supabase/migrations/20260813000000_create_user_roles_and_admin.sql`
   - Paste and click "RUN"

3. **Create Auto-Admin Trigger:**
   - New query
   - Copy from `AUTO_ADMIN_SETUP.sql`
   - Paste and click "RUN"

### Option B: Supabase CLI (Advanced)

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref qccwgssqemkfxkgustuh

# Push migrations
supabase db push
```

---

## 📋 STEP 3: Set Up Tables

### Create Orders Table

Run this SQL in SQL Editor:

```sql
-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  notes TEXT,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  vat INTEGER NOT NULL,
  shipping INTEGER NOT NULL,
  total INTEGER NOT NULL,
  payment_id TEXT,
  payment_method TEXT DEFAULT 'yoco'
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert orders"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
ON public.orders FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update orders"
ON public.orders FOR UPDATE
TO authenticated
USING (true);

-- Create index for faster queries
CREATE INDEX orders_order_number_idx ON public.orders(order_number);
CREATE INDEX orders_email_idx ON public.orders(email);
CREATE INDEX orders_created_at_idx ON public.orders(created_at DESC);
```

### Create User Roles Table with Auto-Admin

Run this SQL in SQL Editor:

```sql
-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage roles"
ON public.user_roles FOR ALL
TO service_role
USING (true);

-- Create auto-admin function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert admin role for the new user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_roles TO postgres, anon, authenticated, service_role;
```

---

## 📋 STEP 4: Create Admin Users

### In Supabase Dashboard:

1. **Go to Authentication:**
   https://supabase.com/dashboard/project/qccwgssqemkfxkgustuh/auth/users

2. **Click "Add user"**

3. **Create User 1:**
   - Email: `ericmnisi856@gmail.com`
   - Password: `Connectstudio@123`
   - ✅ Check "Auto Confirm User"
   - Click "Create user"

4. **Create User 2:**
   - Email: `accounts@connectstudio.co.za`
   - Password: `Connectstudio@123`
   - ✅ Check "Auto Confirm User"
   - Click "Create user"

**Note:** With the auto-admin trigger, these users will automatically get admin role!

---

## 📋 STEP 5: Restart Dev Server

```bash
# Stop current server (Ctrl+C in terminal)

# Start dev server
npm run dev
```

---

## 📋 STEP 6: Test Everything

### Test Admin Access:
1. Go to http://localhost:8081/auth
2. Sign in with `ericmnisi856@gmail.com` / `Connectstudio@123`
3. Go to http://localhost:8081/admin
4. ✅ You should have access!

### Test Orders:
1. Add items to cart
2. Go to checkout
3. Fill in details
4. Click "Pay with Card"
5. Complete test payment
6. Check admin dashboard for order

---

## 🔍 Verify Migration

### Check Tables Exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Should show:
- orders
- user_roles

### Check Trigger:
```sql
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

Should show:
- on_auth_user_created on auth.users

### Check Admin Users:
```sql
SELECT au.email, ur.role
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id;
```

Should show both emails with 'admin' role.

---

## ✅ Summary

After completing all steps:
- ✅ New Supabase project connected
- ✅ Orders table created with RLS
- ✅ User roles table created
- ✅ Auto-admin trigger active
- ✅ Both admin users created
- ✅ Dev server restarted
- ✅ Ready to use!

---

## 🆘 Troubleshooting

### "relation does not exist" error:
→ Run the SQL scripts in Step 3

### Admin access denied:
→ Make sure trigger is created (Step 3)
→ Check user exists in Authentication
→ Run: `SELECT * FROM user_roles;`

### Orders not saving:
→ Check orders table exists
→ Check RLS policies are created

---

## 📝 Files Reference

- `supabase/migrations/20260813000000_create_user_roles_and_admin.sql` - User roles migration
- `AUTO_ADMIN_SETUP.sql` - Complete auto-admin setup
- `.env` - Environment variables (update with your keys!)

---

**Need help? The hardcoded admin access is still active as a backup!**
