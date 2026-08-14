# 🔧 FIX ADMIN LOGIN - DO THIS NOW!

## Problem
You're getting "Invalid login credentials" when trying to login as admin.

## Why This Happens
The user account **ericmnisi856@gmail.com** doesn't exist in your Supabase database yet. You need to CREATE it first, then make it an admin.

---

## ✅ SOLUTION (3 Simple Steps)

### STEP 1: Go to Supabase Dashboard
Open this link: **https://supabase.com/dashboard/project/mwbyyojkbtbizcrxeqrf**

(This is YOUR project - the credentials are in your .env file)

---

### STEP 2: Create the User Account
1. In the left sidebar, click **"Authentication"**
2. Click **"Users"** 
3. Click the green **"Add user"** button (top right)
4. Fill in:
   - **Email:** `ericmnisi856@gmail.com`
   - **Password:** `Connectstudio@123`
   - ✅ Check "Auto Confirm User" (so you don't need to verify email)
5. Click **"Create user"**

---

### STEP 3: Make This User an Admin
1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"** button
3. Copy and paste this ENTIRE SQL code:

```sql
-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage roles"
ON public.user_roles FOR ALL
TO service_role
USING (true);

-- Make ericmnisi856@gmail.com an admin
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'ericmnisi856@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Check if it worked
SELECT 
  au.email,
  ur.role,
  ur.created_at
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE au.email = 'ericmnisi856@gmail.com';
```

4. Click **"Run"** (or press Ctrl+Enter)
5. You should see a result showing: `ericmnisi856@gmail.com | admin | (timestamp)`

---

## ✅ TEST IT NOW!

1. Go to your application: **http://localhost:8081/** (or your deployed URL)
2. Click **"Staff login"** in the footer
3. Login with:
   - Email: `ericmnisi856@gmail.com`
   - Password: `Connectstudio@123`
4. After login, go to: **http://localhost:8081/admin**
5. You should now see the admin dashboard! 🎉

---

## 🧪 TEST YOCO PAYMENT

The Yoco payment button is now ENABLED and ready to test:

1. Add items to cart
2. Go to checkout
3. Fill in your details (any test details)
4. Click the **"Pay with Yoco"** button
5. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date (e.g., 12/30)
   - CVV: Any 3 digits (e.g., 123)

---

## 🚨 Still Having Issues?

### "Invalid login credentials"
- Make sure you created the user in Step 2
- Check the password is EXACTLY: `Connectstudio@123` (capital C, capital S, @ symbol)

### "Admin access required"
- Run the SQL in Step 3 again
- Check if the role was added:
```sql
SELECT email, role FROM auth.users 
JOIN user_roles ON auth.users.id = user_roles.user_id
WHERE email = 'ericmnisi856@gmail.com';
```

### Can't access Supabase
- Make sure you're logged into supabase.com
- The project URL is: https://supabase.com/dashboard/project/mwbyyojkbtbizcrxeqrf

---

## ✅ WHAT WAS PUSHED TO GITHUB

Latest commit includes:
- ✅ Yoco payment button FIX (no longer greyed out)
- ✅ Admin setup SQL script
- ✅ All previous fixes

Pull latest changes if deploying:
```bash
git pull origin main
```

---

## 📝 Summary

1. Create user in Supabase Auth Dashboard
2. Run SQL to create user_roles table and make user admin
3. Login and access /admin
4. Test Yoco payment with test card

That's it! 🚀
