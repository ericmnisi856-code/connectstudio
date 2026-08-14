# Getting Live Yoco Payment Keys

## Important: You're Currently Using Test Keys! ⚠️

The keys you provided are **TEST keys**, not live keys:
- `pk_test_1e07de9cvnz96YN03cb4` ← This is a TEST public key
- `sk_test_f65fbbd2lVeRkvPc7704c37b6dc8` ← This is a TEST secret key

**Test keys only accept test card numbers and no real money is processed!**

## How to Get Live Keys for Real Payments

### Step 1: Log into Yoco Portal
1. Go to https://portal.yoco.com/
2. Sign in with your Yoco account

### Step 2: Navigate to API Keys
1. Click on "Settings" or "Developer"
2. Go to "API Keys" section
3. You should see two types of keys:
   - **Test Keys** (for development)
   - **Live Keys** (for real payments)

### Step 3: Get Your Live Keys
Your live keys will look like this:
- **Live Public Key**: `pk_live_xxxxxxxxxxxxx`
- **Live Secret Key**: `sk_live_xxxxxxxxxxxxx`

**IMPORTANT:** Live keys start with `pk_live_` and `sk_live_`, not `pk_test_` and `sk_test_`

### Step 4: Update Your .env File
Replace the test keys in your `.env` file:

```env
# OLD (Test Keys)
YOCO_SECRET_KEY="sk_test_f65fbbd2lVeRkvPc7704c37b6dc8"
VITE_YOCO_PUBLIC_KEY="pk_test_1e07de9cvnz96YN03cb4"

# NEW (Live Keys - get from Yoco Portal)
YOCO_SECRET_KEY="sk_live_your_actual_live_secret_key"
VITE_YOCO_PUBLIC_KEY="pk_live_your_actual_live_public_key"
```

### Step 5: Update Production URL
When deploying to production, also update:

```env
VITE_APP_URL="https://your-production-domain.com"
```

This URL is used for redirect URLs after payment.

## Security Checklist ✅

Before going live with real payments:

- [ ] Replace test keys with live keys from Yoco portal
- [ ] Update `VITE_APP_URL` to your production domain
- [ ] Never commit `.env` file to Git (it's in `.gitignore`)
- [ ] Keep your secret key (`sk_live_...`) private - never expose it in client-side code
- [ ] Test with a small real transaction first (e.g., R10)
- [ ] Set up webhooks in Yoco portal (optional but recommended)
- [ ] Review Yoco's terms and transaction fees
- [ ] Ensure your Yoco account is fully verified

## Testing vs Production

### Test Mode (Current Setup)
- Uses test keys (`pk_test_` and `sk_test_`)
- Accepts test cards only: `4242 4242 4242 4242`
- No real money is processed
- No actual bank transactions
- Safe for development and testing

### Live Mode (Production)
- Uses live keys (`pk_live_` and `sk_live_`)
- Accepts real credit/debit cards
- **Real money is processed!**
- Actual bank transactions
- Yoco transaction fees apply
- Payments are processed and settled to your bank account

## Common Mistakes to Avoid

❌ **Don't** use test keys in production
❌ **Don't** commit secret keys to Git
❌ **Don't** share your secret key with anyone
❌ **Don't** use live keys during development

✅ **Do** keep test keys for development
✅ **Do** use environment variables for keys
✅ **Do** test thoroughly in test mode first
✅ **Do** verify small transactions when switching to live mode

## Need Help?

Contact Yoco Support:
- Website: https://www.yoco.com/za/support/
- Phone: 087 550 9626
- Email: support@yoco.com

## Current Status

**Logo**: ✅ Updated to new logo throughout application
**Favicon**: ✅ Updated with new logo
**Payment Keys**: ⚠️ Using TEST keys (update to LIVE keys for production)
**Payment Flow**: ✅ Working perfectly with test mode

---

**Next Step:** Get your live keys from https://portal.yoco.com/ and update the `.env` file when you're ready to accept real payments.
