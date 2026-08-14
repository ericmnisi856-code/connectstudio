# Yoco Payment Gateway Integration

## Overview
This application is integrated with Yoco Payment Gateway for secure online payments. Currently configured with **test keys** for development and testing.

## Configuration

### Environment Variables
Located in `.env` file:

```env
# Yoco Payment Gateway (Test Keys)
VITE_YOCO_PUBLIC_KEY="pk_test_1e07de9cvnz96YN03cb4"
YOCO_SECRET_KEY="sk_test_f65fbbd2lVeRkvPc7704c37b6dc8"
```

⚠️ **Important**: These are test keys. Replace with production keys before going live.

## Test Cards

When using test mode, use these test card details:

| Card Number | Expiry | CVV | Result |
|-------------|--------|-----|--------|
| 4242 4242 4242 4242 | Any future date | Any 3 digits | Success |
| 4000 0000 0000 0002 | Any future date | Any 3 digits | Declined |

## How It Works

### 1. Customer Flow
1. Customer adds products to cart
2. Proceeds to checkout
3. Fills in shipping/billing information
4. Clicks "Pay with Card" button
5. Yoco popup opens for secure card entry
6. Customer enters card details
7. Payment is processed
8. On success, order is created and cart is cleared
9. Customer is redirected to success page

### 2. Technical Flow

#### Frontend (Client-side)
- **Yoco SDK**: Loaded from `https://js.yoco.com/sdk/v1/yoco-sdk-web.js`
- **Payment Button**: `YocoPaymentButton` component handles payment initialization
- **Security**: Only public key is used on client-side

#### Backend (Server-side)
- **Order Creation**: After successful payment, order is saved to database
- **Payment Verification**: Payment ID from Yoco is stored with order
- **Status**: Orders are marked as "processing" after payment

## Files Structure

```
src/
├── lib/
│   └── yoco-payment.ts          # Core Yoco integration functions
├── components/
│   └── yoco-payment-button.tsx  # Payment button component
└── routes/
    └── checkout.index.tsx        # Checkout page with Yoco integration
```

## Key Functions

### `loadYocoSDK()`
Dynamically loads the Yoco SDK script.

### `initializeYocoCheckout()`
Opens Yoco payment popup with configuration.

### `toCents()` / `toRands()`
Helper functions to convert between Rands and cents.

### `createYocoCharge()`
Server-side function to create charges (for advanced use cases).

## Security Best Practices

✅ **Implemented:**
- Public key only on client-side
- Secret key only on server-side
- HTTPS required for production
- No card data stored on our servers
- PCI DSS compliance via Yoco

⚠️ **Before Production:**
1. Replace test keys with production keys
2. Remove test card information display
3. Enable production mode in Yoco dashboard
4. Test thoroughly with real cards
5. Verify webhook integration if needed

## Production Deployment

### Step 1: Get Production Keys
1. Log in to [Yoco Business Portal](https://portal.yoco.com/)
2. Navigate to Developers → API Keys
3. Copy production keys

### Step 2: Update Environment Variables
```env
# Production Keys (DO NOT COMMIT TO GIT)
VITE_YOCO_PUBLIC_KEY="pk_live_your_production_public_key"
YOCO_SECRET_KEY="sk_live_your_production_secret_key"
```

### Step 3: Remove Test Mode Indicators
Remove test card information from `checkout.index.tsx`:
```tsx
// Remove this section:
<p>Test mode: Use test card 4242 4242 4242 4242</p>
<p>Any future expiry date and any 3-digit CVV</p>
```

### Step 4: Enable Production Features
- Update order status workflow
- Configure webhooks for payment notifications
- Set up refund handling
- Configure email notifications

## Webhooks (Optional)

To receive real-time payment notifications:

1. **Create webhook endpoint**: `/api/webhooks/yoco`
2. **Configure in Yoco Portal**: Settings → Webhooks
3. **Verify webhook signature** for security
4. **Handle events**: payment.succeeded, payment.failed, etc.

## Testing Checklist

- [ ] Test successful payment flow
- [ ] Test declined card
- [ ] Test cancelled payment
- [ ] Verify order creation
- [ ] Verify cart clearing
- [ ] Test email notifications
- [ ] Verify payment ID storage
- [ ] Test mobile responsiveness
- [ ] Check error handling
- [ ] Verify metadata is passed correctly

## Support

- **Yoco Documentation**: https://developer.yoco.com/online/
- **Yoco Support**: support@yoco.com
- **API Status**: https://status.yoco.com/

## Troubleshooting

### Payment popup doesn't open
- Check browser console for errors
- Verify VITE_YOCO_PUBLIC_KEY is set
- Ensure Yoco SDK loaded successfully

### Payment succeeds but order fails
- Check server logs
- Verify database connection
- Check order submission function

### Invalid public key error
- Verify key format in .env file
- Restart development server
- Check for typos in key

## Monitoring

Track these metrics in production:
- Payment success rate
- Average transaction time
- Failed payment reasons
- Refund requests
- Chargeback notifications

## Contact

For implementation questions:
- Technical Lead: [Your Name]
- Email: [Your Email]
