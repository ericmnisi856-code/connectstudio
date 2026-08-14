# Studio Connect

give me a lovable prompt for an e-commerce web application Called Studio Connect. its an e-commerce  application selling the following:

Ruijie Reyee offers a broad range of cloud-managed routers designed for small-to-medium enterprises (SME), multi-branch setups, CCTV networks, retail, hospitality, and home networks.The product lineup is divided into three primary commercial router product lines—EG Series, Wireless Routers, and NBR Security Routers—alongside consumer/SOHO EW Mesh Routers.1. EG Series (Enterprise Cloud-Managed Routers)The flagship line of wired business routers designed for stability, multi-WAN load balancing, customizable captive portals, and cloud management.SeriesTarget Capacity & HighlightsPopular ModelsEG1500 SeriesFlagship (Up to 1,500 Clients)High-density enterprise environments needing massive throughput.RG-EG1510XSEG700 SeriesHigh Performance (Up to 700 Clients)Medium enterprises, hotels, and large office branches.RG-EG710XSEG400 SeriesMulti-Gigabit & 10G UplinkFeatures 2.5G ports and 10G SFP+ uplinks for high-bandwidth networks.RG-EG406XS, RG-EG406XS-P (PoE)EG300 SeriesOffice Performance LineHigh-speed gigabit throughput with optional built-in PoE supply.RG-EG310GH-E, RG-EG310GH-P-EEG200 SeriesMid-Range CommercialStandard 9/10-port gigabit routers with SFP fiber options.RG-EG210G-E, RG-EG209GS, RG-EG210G-P-V3EG100 SeriesCompact / Entry LevelIdeal for small retail shops, cafes, and small offices (5-port configurations).RG-EG105G-V3, RG-EG105G-P-V32. Wireless All-In-One Routers (EG-W Series)Combines full enterprise EG-series routing capabilities (Multi-WAN, authentication, cloud management) with integrated Wi-Fi access points in a single desktop unit.Wi-Fi 6 Models: RG-EG105GW-X (AX3000 high-performance All-in-One)Wi-Fi 5 Models: RG-EG105GW(T) (AC1267 business All-in-One)3. NBR Series (High-Performance Security Routers)Enterprise-class security routers built for heavy bandwidth routing, enhanced firewall security features, deep application management, and multi-branch SD-WAN deployment.Models Offered: RG-NBR6215-E, RG-NBR6210-E, RG-NBR6205-E, RG-NBR6120-EKey Capabilities: Integrated cybersecurity protection, high concurrent user limits, traffic shaping, and site-to-site IPSec/SD-WAN tunneling.4. EW & M Series (Home & SOHO Wi-Fi Routers)Designed for smart homes, home offices, and small work spaces requiring mesh Wi-Fi coverage.Wi-Fi 7 Series: RG-EW7200BE PROWi-Fi 6 Series: RG-EW6000GX, RG-EW3200GX PRO, RG-EW3000GX PRO, RG-EW1800GX PROWi-Fi 5 & Wi-Fi 4 Series: RG-EW1300G, RG-EW1200G PRO, RG-EW300 PROMesh & Extenders: RG-M32, RG-M18, RG-EW1200RCore Features Across All Reyee Business RoutersRuijie Cloud App Management: Lifetime free remote network monitoring, setup, and diagnostics.Multi-WAN Load Balancing: Combines multiple internet connections (ISP failover & link aggregation).Built-in Captive Portals: Native support for guest Wi-Fi authentication (SMS, vouchers, open API).Smart QoS & NAT Traversal: Automatic traffic prioritization for VoIP, video streams, and NVR/CCTV cameras.

it must have back and frontend capabilities, the users must be able able to register for an account which will have a profile and log everything done and amin should have a backend where on the dashboard has the following:

1. Product Catalog & Inventory Management

This domain handles product data, dynamic stock updates, and digital asset tracking.

PIM (Product Information Management): Support for multi-attribute products (size, color, weight), SKUs, categories, tags, brands, and parent-child relationships (variants).

Real-Time Inventory Tracking: Stock reservation on checkout, threshold alerts, safety stock limits, and automated backorder logic.

Multi-Warehouse & Location Management: Distributed inventory mapping, multi-node stock allocation, and proximity-based routing.

Digital Asset Management (DAM) Integration: Metadata storage and CDN distribution logic for high-res images, video streams, and downloadable assets (for digital products).

Dynamic & Tiered Pricing Engines: Bulk/wholesale pricing rules, currency conversions, real-time FX rate syncing, customer-group specific price lists, and scheduled sales campaigns.

2. Order Management System (OMS) & Fulfillment

The engine that processes orders from cart conversion through delivery.

Order Lifecycle Management: State machine handling order transitions (Pending, Paid, Processing, Shipped, Delivered, Cancelled, Refunded).

Fulfillment Routing Logic: Logic for split-shipment orders, dropshipping integration, self-pickup (BOPIS - Buy Online, Pick Up In Store), and warehouse assignment algorithms.

Shipping & Logistics Integration: Carrier API integrations (e.g., DHL, FedEx, local couriers) for real-time rate calculation, automatic shipping label creation, and tracking code generation.

Returns & Refunds (RMA System): Automated Return Merchandise Authorization processing, store credit issuance, restock tracking, and reverse logistics orchestration.

Invoice & Document Generation: Auto-generation of tax invoices, packing slips, customs forms, and commercial documentation (PDF generation service).

3. Cart, Checkout & Payment Gateway Services

The core transactional pipelines requiring high concurrency and strict security.

Cart State Management: Persistent guest and authenticated user carts, abandon-cart tracking, tax recalculation triggers, and promo-code validation.

Payment Gateway Aggregation: Multi-provider integration (Stripe, PayPal, PayFast, Apple Pay/Google Pay, BNPL like Klarna/PayFlex) with automatic failover routing.

Webhooks & Event Handlers: Asynchronous verification of payment status, automated payment retries, and ledger status syncing.

Subscription & Recurring Billing: Automated billing schedules, dunning management (retry logic for failed cards), plan upgrades/downgrades, and proration logic.

Fraud Detection & Risk Scoring: Integrations with 3D Secure 2.0, IP geofencing, velocity checks, and automated order holding for suspicious transactions.

4. Customer Data Platform (CDP) & Auth

Managing identity, security, customer segments, and privacy compliance.

Authentication & Identity Access Management (IAM): OAuth2, Social Logins, Magic Links, Single Sign-On (SSO), Password Hashing (Argon2/Bcrypt), and Role-Based Access Control (RBAC) for admins/staff.

Customer Profile & Address Book: Multi-address storage, tax identification numbers (VAT/GST/SSN), purchase history logs, and saved payment tokens (PCI-DSS compliant tokenization).

Segmentation Engine: Dynamic customer grouping based on RFM (Recency, Frequency, Monetary) metrics, lifetime value (LTV), and shopping behavior.

Privacy & Data Governance: GDPR/POPIA compliant data export API, automated account deletion jobs ("Right to be Forgotten"), and explicit consent tracking.

5. Marketing, Promotions & Personalization

Engine logic to support growth, campaigns, and search experiences.

Promotions Engine: Complex discount rules (e.g., "Buy X, Get Y", percentage off, fixed cart discounts, stackable vs. non-stackable codes, usage caps).

Search & Merchandising API: Integration with search services (Algolia, Meilisearch, Elasticsearch) supporting fuzzy search, faceted filtering, auto-complete, and custom booster logic.

Recommendation Engine: Collaborative filtering and vector search algorithms for cross-selling, up-selling, and dynamic "Customers Also Bought" lists.

Loyalty & Rewards Program: Points accrual/redemption ledger, tier status calculation, referral code tracking, and digital wallet balance management.

Notification Engine: Event-driven email/SMS/WhatsApp/Push notifications for transactional messages, abandoned cart recovery, and promotional broadcasts.

6. Analytics, Reporting & Business Intelligence

Behind-the-scenes metrics tracking for operational and financial visibility.

Financial Reconciliation: Revenue reporting, tax liabilities collection (by region/jurisdiction), chargebacks logging, and payment gateway fee balancing.

Inventory & Sales Analytics: Stock turn rates, deadstock identification, top-selling SKUs, average order value (AOV) tracking, and conversion rates.

Audit Logging: Immutable admin event logs tracking changes to prices, orders, manual inventory adjustments, and access permissions.

Third-Party Event Streaming: Webhooks and data streaming pipeline (Segment, Mixpanel, BigQuery) for customer activity analytics.

7. Core Architecture & System Features

Infrastructure-level backend capabilities ensuring scale, reliability, and security.

Multi-Tenancy & Localization: Multi-currency, multi-language (i18n), localized tax systems, and multi-storefront routing from a single database backend.

Caching Strategy: Distributed caching (Redis, Memcached) for product catalogs, session management, and rate-limiting.

Headless / API-First Architecture: RESTful APIs or GraphQL endpoints exposing all functionality to frontend clients (web, mobile apps, POS terminals).

Job Queues & Background Workers: Asynchronous processing (RabbitMQ, BullMQ, Kafka) for heavy tasks like email queues, report generation, webhooks, and bulk imports.

and the frontend must have the following features: 

1. Storefront Navigation & Discovery

The features that help users find products quickly and intuitively.

Global Navigation Header: Sticky/transparent headers, multi-level mega menus with visual category thumbnails, top announcement banners (e.g., promo codes, free shipping thresholds), and store/currency switchers.

Search & Auto-Suggest Bar: Real-time visual search results, auto-complete queries, recent search history, trending keywords, and zero-results fallback recommendations.

Layered Navigation & Faceted Filtering: Dynamic multi-select filters (by price range slider, color swatches, size, brand, rating, availability), custom sorting (Price: Low to High, Newest, Popularity), and breadcrumb trails.

Landing & Merchandising Pages: Hero banner carousels, dynamic collections grids, promotional campaign pages, flash sale countdown timers, and brand partner hubs.

2. Product Presentation & Interaction

The pages and modules designed to display products and drive purchase intent.

Product Listing Page (PLP): Grid/list view toggles, lazy-loaded product cards with image hover-zoom or secondary image flip, badges ("Sale", "Low Stock", "Bestseller"), quick-add to cart, and quick-view modals.

Product Detail Page (PDP):

Media Gallery: High-res image zoom, thumbnail carousel, 360-degree product viewer, dynamic video player, and AR/3D model previewers.

Variant Selectors: Interactive color swatches (updating main images on select), size selectors, fit guides/size chart modals, and material pickers.

Dynamic Pricing & Stock Display: Cross-out original prices for sales, volume-discount breakdown tables, dynamic real-time stock indicators ("Only 3 left!"), and estimated delivery date calculators based on geolocation.

Social Proof & Engagement: Customer ratings summary, interactive review submission forms with image/video upload capabilities, verified buyer badges, Q&A sections, and "Share on Social" buttons.

3. Shopping Cart & Drawer Experience

Minimizing friction between item selection and checkout.

Mini-Cart / Slide-Out Cart Drawer: Instant slide-over cart update on "Add to Cart" without triggering a full page reload (AJAX/Fetch).

Cart Features: Quantity adjustment inputs, item removal triggers, variant switching inside cart, free shipping progress bar, and cross-sell "Frequently Bought Together" recommendations.

Saved Carts & Wishlists: Heart icon toggles for guest and authenticated wishlists, shareable wishlist links, and "Move to Cart" actions.

4. Checkout & Payment Flow

Optimized for high conversion, low abandonment, and mobile usability.

Flexible Checkout Options: Express checkout buttons (Apple Pay, Google Pay, Shop Pay, PayPal) at the top of the flow, along with Guest Checkout vs. Account Creation toggles.

Address & Shipping Selection: Real-time address auto-complete (Google Places API integration), address validation errors, saved address selectors for returning users, and delivery method selection (Standard, Express, Store Pickup/BOPIS).

Payment & Order Summary: Coupon/gift card input field with instant validation, order cost breakdown (subtotal, dynamic tax estimation, shipping cost, discount savings), order review, and inline credit card validation.

Order Confirmation / Thank You Page: Order summary, printable receipt, real-time map/tracking link integration, dynamic account creation prompt, and post-purchase surveys.

5. Customer Account Portal (Self-Service)

Giving customers control over their personal data, orders, and preferences.

Authentication Forms: Clean sign-up/login modals, passwordless magic links, social login buttons (Google, Facebook, Apple), and password reset workflows.

Dashboard & Profile Management: Personal profile editor, multi-address book manager (default billing vs. default shipping), and communication/privacy preference toggles.

Order History & Tracking: Filterable list of past orders, detailed status timeline views (Processing, Shipped, Out for Delivery), tracking number deep-links, and "Reorder in One Click" functionality.

Self-Service Returns & Exchange Portal: Step-by-step return request initiation, printable return shipping label downloads, and return status tracking.

Subscriptions & Digital Wallet: Management interface for recurring product subscriptions (pause, skip month, cancel), store credit balances, and saved payment methods.

6. UX, Performance & Technical Accessibility

Frontend architecture specs that directly impact page speed and accessibility standards.

Responsive & Mobile-First Layouts: Adaptive layouts across mobile, tablet, and desktop, touch-friendly tap targets, and bottom navbar menus for mobile apps/PWA views.

Performance Optimization: Next-gen image formatting (WebP/AVIF), responsive image srcset, skeleton loading screens during data fetches, lazy loading off-screen assets, and optimized Web Vitals.

Accessibility (WCAG Compliant): Full keyboard navigation, ARIA labels for screen readers, high-contrast color ratios, focus indicators, and screen reader announcements for cart state updates.

Internationalization (i18n): Multi-language switcher, localized date/time formatting, dynamic currency symbol formatting, and RTL (Right-to-Left) layout support.

For payments i want to use PayFast payment gateway. i will provide details later on. 

Make the application 3D and very dynamic and modern with smooth animations, dynamic pop up step forms that send enquiries to WhatsApp and the form must include all services. Make the application very eye catching with parallax scrolling animations and have a dynamic header and menu. make it responsive to any device. Add a floating WhatsApp. Add smooth slide / scroll in and out effects. Every section on all pages must have a different and fixed AI generated Ultra realistic image background with parallax effects and animation. add "Why us", A short company description and FAQs. make the application 100% compatible with netlify Please focus on highlighting services and products and make it easy for people to book services. add a dynamic smooth carousal on the hero section with animations. make the services section very dynamic and great to view using animated icons and images. include all social media platforms with animated icons. add smooth looping animation to elements. Please use AI generated images for backgrounds and and display and make them very ultra realistic and high quality. use Netlify’s official TanStack Start adapter, make the application 100% compatible to netlify deployment i don't want to use lovable hosting I WANT TO USE NETLIFY DEPLOYMENT!. Netlify compatibility by switching to Netlify’s official TanStack Start adapter, removing the old Nitro/Lovable deploy path. do not make it a one pager but multiple dedicated pages and the theme color should be a rich gradient green

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://connectivity-craft.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bf06c309-23d9-4fd1-9958-25d24f9bd111).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
