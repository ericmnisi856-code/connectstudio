import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal, Sparkles, Truck, ShieldCheck, Zap } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card";
import { categories, products, type Category } from "@/lib/catalog";
import type { ProductSearch } from "./products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Shop Ruijie Reyee Routers & Gateways | Studio Connect" },
      {
        name: "description",
        content:
          "Browse the full Ruijie Reyee range: EG cloud gateways, Wi-Fi 6 mesh routers and NBR security routers, in stock with nationwide delivery and installation.",
      },
      { property: "og:title", content: "Shop Ruijie Reyee Routers | Studio Connect" },
      {
        property: "og:description",
        content: "EG gateways, Wi-Fi 6 routers and NBR security routers, in stock and cloud-ready.",
      },
    ],
  }),
  component: ProductsPage,
});

const perks = [
  { icon: Truck, label: "Nationwide delivery", detail: "1–3 working days" },
  { icon: ShieldCheck, label: "Local warranty", detail: "Up to 3 years" },
  { icon: Zap, label: "Cloud-ready", detail: "Ruijie Cloud included" },
];

function ProductsPage() {
  const { category, sort = "featured", q = "" } = useSearch({ from: "/products" });
  const navigate = useNavigate({ from: "/products/" });
  const [query, setQuery] = React.useState(q);

  React.useEffect(() => setQuery(q), [q]);

  const list = React.useMemo(() => {
    let items = products.filter((p) => (category ? p.category === category : true));
    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      items = items.filter((p) =>
        [p.name, p.model, p.tagline, ...p.useCases].join(" ").toLowerCase().includes(needle),
      );
    }
    const sorted = [...items];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [category, query, sort]);

  const active = categories.find((c) => c.id === category);
  const marquee = [...products, ...products];

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border/60 bg-brand-gradient">
        <div 
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
          style={{ backgroundImage: "url('/images/WhatsApp Image 2026-08-13 at 11.25.38 AM (2).jpeg')" }}
          aria-hidden="true" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" aria-hidden="true" />
        <div
          className="orb-drift pointer-events-none absolute -left-24 -top-32 size-[26rem] rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-emerald)" }}
          aria-hidden="true"
        />
        <div
          className="orb-drift pointer-events-none absolute -bottom-40 right-0 size-[30rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-sheen)", animationDelay: "-6s" }}
          aria-hidden="true"
        />
        <div className="grid-noise pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 text-primary-foreground sm:px-6 lg:px-8">
          <span
            className="rise-in inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest backdrop-blur"
            style={{ animationDelay: "40ms" }}
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            {products.length} models in stock
          </span>

          <h1
            className="rise-in mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-6xl"
            style={{ animationDelay: "120ms" }}
          >
            {active ? active.name : "The full Reyee range"}
          </h1>
          <p
            className="rise-in mt-5 max-w-2xl text-lg text-primary-foreground/80"
            style={{ animationDelay: "200ms" }}
          >
            {active
              ? active.blurb
              : "Every commercial Ruijie Reyee router we stock — cloud-managed, warrantied and available with professional installation."}
          </p>

          <div className="rise-in mt-10 grid gap-3 sm:grid-cols-3" style={{ animationDelay: "280ms" }}>
            {perks.map((perk) => (
              <div
                key={perk.label}
                className="flex items-center gap-3 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
              >
                <perk.icon className="size-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">{perk.label}</p>
                  <p className="text-xs text-primary-foreground/70">{perk.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex overflow-hidden border-t border-primary-foreground/15 py-3">
          <div className="marquee-track flex shrink-0 gap-8 whitespace-nowrap pr-8">
            {marquee.map((p, i) => (
              <span
                key={`${p.slug}-${i}`}
                className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/60"
              >
                {p.model}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="sticky top-16 z-20 -mx-4 rounded-2xl border border-border/70 bg-card/80 px-4 py-4 backdrop-blur-xl sm:mx-0 sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterChip active={!category} label="All products" />
              {categories.map((c) => (
                <FilterChip key={c.id} active={category === c.id} category={c.id} label={c.short} />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() =>
                    navigate({
                      search: (prev: ProductSearch) => ({ ...prev, q: query || undefined }),
                      replace: true,
                    })
                  }
                  placeholder="Search model or use case"
                  className="pl-9 transition-shadow duration-300 focus-visible:shadow-glow"
                  aria-label="Search products"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <SlidersHorizontal className="size-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Sort</span>
                <select
                  value={sort}
                  onChange={(e) =>
                    navigate({
                      search: (prev: ProductSearch) => ({
                        ...prev,
                        sort: e.target.value as ProductSearch["sort"],
                      }),
                    })
                  }
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{list.length}</span> of{" "}
          {products.length} products
        </p>

        {list.length === 0 ? (
          <div className="rise-in mt-16 rounded-2xl border border-dashed border-border p-16 text-center">
            <h2 className="text-lg font-semibold">No matches</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different model number or clear your filters.
            </p>
            <Button asChild variant="outline" className="mt-6">
              <Link to="/products" search={{}}>
                Clear filters
              </Link>
            </Button>
          </div>
        ) : (
          <div
            key={`${category ?? "all"}-${sort}-${query}`}
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {list.map((p, i) => (
              <div
                key={p.slug}
                className="rise-in sheen-on-hover rounded-2xl"
                style={{ animationDelay: `${Math.min(i, 9) * 70}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FilterChip({
  active,
  category,
  label,
}: {
  active: boolean;
  category?: Category;
  label: string;
}) {
  return (
    <Link
      to="/products"
      search={(prev: ProductSearch) => ({ ...prev, category })}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5",
        active
          ? "border-transparent bg-emerald-gradient text-primary-foreground shadow-glow"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
