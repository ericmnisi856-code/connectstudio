# ✅ Yoco Payment Account Updated

## New Yoco Account Configured

Your payment gateway has been updated to use your new Yoco account.

### **New Live Keys Configured:**
- **Public Key**: `pk_live_dcf411fbkwzL66Abd9d4`
- **Secret Key**: `sk_live_0767826br6******` (stored securely in .env)

### **Files Updated:**
✅ `.env` - Local development environment variables (not committed to Git)

### **What You Need to Do:**

#### 1. **Update Netlify Environment Variables**
Go to your Netlify Dashboard and update these environment variables with your new Yoco keys:

**Variables to update:**
- `YOCO_SECRET_KEY` - Your Yoco secret key (starts with sk_live_)
- `VITE_YOCO_PUBLIC_KEY` - Your Yoco public key (starts with pk_live_)

**Steps:**
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site → Site settings → Environment variables
3. Find `YOCO_SECRET_KEY` and update its value
4. Find `VITE_YOCO_PUBLIC_KEY` and update its value
5. Click "Save"
6. **Trigger a new deployment** (Site overview → Trigger deploy → Deploy site)

#### 2. **Verify Your Yoco Account Setup**

Make sure in your [Yoco Portal](https://portal.yoco.com):
- ✅ Your business details are complete
- ✅ Your bank account is linked
- ✅ Your account is verified and active
- ✅ Payment webhooks are configured (if needed)

#### 3. **Test Payment Flow**

After deploying:
1. Go to your live site `/products`
2. Add a product to cart
3. Go to checkout
4. Complete a test payment (you can use a real card for a small amount)
5. Verify the payment appears in your Yoco dashboard

### **Important Security Notes:**

⚠️ **Never commit `.env` file to Git** - It's already in `.gitignore`
⚠️ **Keep secret keys private** - Only store in secure environment variables
⚠️ **Use live keys only in production** - Test keys for development

### **Payment Flow:**
1. Customer clicks "Pay with Yoco"
2. Yoco hosted checkout opens with your public key
3. Customer completes payment
4. Yoco processes payment with your account
5. Funds go to your linked bank account
6. Customer redirected back to success page

### **Webhook Configuration (Optional):**

If you want real-time payment notifications, configure webhooks in Yoco Portal:
- Webhook URL: `https://connectstudio.co.za/.netlify/functions/yoco-webhook`
- Events: `payment.succeeded`, `payment.failed`, `payment.refunded`

### **Status: ✅ Ready for Production**

Your new Yoco account is configured and ready to accept payments once you update the Netlify environment variables and redeploy.

---

**Need Help?**
- [Yoco Documentation](https://developer.yoco.com/online/)
- [Yoco Support](https://portal.yoco.com/support)
- Check console logs in browser DevTools for any errors