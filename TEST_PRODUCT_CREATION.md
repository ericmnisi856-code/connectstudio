# Test Product Creation - Fixed Version

## What Was Fixed

### Problem
Product creation was failing with validation error: "Expected object, received array" on the `specs` field.

### Root Cause
The TanStack Router server function was expecting data in format `{ data: product }` but the validation schema wasn't handling it correctly.

### Solution
1. Fixed the `createProduct` function to expect `{ data: productSchema }` structure
2. Simplified the `specs` field validation to accept only arrays (removed transform logic)
3. Added extensive console logging for debugging
4. Maintained proper camelCase to snake_case transformation for database

---

## How to Test

### Step 1: Wait for Netlify Deploy
After pushing, Netlify will automatically deploy. Wait 2-3 minutes and check:
- Go to your Netlify dashboard
- Look for the latest deploy on `clean-main` branch
- Wait until status shows "Published"

### Step 2: Verify Database Schema
Before testing, make sure the database has the correct schema:

1. Go to Supabase Dashboard → SQL Editor
2. Run this query to check if products table exists:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products'
ORDER BY ordinal_position;
```

3. If table doesn't exist or has wrong schema, run the **UPDATE_PRODUCTS_SCHEMA.sql** file

### Step 3: Test Product Creation
1. Log in as admin (accounts@connectstudio.co.za or ericmnisi856@gmail.com)
2. Go to Admin Dashboard → Products tab
3. Click "Add Product"
4. Fill in the form with test data:
   - **Name**: Test Router
   - **Model**: TEST-001
   - **Slug**: test-router-001
   - **Category**: routers (or any category)
   - **Tagline**: Test product
   - **Description**: This is a test product
   - **Price**: 1000
   - **Stock**: 10
   - **Rating**: 4.5
   - **Reviews**: 5
   - **Highlights**: Add 1-2 highlights
   - **Specs**: Add 1-2 specs (label + value)
   - **Use Cases**: Add 1-2 use cases

5. Click "Create Product"

### Step 4: Check for Success
**SUCCESS INDICATORS:**
- ✅ Toast message: "Product created successfully"
- ✅ Dialog closes automatically
- ✅ New product appears in the products list
- ✅ Product shows in the grid on admin page

**IF IT FAILS:**
- ❌ Check browser console (F12) for errors
- ❌ Check Netlify Functions logs:
  - Go to Netlify Dashboard → Functions
  - Click on the failing function
  - Look for console.log messages showing the data structure

### Step 5: Test Real-Time Updates
1. Keep admin page open
2. Open shop page (/products) in another tab or browser
3. Create a new product from admin
4. **Shop page should update automatically** without refresh
5. Edit a product - shop should update
6. Delete a product - shop should update

---

## Debug Checklist

If product creation still fails:

### ✅ Check 1: Database Table Exists
```sql
SELECT COUNT(*) FROM products;
```
Should return a number (even if 0)

### ✅ Check 2: RLS Policies Are Correct
```sql
SELECT * FROM user_roles WHERE user_id = auth.uid();
```
Should show `role = 'admin'` for your user

### ✅ Check 3: Realtime Is Enabled
```sql
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```
Should include `products` table

### ✅ Check 4: Environment Variables
All these must be set in Netlify:
- SUPABASE_URL
- SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY
- YOCO_SECRET_KEY
- YOCO_PUBLIC_KEY
- SITE_URL
- WHATSAPP_NUMBER
- ADMIN_EMAIL
- ADMIN_EMAIL_2

### ✅ Check 5: Function Logs
Go to Netlify Dashboard → Functions → Look for:
```
[Products] Validated data received: { ... }
[Products] DB data to insert: { ... }
[Products] Product created successfully: { ... }
```

---

## Expected Data Flow

### Frontend (Product Management Form)
```javascript
{
  slug: "test-001",
  name: "Test Product",
  specs: [{ label: "Port", value: "RJ45" }],  // Array of objects
  useCases: ["Home use"],  // Array of strings
  // ... other fields
}
```

### Admin Handler
```javascript
handleProductCreate({ data: productData })
```

### Server Function Receives
```javascript
{ 
  data: { 
    slug: "test-001", 
    specs: [...],  // Validated array
    useCases: [...] 
  } 
}
```

### Database Insert
```sql
INSERT INTO products (
  slug, name, specs, use_cases, ...
) VALUES (
  'test-001', 'Test Product', 
  '[{"label":"Port","value":"RJ45"}]'::jsonb,  -- snake_case
  '["Home use"]'::jsonb,
  ...
)
```

---

## What to Report Back

If it works: ✅ "Product created successfully!"

If it fails, send:
1. The exact error message from browser console
2. Screenshot of the error toast
3. Any errors from Netlify function logs
4. Result of the database check queries above

---

## Changes Made in This Fix

### File: src/lib/products.functions.ts

**Before:**
- No validator, manual JSON parsing
- Complex spec transformation logic
- No proper error handling

**After:**
- Proper Zod validator with `{ data: productSchema }`
- Clean specs validation (array of objects only)
- Comprehensive logging
- Proper error messages

**Key Changes:**
```typescript
// OLD (broken)
.handler(async (ctx) => {
  const data = await ctx.request.json();
  // ...
})

// NEW (fixed)
.validator(z.object({ data: productSchema }))
.handler(async ({ data: { data } }) => {
  // data is now validated!
  // ...
})
```

---

## Next Steps After Success

Once product creation works:

1. **Test all CRUD operations:**
   - ✅ Create product
   - ✅ Edit product
   - ✅ Delete product

2. **Test real-time updates:**
   - ✅ Changes appear on shop page immediately
   - ✅ No page refresh needed

3. **Test with real product data:**
   - Add actual router products
   - Upload real images
   - Add complete specs

4. **Clean up test data:**
   - Delete test products
   - Keep only real products

---

## Commit Info
- **Branch**: clean-main
- **Commit**: "Fix product creation validation - match expected data structure"
- **Files Changed**: src/lib/products.functions.ts
- **Deployed**: Auto-deploy via Netlify (2-3 minutes)
