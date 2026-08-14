# Admin Access Setup Guide

## Problem
Getting "Admin access required" error when trying to access `/admin` dashboard.

## Solution
You need to add the admin role to your user account in the Supabase database.

---

## Quick Fix (5 minutes)

### Step 1: Sign In First
1. Go to your application
2. Click "Staff login" in the footer
3. Sign in with your account (or create one if you haven't)

### Step 2: Run Database Migration
```bash
# In your terminal, from the project root:
cd studio-green-flow-main

# Run the migration (this creates the user_roles table)
npx supabase db push
```

### Step 3: Get Your User ID
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click "SQL Editor" in the left menu
4. Click "New Query"
5. Paste and run this:
```sql
SELECT id as user_id, email FROM auth.users ORDER BY created_at DESC;
```
6. Copy your `user_id` (it looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 4: Make Yourself Admin
In the same SQL Editor, run this (replace `YOUR-USER-ID-HERE` with your actual user_id):

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR-USER-ID-HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Step 5: Verify It Worked
```sql
SELECT ur.role, au.email 
FROM public.user_roles ur
JOIN auth.users au ON ur.user_id = au.id
WHERE ur.role = 'admin';
```

You should see your email with role = 'admin'

### Step 6: Refresh Admin Page
1. Go back to your application
2. Navigate to `/admin`
3. You should now have access! 🎉

---

## Alternative: Make All Users Admins (Development Only)

⚠️ **WARNING**: Only use this in development/testing!

```sql
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users
ON CONFLICT (user_id, role) DO NOTHING;
```

---

## Troubleshooting

### "Table user_roles does not exist"
Run the database migration:
```bash
npx supabase db push
```

### Still Getting "Admin access required"
1. Clear your browser cache
2. Sign out and sign back in
3. Verify the role exists in database:
```sql
SELECT * FROM public.user_roles WHERE user_id = 'YOUR-USER-ID';
```

### Can't access Supabase Dashboard
1. Make sure you're logged into Supabase.com
2. Check you selected the correct project
3. Your Supabase credentials are in `.env` file

---

## Remove Admin Access

To remove admin role from a user:
```sql
DELETE FROM public.user_roles
WHERE user_id = 'USER-ID-HERE' AND role = 'admin';
```

---

## Production Setup

For production, you should:

1. **Create admin accounts manually** through SQL (more secure)
2. **Never make all users admins** in production
3. **Keep admin credentials secure**
4. **Use environment-specific admin accounts**

### Create Admin Account Securely
```sql
-- 1. Create user through Supabase Auth Dashboard first
-- 2. Then add admin role:
INSERT INTO public.user_roles (user_id, role)
VALUES ('SPECIFIC-USER-ID', 'admin');
```

---

## Database Schema

The `user_roles` table structure:
```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);
```

---

## Need Help?

- Check Supabase logs: Dashboard > Logs
- Test auth: Dashboard > Authentication > Users
- Verify migration: Dashboard > Database > Migrations

**Support**: support@studioconnect.co.za
