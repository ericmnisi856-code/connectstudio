import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Camera, Hotel, Store, Home, Network } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/solutions")({
  head: () => ({
    meta: [
      { title: "Network Solutions by Industry | Studio Connect" },
      {
        name: "description",
        content:
          "Reyee network blueprints for SMEs, multi-branch retail, CCTV, hospitality and home offices — sized, costed and installed by Studio Connect.",
      },
      { property: "og:title", content: "Network Solutions by Industry | Studio Connect" },
      {
        property: "og:description",
        content: "Reference designs for SME, retail, CCTV, hospitality and home networks.",
      },
    ],
  }),
  component: SolutionsPage,
});

const solutions = [
  {
    icon: Building2,
    name: "SME & multi-branch",
    problem: "Every branch is configured differently and nobody can see the whole estate.",
    answer:
      "Standardise on EG cloud gateways with a single Ruijie Cloud tenant, template-driven configs and site-to-site IPsec back to head office.",
    kit: ["RG-EG210G-P-E", "RG-EG310GH-P-E", "RG-NBR6210-E"],
  },
  {
    icon: Camera,
    name: "CCTV networks",
    problem: "Camera fleets outgrow injectors and cabling budgets.",
    answer:
      "PoE gateways power cameras directly with headroom for growth, and VLAN templates keep video traffic isolated from staff data.",
    kit: ["RG-EG210G-P-E", "RG-EG310GH-P-E"],
  },
  {
    icon: Store,
    name: "Retail",
    problem: "Guest Wi-Fi competes with card machines and stock terminals.",
    answer:
      "Application-aware shaping prioritises POS traffic while captive-portal guest SSIDs stay fully isolated.",
    kit: ["RG-EG105G-V2", "RG-EW3200GX PRO"],
  },
  {
    icon: Hotel,
    name: "Hospitality",
    problem: "Rooms at the far end of the property drop connections.",
    answer:
      "Per-floor AP density modelled from your floor plan, with seamless roaming and per-room bandwidth caps.",
    kit: ["RG-EG310GH-P-E", "RG-EW6000GX PRO"],
  },
  {
    icon: Home,
    name: "Home & home office",
    problem: "One router can't cover a double-storey home or a fibre line above 1 Gbps.",
    answer:
      "Wi-Fi 6 mesh with 2.5G WAN and one-touch pairing, tuned during installation for your actual layout.",
    kit: ["RG-EW1200G PRO", "RG-EW6000GX PRO"],
  },
  {
    icon: Network,
    name: "Campus & ISP edge",
    problem: "Thousands of sessions and no visibility into who is using what.",
    answer:
      "NBR security routers deliver behaviour auditing, multi-WAN aggregation and million-session capacity with full reporting.",
    kit: ["RG-NBR6215-E", "RG-NBR6135-E"],
  },
];

function SolutionsPage() {
  return (
    <>
      <section className="relative bg-brand-gradient">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
          style={{ backgroundImage: "url('/images/WhatsApp Image 2026-08-13 at 11.25.38 AM.jpeg')" }}
          aria-hidden="true" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-primary-foreground sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/70">
            Solutions
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
            Reference designs for the sites we deploy most
          </h1>
          <p className="mt-5 max-w-2xl text-primary-foreground/80">
            Each blueprint below is a real deployment pattern — the constraint, the fix and the kit
            list we specify against it.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        {solutions.map((s) => (
          <article
            key={s.name}
            className="card-lift flex flex-col rounded-2xl border border-border/70 bg-card p-7"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent">
              <s.icon className="size-6 text-primary" aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-lg font-semibold">{s.name}</h2>
            <p className="mt-3 text-sm font-medium text-foreground">{s.problem}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.answer}</p>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Typical kit
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{s.kit.join(" · ")}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/70 bg-surface px-8 py-14 text-center">
          <h2 className="font-display text-3xl font-bold">Not sure which blueprint fits?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Book a free site survey and we'll model coverage, PoE load and session capacity before
            you spend a cent.
          </p>
          <Button asChild size="lg" className="mt-7 bg-emerald-gradient text-primary-foreground hover:opacity-90">
            <Link to="/services">See our services</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
