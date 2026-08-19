-- ================================================================
-- RESTORE ALL PRODUCTS FROM CATALOG TO DATABASE
-- ================================================================
-- This script inserts all the products from src/lib/catalog.ts into the database
-- Run this in Supabase SQL Editor to restore your shop inventory

-- Clear existing products if you want a fresh start
-- TRUNCATE products;

-- Insert all products from the catalog
INSERT INTO products (
  slug, name, model, category, tagline, description, 
  price, compare_at, stock, rating, reviews, badge, 
  highlights, specs, use_cases
) VALUES 

-- Reyee EG105G-V2 Cloud Gateway
(
  'rg-eg105g-v2',
  'Reyee EG105G-V2 Cloud Gateway',
  'RG-EG105G-V2',
  'eg',
  '5-port desktop cloud gateway for up to 100 clients',
  'A compact, fanless cloud-managed gateway that routes, firewalls and controls up to 100 concurrent clients while doubling as an AC controller for up to 100 Reyee access points. Managed end-to-end from Ruijie Cloud or the Reyee app.',
  2199,
  2599,
  42,
  4.8,
  126,
  'Best seller',
  '["Built-in AC controller for up to 100 Reyee APs", "600 Mbps routing throughput, 1500 sessions", "Ruijie Cloud remote management and alerting", "Behaviour management, VPN and smart flow control"]'::jsonb,
  '[{"label": "Ports", "value": "5 × 10/100/1000 Base-T (WAN/LAN configurable)"}, {"label": "Recommended clients", "value": "100"}, {"label": "Throughput", "value": "600 Mbps"}, {"label": "AP management", "value": "Up to 100 APs"}, {"label": "VPN", "value": "IPsec, L2TP, PPTP"}, {"label": "Power", "value": "12V DC external adapter"}]'::jsonb,
  '["Small office", "Coffee shop", "Branch site"]'::jsonb
),

-- Reyee EG105GW-T Wireless Cloud Gateway
(
  'rg-eg105gw-t',
  'Reyee EG105GW-T Wireless Cloud Gateway',
  'RG-EG105GW-T',
  'eg',
  'Gateway and AC1300 dual-band AP in one enclosure',
  'Combines the EG105G routing engine with an integrated AC1300 dual-band radio, so a single unit covers routing, firewalling, AP control and Wi-Fi for a small site.',
  2899,
  NULL,
  28,
  4.7,
  84,
  NULL,
  '["Integrated AC1300 dual-band Wi-Fi", "Cloud-managed routing plus AP controller", "Zero-touch provisioning from Ruijie Cloud", "Guest network with captive portal"]'::jsonb,
  '[{"label": "Ports", "value": "5 × Gigabit (WAN/LAN configurable)"}, {"label": "Wi-Fi", "value": "802.11ac Wave 2, AC1300"}, {"label": "Recommended clients", "value": "100"}, {"label": "Throughput", "value": "600 Mbps"}, {"label": "Mounting", "value": "Desktop / wall"}, {"label": "Power", "value": "12V DC"}]'::jsonb,
  '["Home office", "Small retail", "Clinic"]'::jsonb
),

-- Reyee EG210G-P-E PoE Cloud Gateway
(
  'rg-eg210g-p-e',
  'Reyee EG210G-P-E PoE Cloud Gateway',
  'RG-EG210G-P-E',
  'eg',
  '10-port PoE gateway for CCTV and AP deployments',
  'Eight PoE/PoE+ ports with a 110W budget let this gateway power IP cameras and access points directly, while managing up to 200 clients and 100 APs from the cloud.',
  6499,
  7250,
  17,
  4.9,
  63,
  'CCTV ready',
  '["8 × PoE/PoE+ ports, 110W total budget", "Powers cameras and APs without extra injectors", "200 concurrent clients, 1.5 Gbps throughput", "One-click CCTV network templates"]'::jsonb,
  '[{"label": "Ports", "value": "8 × Gigabit PoE + 2 × Gigabit uplink"}, {"label": "PoE budget", "value": "110W"}, {"label": "Recommended clients", "value": "200"}, {"label": "Throughput", "value": "1.5 Gbps"}, {"label": "AP management", "value": "Up to 100 APs"}, {"label": "Form factor", "value": "1U rack mountable"}]'::jsonb,
  '["CCTV network", "Guesthouse", "Warehouse"]'::jsonb
),

-- Reyee EG310GH-P-E Cloud Gateway
(
  'rg-eg310gh-p-e',
  'Reyee EG310GH-P-E Cloud Gateway',
  'RG-EG310GH-P-E',
  'eg',
  'High-density PoE gateway for 300+ clients',
  'A rack-mount gateway built for busy multi-branch sites: multi-WAN load balancing, 300 client capacity, and a 130W PoE budget for downstream devices.',
  9899,
  NULL,
  11,
  4.8,
  41,
  NULL,
  '["Multi-WAN failover and load balancing", "130W PoE budget across 8 ports", "300 concurrent clients, 2 Gbps throughput", "Application-aware bandwidth shaping"]'::jsonb,
  '[{"label": "Ports", "value": "8 × Gigabit PoE + 2 × Gigabit SFP/RJ45"}, {"label": "PoE budget", "value": "130W"}, {"label": "Recommended clients", "value": "300"}, {"label": "Throughput", "value": "2 Gbps"}, {"label": "VPN tunnels", "value": "128 IPsec"}, {"label": "Form factor", "value": "1U rack"}]'::jsonb,
  '["Multi-branch HQ", "Hotel", "School"]'::jsonb
),

-- Reyee EW1200G PRO Mesh Router
(
  'rg-ew1200g-pro',
  'Reyee EW1200G PRO Mesh Router',
  'RG-EW1200G PRO',
  'wireless',
  'AC1300 dual-band mesh router with Reyee Mesh pairing',
  'An affordable dual-band mesh router that pairs with any Reyee Mesh node in one press. Ideal starter node for homes and small offices needing reliable coverage.',
  1249,
  1499,
  96,
  4.6,
  312,
  'Value pick',
  '["AC1300 dual-band, 4 external antennas", "Reyee Mesh one-touch pairing", "Up to 64 concurrent clients", "Reyee Router app + cloud management"]'::jsonb,
  '[{"label": "Wi-Fi", "value": "802.11ac, 400 Mbps @2.4G + 867 Mbps @5G"}, {"label": "Ports", "value": "1 × WAN + 4 × LAN Gigabit"}, {"label": "Clients", "value": "64"}, {"label": "Antennas", "value": "4 × 5 dBi external"}, {"label": "Mesh", "value": "Reyee Mesh, up to 5 nodes"}, {"label": "Coverage", "value": "Up to 120 m²"}]'::jsonb,
  '["Apartment", "Home office", "Small shop"]'::jsonb
),

-- Reyee EW3200GX PRO Wi-Fi 6 Router
(
  'rg-ew3200gx-pro',
  'Reyee EW3200GX PRO Wi-Fi 6 Router',
  'RG-EW3200GX PRO',
  'wireless',
  'AX3200 Wi-Fi 6 gaming-grade mesh router',
  'Wi-Fi 6 with 2.4 Gbps on 5 GHz, a dedicated game acceleration engine and a 1.5 GHz quad-core processor. Mesh-ready and cloud managed.',
  2549,
  NULL,
  54,
  4.9,
  228,
  'Wi-Fi 6',
  '["AX3200 with OFDMA and MU-MIMO", "Quad-core 1.5 GHz processor", "Game acceleration and QoS priority lanes", "Reyee Mesh with up to 5 nodes"]'::jsonb,
  '[{"label": "Wi-Fi", "value": "802.11ax, 800 Mbps @2.4G + 2402 Mbps @5G"}, {"label": "Ports", "value": "1 × WAN + 3 × LAN Gigabit"}, {"label": "Clients", "value": "128"}, {"label": "Processor", "value": "Quad-core 1.5 GHz"}, {"label": "Antennas", "value": "4 × high-gain external"}, {"label": "Coverage", "value": "Up to 200 m²"}]'::jsonb,
  '["Large home", "Gaming", "Creative studio"]'::jsonb
),

-- Reyee EW6000GX PRO Wi-Fi 6 Router
(
  'rg-ew6000gx-pro',
  'Reyee EW6000GX PRO Wi-Fi 6 Router',
  'RG-EW6000GX PRO',
  'wireless',
  'AX6000 flagship Wi-Fi 6 with 2.5G WAN',
  'The flagship Reyee wireless router: AX6000 tri-stream Wi-Fi 6, a 2.5 Gbps WAN port and eight amplified antennas for whole-property coverage.',
  4399,
  4899,
  23,
  4.9,
  97,
  NULL,
  '["AX6000 with 160 MHz channels", "2.5 Gbps WAN for fibre plans above 1 Gbps", "8 amplified antennas with beamforming", "Seamless roaming across mesh nodes"]'::jsonb,
  '[{"label": "Wi-Fi", "value": "802.11ax, 1148 Mbps @2.4G + 4804 Mbps @5G"}, {"label": "Ports", "value": "1 × 2.5G WAN + 4 × Gigabit LAN"}, {"label": "Clients", "value": "256"}, {"label": "Antennas", "value": "8 × external"}, {"label": "Mesh", "value": "Reyee Mesh, up to 5 nodes"}, {"label": "Coverage", "value": "Up to 300 m²"}]'::jsonb,
  '["Double-storey home", "Boutique hotel", "Studio"]'::jsonb
),

-- Reyee NBR6210-E Security Router
(
  'rg-nbr6210-e',
  'Reyee NBR6210-E Security Router',
  'RG-NBR6210-E',
  'nbr',
  'Enterprise security router for 300 users',
  'Next-generation firewall routing with behaviour auditing, application control and multi-WAN balancing for enterprises that need visibility as much as throughput.',
  11999,
  NULL,
  9,
  4.7,
  38,
  NULL,
  '["Deep application identification and control", "Behaviour auditing with exportable reports", "Multi-WAN load balancing and failover", "Built-in AC for up to 128 APs"]'::jsonb,
  '[{"label": "Ports", "value": "2 × WAN + 3 × WAN/LAN Gigabit"}, {"label": "Recommended users", "value": "300"}, {"label": "Throughput", "value": "1.5 Gbps"}, {"label": "Sessions", "value": "300,000"}, {"label": "VPN", "value": "IPsec / L2TP / PPTP / SSL"}, {"label": "Form factor", "value": "1U rack"}]'::jsonb,
  '["Enterprise HQ", "Campus", "Co-working"]'::jsonb
),

-- Reyee NBR6215-E Security Router
(
  'rg-nbr6215-e',
  'Reyee NBR6215-E Security Router',
  'RG-NBR6215-E',
  'nbr',
  '500-user security gateway with 500k sessions',
  'Scales the NBR platform to 500 concurrent users with 500,000 sessions, hardened firewalling and granular per-application policy.',
  17499,
  18990,
  6,
  4.8,
  24,
  'Enterprise',
  '["500 users, 500,000 concurrent sessions", "Intrusion prevention and DoS protection", "Bandwidth policy per user, group or app", "Hot-standby dual-machine redundancy"]'::jsonb,
  '[{"label": "Ports", "value": "5 × Gigabit configurable + 1 × SFP"}, {"label": "Recommended users", "value": "500"}, {"label": "Throughput", "value": "2 Gbps"}, {"label": "Sessions", "value": "500,000"}, {"label": "AP management", "value": "Up to 256 APs"}, {"label": "Form factor", "value": "1U rack"}]'::jsonb,
  '["Large campus", "Hospital", "Manufacturing"]'::jsonb
),

-- Reyee NBR6135-E Security Router
(
  'rg-nbr6135-e',
  'Reyee NBR6135-E Security Router',
  'RG-NBR6135-E',
  'nbr',
  'High-capacity router for 1000+ users and ISPs',
  'Built for service providers and large campuses: 1000+ concurrent users, 1,000,000 sessions and carrier-grade routing with full behaviour analytics.',
  28999,
  NULL,
  4,
  4.9,
  15,
  NULL,
  '["1000+ users, 1,000,000 sessions", "Carrier-grade multi-WAN aggregation", "Full traffic analytics and audit trail", "Dual power supply option"]'::jsonb,
  '[{"label": "Ports", "value": "8 × Gigabit configurable + 2 × SFP"}, {"label": "Recommended users", "value": "1000+"}, {"label": "Throughput", "value": "4 Gbps"}, {"label": "Sessions", "value": "1,000,000"}, {"label": "VPN tunnels", "value": "1000 IPsec"}, {"label": "Form factor", "value": "1U rack"}]'::jsonb,
  '["ISP edge", "University", "Data centre edge"]'::jsonb
)

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  model = EXCLUDED.model,
  category = EXCLUDED.category,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at = EXCLUDED.compare_at,
  stock = EXCLUDED.stock,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  badge = EXCLUDED.badge,
  highlights = EXCLUDED.highlights,
  specs = EXCLUDED.specs,
  use_cases = EXCLUDED.use_cases,
  updated_at = now();

-- Verify the products were inserted
SELECT 
  slug, 
  name, 
  price, 
  stock, 
  category,
  CASE WHEN badge IS NOT NULL THEN badge ELSE 'No badge' END as badge_status
FROM products 
ORDER BY category, name;

-- Count products by category
SELECT 
  category,
  COUNT(*) as product_count,
  SUM(stock) as total_stock,
  AVG(price)::numeric(10,2) as avg_price
FROM products 
GROUP BY category 
ORDER BY category;

-- Success message
SELECT '✅ All products restored to shop! Visit /products to see them.' as result;