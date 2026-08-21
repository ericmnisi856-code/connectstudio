import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, Star, Truck } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductVisual } from "@/components/product-visual";
import { ProductCard } from "@/components/product-card";
import { formatZAR } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

type Product = any; // Use any for now since products come from API

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }): Promise<{ product: Product | null }> => {
    try {
      const response = await fetch('/api/products/list');
      if (!response.ok) return { product: null };
      const products = await response.json();
      const product = products.find((p: any) => p.slug === params.slug);
      if (!product) throw notFound();
      return { product };
    } catch (error) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData || !loaderData.product) {
      return {
        meta: [{ title: "Product not found | Studio Connect" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} (${product.model}) | Studio Connect`;
    return {
      meta: [
        { title },
        { name: "description", content: (product.description || '').slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: product.tagline || '' },
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <h1 className="font-display text-3xl font-bold">Product not found</h1>
      <p className="mt-3 text-muted-foreground">That model isn't in our catalogue.</p>
      <Button asChild className="mt-6 bg-emerald-gradient text-primary-foreground">
        <Link to="/products" search={{}}>
          Back to shop
        </Link>
      </Button>
    </div>
  ),
});

function ProductDetail() {
  const loaderData = Route.useLoaderData();
  const product = loaderData?.product;
  
  // Fetch all products for related products
  const { data: allProducts = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch('/api/products/list');
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { add } = useCart();
  const [qty, setQty] = React.useState(1);

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Product not found</h1>
        <p className="mt-3 text-muted-foreground">That model isn't in our catalogue.</p>
        <Button asChild className="mt-6 bg-emerald-gradient text-primary-foreground">
          <Link to="/products" search={{}}>
            Back to shop
          </Link>
        </Button>
      </div>
    );
  }

  const related = allProducts
    .filter((p: any) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          to="/products"
          search={{}}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to shop
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="group overflow-hidden rounded-3xl border border-border/70">
          <ProductVisual product={product} className="aspect-square w-full" />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              {product.model}
            </p>
            {product.badge && (
              <Badge className="bg-emerald-gradient text-primary-foreground">{product.badge}</Badge>
            )}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{product.tagline}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < Math.round(product.rating || 0)
                      ? "size-4 fill-primary text-primary"
                      : "size-4 text-muted-foreground/40"
                  }
                />
              ))}
            </span>
            <span className="font-medium">{product.rating || 0}</span>
            <span className="text-muted-foreground">({product.reviews || 0} reviews)</span>
          </div>

          <div className="mt-7 flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold">{formatZAR(product.price)}</span>
            {product.compareAt && (
              <span className="text-lg text-muted-foreground line-through">
                {formatZAR(product.compareAt)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Excludes VAT. Free delivery over R5 000.</p>

          <ul className="mt-7 space-y-2.5">
            {(product.highlights || []).map((h: string) => (
              <li key={h} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-input">
              <button
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                className="px-3 py-2.5 text-muted-foreground hover:text-foreground"
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((v) => v + 1)}
                className="px-3 py-2.5 text-muted-foreground hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 bg-emerald-gradient text-primary-foreground hover:opacity-90 sm:flex-none"
              onClick={() => {
                add(product.slug, qty);
                toast.success(`${product.model} added to cart`);
              }}
            >
              Add to cart
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Request a quote</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface p-4 text-sm">
              <Truck className="size-5 text-primary" aria-hidden="true" />
              <span>Dispatch in 24 hours · {product.stock} in stock</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface p-4 text-sm">
              <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
              <span>3-year Ruijie warranty</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="deploy">Deployment</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-6">
            <p className="max-w-3xl leading-relaxed text-muted-foreground">{product.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {(product.useCases || []).map((u: string) => (
                <Badge key={u} variant="secondary">
                  {u}
                </Badge>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="specs" className="pt-6">
            <dl className="max-w-3xl divide-y divide-border rounded-2xl border border-border/70">
              {(product.specs || []).map((s: any) => (
                <div key={s.label} className="grid gap-1 px-5 py-4 sm:grid-cols-3">
                  <dt className="text-sm font-medium text-muted-foreground">{s.label}</dt>
                  <dd className="text-sm sm:col-span-2">{s.value}</dd>
                </div>
              ))}
            </dl>
          </TabsContent>
          <TabsContent value="deploy" className="pt-6">
            <ol className="max-w-3xl space-y-4">
              {[
                "We pre-stage the configuration and bind the device to your Ruijie Cloud tenant.",
                "Our engineers install, cable and label on site, then verify throughput and coverage.",
                "You receive a handover pack with topology diagrams, credentials and the support SLA.",
                "Optional 24/7 monitoring keeps an eye on WAN health, PoE load and client counts.",
              ].map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-gradient text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm text-muted-foreground">{step}</p>
                </li>
              ))}
            </ol>
          </TabsContent>
        </Tabs>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Separator className="mb-12" />
          <h2 className="font-display text-2xl font-bold">Related hardware</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p: any) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
