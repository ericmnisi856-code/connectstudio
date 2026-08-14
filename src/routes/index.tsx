import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Cloud,
  ShieldCheck,
  Wifi,
  Zap,
  Building2,
  Camera,
  Hotel,
  Store,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { categories, products } from "@/lib/catalog";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio Connect — Ruijie Reyee Cloud Routers & Network Solutions" },
      {
        name: "description",
        content:
          "Buy Ruijie Reyee EG gateways, Wi-Fi 6 routers and NBR security routers with expert installation, cloud management and nationwide support across South Africa.",
      },
      { property: "og:title", content: "Studio Connect — Ruijie Reyee Cloud Routers & Network Solutions" },
      {
        property: "og:description",
        content:
          "Buy Ruijie Reyee EG gateways, Wi-Fi 6 routers and NBR security routers with expert installation, cloud management and nationwide support across South Africa.",
      },
    ],
  }),
  component: Home,
});

const pillars = [
  {
    icon: Cloud,
    title: "Cloud-managed by default",
    body: "Every device ships onto Ruijie Cloud with zero-touch provisioning, remote diagnostics and proactive alerting.",
  },
  {
    icon: ShieldCheck,
    title: "Security you can audit",
    body: "NBR-class firewalling, application control and behaviour auditing with exportable compliance reports.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi that actually roams",
    body: "Reyee Mesh and self-organising networking keep clients on the strongest radio without dropped sessions.",
  },
  {
    icon: Zap,
    title: "Deployed in days, not weeks",
    body: "Pre-staged configurations, PoE-powered rollouts and a national installation team on standby.",
  },
];

const verticals = [
  { icon: Building2, name: "SME & multi-branch", copy: "Standardised gateways across every site." },
  { icon: Camera, name: "CCTV networks", copy: "PoE budgets sized for camera fleets." },
  { icon: Store, name: "Retail", copy: "Guest Wi-Fi, POS isolation and uptime SLAs." },
  { icon: Hotel, name: "Hospitality", copy: "Per-room capacity and captive portals." },
];

function Home() {
  const featured = products.filter((p) => p.badge).slice(0, 4);
  const productSection = useScrollAnimation();
  const featuredSection = useScrollAnimation();
  const verticalSection = useScrollAnimation();
  const ctaSection = useScrollAnimation();

  return (
    <>
      <section className="relative overflow-hidden bg-brand-gradient">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
          style={{ backgroundImage: "url('/images/WhatsApp Image 2026-08-13 at 11.25.37 AM.jpeg')" }}
          aria-hidden="true" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" aria-hidden="true" />
        <div className="absolute inset-0 grid-noise opacity-20" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-32 lg:px-8">
          <div className="text-primary-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-medium backdrop-blur">
              <span className="size-1.5 rounded-full bg-primary-glow" aria-hidden="true" />
              Authorised Ruijie Reyee partner · South Africa
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Networks that run themselves.
              <span className="block opacity-80">Hardware that never blinks.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              Studio Connect supplies, installs and manages the full Ruijie Reyee commercial router
              line — EG cloud gateways, Wi-Fi 6 routers and NBR security routers — for offices,
              branches, CCTV networks, retail and hospitality.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                <Link to="/products">
                  Shop the range <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/services">Book a site survey</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-primary-foreground/20 pt-8">
              {[
                ["1 400+", "sites deployed"],
                ["99.98%", "managed uptime"],
                ["4 hr", "priority response"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-display text-2xl font-bold sm:text-3xl">{value}</dt>
                  <dd className="mt-1 text-xs text-primary-foreground/70">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur-xl">
              <div className="grid gap-4 sm:grid-cols-2">
                {pillars.map((p) => (
                  <div
                    key={p.title}
                    className="rounded-2xl border border-primary-foreground/10 bg-background/95 p-5"
                  >
                    <p.icon className="size-6 text-primary" aria-hidden="true" />
                    <h2 className="mt-3 text-sm font-semibold">{p.title}</h2>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div 
          ref={productSection.elementRef}
          className={`transition-all duration-1000 ${
            productSection.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Three product lines</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Pick the platform that matches your site — every one of them is cloud-managed from the
              same console.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link to="/products">
              View all products <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/products"
              search={{ category: c.id }}
              className="card-lift group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-7"
            >
              <span
                className="absolute inset-x-0 top-0 h-1 bg-emerald-gradient"
                aria-hidden="true"
              />
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                {c.audience}
              </p>
              <h3 className="mt-3 text-xl font-semibold">{c.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
              <span className="mt-6 inline-flex items-center text-sm font-medium text-primary">
                Browse {c.short}
                <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div 
          ref={featuredSection.elementRef}
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            featuredSection.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Featured hardware</h2>
          <p className="mt-2 text-muted-foreground">
            The models our engineers specify most often this quarter.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div 
          ref={verticalSection.elementRef}
          className={`grid gap-12 lg:grid-cols-2 lg:items-center transition-all duration-1000 ${
            verticalSection.isVisible 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-10"
          }`}
        >
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Built for the environments you actually run
            </h2>
            <p className="mt-4 text-muted-foreground">
              We design around the constraint that matters on your site — PoE budget for cameras,
              per-room density for hotels, session counts for campuses, or clean guest isolation for
              retail floors.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Pre-staged configuration before hardware ships",
                "Structured cabling, mounting and labelling included",
                "Handover pack with topology, credentials and SLAs",
                "Optional 24/7 monitoring from our Johannesburg NOC",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 bg-emerald-gradient text-primary-foreground hover:opacity-90">
              <Link to="/solutions">Explore solutions</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {verticals.map((v) => (
              <div key={v.name} className="card-lift rounded-2xl border border-border/70 bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent">
                  <v.icon className="size-5 text-primary" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{v.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div 
          ref={ctaSection.elementRef}
          className={`relative overflow-hidden rounded-3xl bg-brand-gradient px-8 py-16 text-center text-primary-foreground sm:px-16 transition-all duration-1000 ${
            ctaSection.isVisible 
              ? "opacity-100 scale-100" 
              : "opacity-0 scale-95"
          }`}
        >
          <div className="absolute inset-0 grid-noise opacity-20" aria-hidden="true" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Tell us about your site. We'll spec it.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
              Send us your floor plan, camera count or user numbers and our engineers return a
              costed bill of materials within two business days.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
                <Link to="/contact">Request a quote</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/support">Talk to support</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
