# 📧 Contact Form Email Setup

## ✅ What's Been Done

1. **Category input** - Changed from dropdown to manual text input
2. **Contact form** - Now uses Netlify Forms (built-in email forwarding)

---

## 🔧 Netlify Forms Setup (One-Time Configuration)

After deployment, configure email forwarding in Netlify:

### Step 1: Go to Netlify Dashboard

1. Open your Netlify dashboard
2. Select your site
3. Go to **Forms** tab in the sidebar

### Step 2: Configure Email Notifications

1. You should see the "contact" form listed
2. Click **Settings and email notifications**
3. Click **Add notification**
4. Select **Email notification**
5. Enter: **accounts@connectstudio.co.za**
6. Click **Save**

### Step 3: Test the Form

1. Go to your live site contact page
2. Fill out the form
3. Submit
4. Check **accounts@connectstudio.co.za** inbox
5. You should receive the form submission!

---

## 📋 What Gets Sent

When someone submits the contact form, **accounts@connectstudio.co.za** receives:

```
New form submission from: Studio Connect Contact Form

Name: John Doe
Email: john@example.com
Phone: 0123456789
Company: ABC Corp
Message: I need a quote for 50 access points...

Submitted: 2026-08-21 14:30
```

---

## 🎯 Features

### ✅ Spam Protection
- Honeypot field (catches bots)
- Netlify's built-in spam filtering
- reCAPTCHA (optional, can be enabled)

### ✅ Form Submissions Logged
- All submissions stored in Netlify dashboard
- Can view/export submissions anytime
- Downloadable as CSV

### ✅ Multiple Notifications
- Can add multiple email addresses
- Can set up Slack notifications
- Can use webhooks for custom integrations

---

## 🔄 Alternative: SendGrid Integration (Optional)

If you want more control over emails, you can integrate SendGrid:

### 1. Install SendGrid Package

```bash
npm install @sendgrid/mail
```

### 2. Get SendGrid API Key

1. Sign up at https://sendgrid.com
2. Create API key
3. Add to Netlify environment variables:
   - Key: `SENDGRID_API_KEY`
   - Value: Your API key

### 3. Update the Function

The function `netlify/functions/send-contact-email.js` is ready - just uncomment the SendGrid code and add your API key.

---

## 📊 Form Analytics

Netlify Forms provides:
- Submission count
- Success/failure rate
- Spam detection rate
- Export to CSV
- Webhook triggers

---

## 🚨 Troubleshooting

### Form not appearing in Netlify dashboard?

1. **Deploy the site** (forms only appear after deployment)
2. **Wait 2-3 minutes** after deployment
3. **Submit a test** to initialize the form
4. Check Netlify dashboard → Forms tab

### Not receiving emails?

1. **Check spam folder**
2. **Verify email in Netlify** → Forms → Notifications
3. **Test with different email** to rule out email provider issues
4. **Check Netlify logs** for form submissions

### Form submission fails?

1. **Check browser console** for errors
2. **Verify form has** `data-netlify="true"` attribute
3. **Ensure** `name="contact"` matches hidden input
4. **Try refreshing** the page

---

## 💡 Category Input Changes

### Product Wizard (Add/Edit Products)

**Before:**
- Dropdown with 3 fixed options
- Limited to: EG Series, Wireless Routers, NBR Security

**After:**
- Text input field
- Enter any category name
- Examples: "switches", "routers", "access-points", "cables", "cameras"

### Benefits:
- ✅ Unlimited categories
- ✅ Custom naming
- ✅ More flexible
- ✅ Easy to use

---

## 📝 Summary

- ✅ Contact form submits to **accounts@connectstudio.co.za**
- ✅ Category is now manual text input (not dropdown)
- ✅ Spam protection included
- ✅ All submissions logged in Netlify
- ✅ Easy to manage and export

**Configure email forwarding in Netlify dashboard after deployment!**
