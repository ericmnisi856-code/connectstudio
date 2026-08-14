# Studio Connect - E-commerce Application

A modern, full-featured e-commerce platform for Ruijie Reyee network hardware with integrated Yoco payment gateway.

## 🚀 Features

### Core Features
- ✅ **Product Catalog** - Browse EG Gateways, Wireless Routers, and NBR Security Routers
- ✅ **Shopping Cart** - Add/remove products with persistent cart storage
- ✅ **Checkout Flow** - Complete order processing with validation
- ✅ **Payment Gateway** - Integrated Yoco payment system (test mode)
- ✅ **Admin Dashboard** - Product management (CRUD operations)
- ✅ **Order Management** - Track and manage customer orders
- ✅ **User Authentication** - Secure admin access via Supabase

### Design Features
- ✅ **Animated Background** - Dynamic floating orbs and particles
- ✅ **Smooth Scrolling** - Intersection observer animations
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark/Light Mode** - Theme support
- ✅ **Interactive Modals** - Service details with images
- ✅ **Green Gradient Theme** - Consistent brand colors

### Technical Features
- ✅ **TypeScript** - Type-safe codebase
- ✅ **TanStack Router** - File-based routing
- ✅ **React Query** - Server state management
- ✅ **Supabase** - Database and authentication
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **Shadcn/ui** - High-quality component library

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- Git
- Supabase account (free tier works)
- Yoco account (for payment processing)

### Clone Repository
```bash
git clone https://github.com/ericmnisi856-code/studio-green-flow.git
cd studio-green-flow
```

### Install Dependencies
```bash
npm install
# or
bun install
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your environment variables:

```env
# Supabase Configuration
SUPABASE_PROJECT_ID="your_project_id"
SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
SUPABASE_URL="https://your_project.supabase.co"
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
VITE_SUPABASE_URL="https://your_project.supabase.co"

# Yoco Payment Gateway (Test Keys)
VITE_YOCO_PUBLIC_KEY="pk_test_your_test_public_key"
YOCO_SECRET_KEY="sk_test_your_test_secret_key"
```

### Database Setup
```bash
# Run Supabase migrations
npx supabase db push
```

## 🏃 Development

### Start Development Server
```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:8080`

### Build for Production
```bash
npm run build
# or
bun run build
```

### Preview Production Build
```bash
npm run preview
# or
bun run preview
```

## 🧪 Testing Payment Integration

### Test Cards
Use these cards in test mode:

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Declined |

- **Expiry**: Any future date
- **CVV**: Any 3 digits

### Test Flow
1. Add products to cart
2. Proceed to checkout
3. Fill in delivery information
4. Click "Pay with Card"
5. Enter test card details
6. Verify order creation

## 📁 Project Structure

```
src/
├── components/         # Reusable React components
│   ├── admin/         # Admin-specific components
│   ├── ui/            # Shadcn/ui components
│   └── ...
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and helpers
│   ├── catalog.ts     # Product data
│   ├── cart.tsx       # Cart management
│   ├── orders.ts      # Order processing
│   └── yoco-payment.ts # Yoco integration
├── routes/            # File-based routes
│   ├── _authenticated/ # Protected routes
│   ├── checkout/      # Checkout pages
│   └── ...
├── integrations/      # Third-party integrations
│   ├── supabase/      # Supabase config
│   └── lovable/       # Lovable integration
└── styles.css         # Global styles
```

## 🔐 Admin Access

1. Navigate to `/admin` or click "Staff login" in footer
2. Sign in with admin credentials
3. Manage products, view orders, and monitor sales

### Admin Features
- View all orders with status tracking
- Create new products with image upload
- Edit existing products
- Delete products
- Search and filter products
- Real-time order status updates

## 🎨 Customization

### Branding
- Logo: `src/Images/WhatsApp Image 2026-08-13 at 11.48.24 AM.jpeg`
- Favicon: `public/favicon.ico`
- OG Image: `public/og-image.jpg`

### Theme Colors
Colors are defined in `src/styles.css`:
- Primary: Green gradient theme
- Background: Subtle gradients
- Accents: Emerald tones

### Components
All UI components are in `src/components/ui/` and can be customized using Tailwind classes.

## 📚 Documentation

- **Yoco Integration**: See `YOCO_INTEGRATION.md`
- **API Routes**: See `src/routes/README.md`
- **Component Library**: Shadcn/ui docs

## 🚀 Deployment

### Netlify (Recommended)
```bash
# netlify.toml is already configured
netlify deploy --prod
```

### Vercel
```bash
vercel --prod
```

### Environment Variables
Set these in your hosting platform:
- All variables from `.env`
- Production Yoco keys (not test keys)

## 🔒 Security

### Before Production
- [ ] Replace test Yoco keys with production keys
- [ ] Remove test card information from UI
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable Supabase RLS policies
- [ ] Add error monitoring (Sentry, etc.)

## 📊 Features Roadmap

### Planned Features
- [ ] Email notifications
- [ ] Invoice generation
- [ ] Inventory management
- [ ] Advanced analytics
- [ ] Customer accounts
- [ ] Order tracking
- [ ] Reviews and ratings
- [ ] Wishlist functionality

## 🐛 Troubleshooting

### Common Issues

**Development server won't start**
- Check Node.js version (18+)
- Delete `node_modules` and reinstall
- Clear cache: `rm -rf .vinxi .tanstack`

**Payment popup doesn't open**
- Verify Yoco public key in `.env`
- Check browser console for errors
- Ensure HTTPS in production

**Database connection fails**
- Verify Supabase credentials
- Check if migrations have run
- Test connection in Supabase dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 📧 Support

For questions or issues:
- Email: accounts@connectstudio.co.za
- Phone: 076 676 8658

## 🙏 Acknowledgments

- **Yoco** - Payment gateway integration
- **Supabase** - Backend infrastructure
- **Shadcn/ui** - Component library
- **TanStack** - Router and Query
- **Tailwind CSS** - Styling framework

---

Built with ❤️ by Studio Connect Team
