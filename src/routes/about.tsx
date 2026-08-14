import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Studio Connect — Authorised Ruijie Reyee Partner" },
      {
        name: "description",
        content:
          "Studio Connect is a Johannesburg-based network integrator and authorised Ruijie Reyee partner, deploying cloud-managed networks since 2016.",
      },
      { property: "og:title", content: "About Studio Connect" },
      {
        property: "og:description",
        content: "Johannesburg network integrator and authorised Ruijie Reyee partner since 2016.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative bg-brand-gradient">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
          style={{ backgroundImage: "url('/images/WhatsApp Image 2026-08-13 at 11.25.38 AM (1).jpeg')" }}
          aria-hidden="true" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-primary-foreground sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/70">
            About
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
            We've been quietly keeping South African networks up since 2016
          </h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-5 text-muted-foreground">
          <p>
            Studio Connect started as a two-person cabling outfit in Parktown. Ten years on we're an
            authorised Ruijie Reyee partner with a permanent field team, a Johannesburg NOC and more
            than 1 400 live sites under management.
          </p>
          <p>
            We only sell hardware we're prepared to stand behind on site at 2am. That's why the
            catalogue is deliberately narrow: three Reyee product lines, specified properly, rather
            than a warehouse of brands nobody supports.
          </p>
          <p>
            Every deployment ends the same way — a handover pack, a topology diagram, credentials
            you own, and a support number that a human answers.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-6">
          {[
            ["2016", "Founded in Johannesburg"],
            ["1 400+", "Sites deployed"],
            ["24", "Field & NOC engineers"],
            ["99.98%", "Managed uptime"],
            ["5", "Provinces covered"],
            ["3 yr", "Standard warranty"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-border/70 bg-card p-6">
              <dt className="font-display text-3xl font-bold text-gradient">{value}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/70 bg-surface px-8 py-14 text-center">
          <h2 className="font-display text-3xl font-bold">Work with us</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Whether it's one router or a hundred branches, the process starts the same way.
          </p>
          <Button asChild size="lg" className="mt-7 bg-emerald-gradient text-primary-foreground hover:opacity-90">
            <Link to="/contact">Get in touch</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
