export type Category = "eg" | "wireless" | "nbr";

export type Product = {
  slug: string;
  name: string;
  model: string;
  category: Category;
  tagline: string;
  description: string;
  price: number;
  compareAt?: number;
  stock: number;
  rating: number;
  reviews: number;
  badge?: string;
  image?: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  useCases: string[];
};

export const categories: {
  id: Category;
  name: string;
  short: string;
  blurb: string;
  audience: string;
}[] = [
  {
    id: "eg",
    name: "EG Series Gateways",
    short: "EG Series",
    blurb:
      "Cloud-managed all-in-one gateways with integrated AC controller, PoE and behaviour management for SMEs and multi-branch rollouts.",
    audience: "Offices, retail chains, hospitality",
  },
  {
    id: "wireless",
    name: "Reyee Wireless Routers",
    short: "Wireless Routers",
    blurb:
      "Wi-Fi 5 and Wi-Fi 6 mesh-ready routers with self-organising networking, one-touch pairing and Reyee Router app control.",
    audience: "Home, home office, small shops",
  },
  {
    id: "nbr",
    name: "NBR Security Routers",
    short: "NBR Security",
    blurb:
      "Next-generation firewall routers with behaviour auditing, multi-WAN load balancing, VPN concentration and deep application control.",
    audience: "Enterprise HQ, campuses, ISPs",
  },
];

export const products: Product[] = [
  {
    slug: "rg-eg105g-v2",
    name: "Reyee EG105G-V2 Cloud Gateway",
    model: "RG-EG105G-V2",
    category: "eg",
    tagline: "5-port desktop cloud gateway for up to 100 clients",
    description:
      "A compact, fanless cloud-managed gateway that routes, firewalls and controls up to 100 concurrent clients while doubling as an AC controller for up to 100 Reyee access points. Managed end-to-end from Ruijie Cloud or the Reyee app.",
    price: 2199,
    compareAt: 2599,
    stock: 42,
    rating: 4.8,
    reviews: 126,
    badge: "Best seller",
    highlights: [
      "Built-in AC controller for up to 100 Reyee APs",
      "600 Mbps routing throughput, 1500 sessions",
      "Ruijie Cloud remote management and alerting",
      "Behaviour management, VPN and smart flow control",
    ],
    specs: [
      { label: "Ports", value: "5 × 10/100/1000 Base-T (WAN/LAN configurable)" },
      { label: "Recommended clients", value: "100" },
      { label: "Throughput", value: "600 Mbps" },
      { label: "AP management", value: "Up to 100 APs" },
      { label: "VPN", value: "IPsec, L2TP, PPTP" },
      { label: "Power", value: "12V DC external adapter" },
    ],
    useCases: ["Small office", "Coffee shop", "Branch site"],
  },
  {
    slug: "rg-eg105gw-t",
    name: "Reyee EG105GW-T Wireless Cloud Gateway",
    model: "RG-EG105GW-T",
    category: "eg",
    tagline: "Gateway and AC1300 dual-band AP in one enclosure",
    description:
      "Combines the EG105G routing engine with an integrated AC1300 dual-band radio, so a single unit covers routing, firewalling, AP control and Wi-Fi for a small site.",
    price: 2899,
    stock: 28,
    rating: 4.7,
    reviews: 84,
    highlights: [
      "Integrated AC1300 dual-band Wi-Fi",
      "Cloud-managed routing plus AP controller",
      "Zero-touch provisioning from Ruijie Cloud",
      "Guest network with captive portal",
    ],
    specs: [
      { label: "Ports", value: "5 × Gigabit (WAN/LAN configurable)" },
      { label: "Wi-Fi", value: "802.11ac Wave 2, AC1300" },
      { label: "Recommended clients", value: "100" },
      { label: "Throughput", value: "600 Mbps" },
      { label: "Mounting", value: "Desktop / wall" },
      { label: "Power", value: "12V DC" },
    ],
    useCases: ["Home office", "Small retail", "Clinic"],
  },
  {
    slug: "rg-eg210g-p-e",
    name: "Reyee EG210G-P-E PoE Cloud Gateway",
    model: "RG-EG210G-P-E",
    category: "eg",
    tagline: "10-port PoE gateway for CCTV and AP deployments",
    description:
      "Eight PoE/PoE+ ports with a 110W budget let this gateway power IP cameras and access points directly, while managing up to 200 clients and 100 APs from the cloud.",
    price: 6499,
    compareAt: 7250,
    stock: 17,
    rating: 4.9,
    reviews: 63,
    badge: "CCTV ready",
    highlights: [
      "8 × PoE/PoE+ ports, 110W total budget",
      "Powers cameras and APs without extra injectors",
      "200 concurrent clients, 1.5 Gbps throughput",
      "One-click CCTV network templates",
    ],
    specs: [
      { label: "Ports", value: "8 × Gigabit PoE + 2 × Gigabit uplink" },
      { label: "PoE budget", value: "110W" },
      { label: "Recommended clients", value: "200" },
      { label: "Throughput", value: "1.5 Gbps" },
      { label: "AP management", value: "Up to 100 APs" },
      { label: "Form factor", value: "1U rack mountable" },
    ],
    useCases: ["CCTV network", "Guesthouse", "Warehouse"],
  },
  {
    slug: "rg-eg310gh-p-e",
    name: "Reyee EG310GH-P-E Cloud Gateway",
    model: "RG-EG310GH-P-E",
    category: "eg",
    tagline: "High-density PoE gateway for 300+ clients",
    description:
      "A rack-mount gateway built for busy multi-branch sites: multi-WAN load balancing, 300 client capacity, and a 130W PoE budget for downstream devices.",
    price: 9899,
    stock: 11,
    rating: 4.8,
    reviews: 41,
    highlights: [
      "Multi-WAN failover and load balancing",
      "130W PoE budget across 8 ports",
      "300 concurrent clients, 2 Gbps throughput",
      "Application-aware bandwidth shaping",
    ],
    specs: [
      { label: "Ports", value: "8 × Gigabit PoE + 2 × Gigabit SFP/RJ45" },
      { label: "PoE budget", value: "130W" },
      { label: "Recommended clients", value: "300" },
      { label: "Throughput", value: "2 Gbps" },
      { label: "VPN tunnels", value: "128 IPsec" },
      { label: "Form factor", value: "1U rack" },
    ],
    useCases: ["Multi-branch HQ", "Hotel", "School"],
  },
  {
    slug: "rg-ew1200g-pro",
    name: "Reyee EW1200G PRO Mesh Router",
    model: "RG-EW1200G PRO",
    category: "wireless",
    tagline: "AC1300 dual-band mesh router with Reyee Mesh pairing",
    description:
      "An affordable dual-band mesh router that pairs with any Reyee Mesh node in one press. Ideal starter node for homes and small offices needing reliable coverage.",
    price: 1249,
    compareAt: 1499,
    stock: 96,
    rating: 4.6,
    reviews: 312,
    badge: "Value pick",
    highlights: [
      "AC1300 dual-band, 4 external antennas",
      "Reyee Mesh one-touch pairing",
      "Up to 64 concurrent clients",
      "Reyee Router app + cloud management",
    ],
    specs: [
      { label: "Wi-Fi", value: "802.11ac, 400 Mbps @2.4G + 867 Mbps @5G" },
      { label: "Ports", value: "1 × WAN + 4 × LAN Gigabit" },
      { label: "Clients", value: "64" },
      { label: "Antennas", value: "4 × 5 dBi external" },
      { label: "Mesh", value: "Reyee Mesh, up to 5 nodes" },
      { label: "Coverage", value: "Up to 120 m²" },
    ],
    useCases: ["Apartment", "Home office", "Small shop"],
  },
  {
    slug: "rg-ew3200gx-pro",
    name: "Reyee EW3200GX PRO Wi-Fi 6 Router",
    model: "RG-EW3200GX PRO",
    category: "wireless",
    tagline: "AX3200 Wi-Fi 6 gaming-grade mesh router",
    description:
      "Wi-Fi 6 with 2.4 Gbps on 5 GHz, a dedicated game acceleration engine and a 1.5 GHz quad-core processor. Mesh-ready and cloud managed.",
    price: 2549,
    stock: 54,
    rating: 4.9,
    reviews: 228,
    badge: "Wi-Fi 6",
    highlights: [
      "AX3200 with OFDMA and MU-MIMO",
      "Quad-core 1.5 GHz processor",
      "Game acceleration and QoS priority lanes",
      "Reyee Mesh with up to 5 nodes",
    ],
    specs: [
      { label: "Wi-Fi", value: "802.11ax, 800 Mbps @2.4G + 2402 Mbps @5G" },
      { label: "Ports", value: "1 × WAN + 3 × LAN Gigabit" },
      { label: "Clients", value: "128" },
      { label: "Processor", value: "Quad-core 1.5 GHz" },
      { label: "Antennas", value: "4 × high-gain external" },
      { label: "Coverage", value: "Up to 200 m²" },
    ],
    useCases: ["Large home", "Gaming", "Creative studio"],
  },
  {
    slug: "rg-ew6000gx-pro",
    name: "Reyee EW6000GX PRO Wi-Fi 6 Router",
    model: "RG-EW6000GX PRO",
    category: "wireless",
    tagline: "AX6000 flagship Wi-Fi 6 with 2.5G WAN",
    description:
      "The flagship Reyee wireless router: AX6000 tri-stream Wi-Fi 6, a 2.5 Gbps WAN port and eight amplified antennas for whole-property coverage.",
    price: 4399,
    compareAt: 4899,
    stock: 23,
    rating: 4.9,
    reviews: 97,
    highlights: [
      "AX6000 with 160 MHz channels",
      "2.5 Gbps WAN for fibre plans above 1 Gbps",
      "8 amplified antennas with beamforming",
      "Seamless roaming across mesh nodes",
    ],
    specs: [
      { label: "Wi-Fi", value: "802.11ax, 1148 Mbps @2.4G + 4804 Mbps @5G" },
      { label: "Ports", value: "1 × 2.5G WAN + 4 × Gigabit LAN" },
      { label: "Clients", value: "256" },
      { label: "Antennas", value: "8 × external" },
      { label: "Mesh", value: "Reyee Mesh, up to 5 nodes" },
      { label: "Coverage", value: "Up to 300 m²" },
    ],
    useCases: ["Double-storey home", "Boutique hotel", "Studio"],
  },
  {
    slug: "rg-nbr6210-e",
    name: "Reyee NBR6210-E Security Router",
    model: "RG-NBR6210-E",
    category: "nbr",
    tagline: "Enterprise security router for 300 users",
    description:
      "Next-generation firewall routing with behaviour auditing, application control and multi-WAN balancing for enterprises that need visibility as much as throughput.",
    price: 11999,
    stock: 9,
    rating: 4.7,
    reviews: 38,
    highlights: [
      "Deep application identification and control",
      "Behaviour auditing with exportable reports",
      "Multi-WAN load balancing and failover",
      "Built-in AC for up to 128 APs",
    ],
    specs: [
      { label: "Ports", value: "2 × WAN + 3 × WAN/LAN Gigabit" },
      { label: "Recommended users", value: "300" },
      { label: "Throughput", value: "1.5 Gbps" },
      { label: "Sessions", value: "300,000" },
      { label: "VPN", value: "IPsec / L2TP / PPTP / SSL" },
      { label: "Form factor", value: "1U rack" },
    ],
    useCases: ["Enterprise HQ", "Campus", "Co-working"],
  },
  {
    slug: "rg-nbr6215-e",
    name: "Reyee NBR6215-E Security Router",
    model: "RG-NBR6215-E",
    category: "nbr",
    tagline: "500-user security gateway with 500k sessions",
    description:
      "Scales the NBR platform to 500 concurrent users with 500,000 sessions, hardened firewalling and granular per-application policy.",
    price: 17499,
    compareAt: 18990,
    stock: 6,
    rating: 4.8,
    reviews: 24,
    badge: "Enterprise",
    highlights: [
      "500 users, 500,000 concurrent sessions",
      "Intrusion prevention and DoS protection",
      "Bandwidth policy per user, group or app",
      "Hot-standby dual-machine redundancy",
    ],
    specs: [
      { label: "Ports", value: "5 × Gigabit configurable + 1 × SFP" },
      { label: "Recommended users", value: "500" },
      { label: "Throughput", value: "2 Gbps" },
      { label: "Sessions", value: "500,000" },
      { label: "AP management", value: "Up to 256 APs" },
      { label: "Form factor", value: "1U rack" },
    ],
    useCases: ["Large campus", "Hospital", "Manufacturing"],
  },
  {
    slug: "rg-nbr6135-e",
    name: "Reyee NBR6135-E Security Router",
    model: "RG-NBR6135-E",
    category: "nbr",
    tagline: "High-capacity router for 1000+ users and ISPs",
    description:
      "Built for service providers and large campuses: 1000+ concurrent users, 1,000,000 sessions and carrier-grade routing with full behaviour analytics.",
    price: 28999,
    stock: 4,
    rating: 4.9,
    reviews: 15,
    highlights: [
      "1000+ users, 1,000,000 sessions",
      "Carrier-grade multi-WAN aggregation",
      "Full traffic analytics and audit trail",
      "Dual power supply option",
    ],
    specs: [
      { label: "Ports", value: "8 × Gigabit configurable + 2 × SFP" },
      { label: "Recommended users", value: "1000+" },
      { label: "Throughput", value: "4 Gbps" },
      { label: "Sessions", value: "1,000,000" },
      { label: "VPN tunnels", value: "1000 IPsec" },
      { label: "Form factor", value: "1U rack" },
    ],
    useCases: ["ISP edge", "University", "Data centre edge"],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatZAR(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}
