import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatZAR, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { ProductVisual } from "@/components/product-visual";
import { triggerCartConfetti } from "@/components/cart-sheet";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleAddToCart = () => {
    add(product.slug);
    triggerCartConfetti(buttonRef.current || undefined);
  };

  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden bg-surface"
      >
        <ProductVisual product={product} className="aspect-4/3 w-full" />
        {product.badge && (
          <Badge className="absolute left-3 top-3 bg-emerald-gradient text-primary-foreground">
            {product.badge}
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">
          {product.model}
        </p>
        <h3 className="mt-1.5 text-base font-semibold leading-snug">
          <Link to="/products/$slug" params={{ slug: product.slug }} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviews})</span>
          <span aria-hidden="true">·</span>
          <span>{product.stock > 0 ? `${product.stock} in stock` : "Backorder"}</span>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold">{formatZAR(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-muted-foreground line-through">
                {formatZAR(product.compareAt)}
              </span>
            )}
          </div>
          <Button
            ref={buttonRef}
            onClick={handleAddToCart}
            className="mt-3 w-full bg-emerald-gradient text-primary-foreground hover:opacity-90"
          >
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}
