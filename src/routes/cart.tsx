import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductVisual } from "@/components/product-visual";
import { formatZAR } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Studio Connect" },
      {
        name: "description",
        content: "Review your Ruijie Reyee hardware order and continue to secure checkout.",
      },
      { property: "og:title", content: "Your Cart | Studio Connect" },
      { property: "og:description", content: "Review your Reyee hardware order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal, vat, shipping, total, clear } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold">Your cart</h1>

      {items.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-16 text-center">
          <ShoppingCart className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold">Nothing here yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse the Reyee range and add the hardware you need.
          </p>
          <Button asChild className="mt-6 bg-emerald-gradient text-primary-foreground hover:opacity-90">
            <Link to="/products" search={{}}>
              Shop products
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <ul className="space-y-4">
            {items.map(({ product, qty }) => (
              <li
                key={product.slug}
                className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:flex-row sm:items-center"
              >
                <Link
                  to="/products/$slug"
                  params={{ slug: product.slug }}
                  className="group w-full shrink-0 overflow-hidden rounded-xl sm:w-36"
                >
                  <ProductVisual product={product} className="aspect-4/3 w-full" />
                </Link>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-widest text-primary">
                    {product.model}
                  </p>
                  <h2 className="mt-1 text-base font-semibold">
                    <Link to="/products/$slug" params={{ slug: product.slug }} className="hover:underline">
                      {product.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{formatZAR(product.price)} each</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-lg border border-input">
                    <button
                      onClick={() => setQty(product.slug, qty - 1)}
                      className="px-2.5 py-2 text-muted-foreground hover:text-foreground"
                      aria-label={`Decrease quantity of ${product.model}`}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{qty}</span>
                    <button
                      onClick={() => setQty(product.slug, qty + 1)}
                      className="px-2.5 py-2 text-muted-foreground hover:text-foreground"
                      aria-label={`Increase quantity of ${product.model}`}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <span className="w-28 text-right font-display font-semibold">
                    {formatZAR(product.price * qty)}
                  </span>
                  <button
                    onClick={() => remove(product.slug)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Remove ${product.model} from cart`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-border/70 bg-surface p-7">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <dl className="mt-6 space-y-3 text-sm">
              <Row label="Subtotal" value={formatZAR(subtotal)} />
              <Row label="VAT (15%)" value={formatZAR(vat)} />
              <Row label="Delivery" value={shipping === 0 ? "Free" : formatZAR(shipping)} />
            </dl>
            <Separator className="my-5" />
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="font-display text-2xl font-bold">{formatZAR(total)}</span>
            </div>
            <Button
              asChild
              size="lg"
              className="mt-6 w-full bg-emerald-gradient text-primary-foreground hover:opacity-90"
            >
              <Link to="/checkout">Proceed to checkout</Link>
            </Button>
            <Button asChild variant="outline" className="mt-3 w-full">
              <Link to="/products" search={{}}>
                Continue shopping
              </Link>
            </Button>
            <button
              onClick={clear}
              className="mt-4 w-full text-xs text-muted-foreground hover:text-destructive"
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
