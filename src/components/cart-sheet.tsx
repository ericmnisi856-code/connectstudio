import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import confetti from "canvas-confetti";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ProductVisual } from "@/components/product-visual";
import { formatZAR } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, count, subtotal, vat, shipping, total, setQty, remove } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            Shopping Cart
            {count > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">
                {count} {count === 1 ? "item" : "items"}
              </span>
            )}
          </SheetTitle>
          <SheetDescription>
            {count > 0
              ? "Review your items and proceed to checkout"
              : "Your cart is empty"}
          </SheetDescription>
        </SheetHeader>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10">
            <div className="rounded-full bg-muted p-6">
              <ShoppingBag className="size-12 text-muted-foreground" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              No items in your cart yet.
              <br />
              Start shopping to add products!
            </p>
            <SheetClose asChild>
              <Button asChild className="bg-emerald-gradient">
                <Link to="/products">Browse Products</Link>
              </Button>
            </SheetClose>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-4">
                {items.map(({ product, qty }) => (
                  <li
                    key={product.slug}
                    className="flex gap-4 rounded-lg border border-border/50 bg-surface/50 p-3"
                  >
                    <div className="relative shrink-0 overflow-hidden rounded-lg bg-card">
                      <ProductVisual product={product} className="size-20" />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                      <p className="truncate text-xs text-muted-foreground">{product.model}</p>
                      <p className="mt-1 text-sm font-bold text-primary">
                        {formatZAR(product.price)}
                      </p>

                      <div className="mt-auto flex items-center gap-2">
                        <div className="flex items-center rounded-md border border-border/50">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => setQty(product.slug, qty - 1)}
                            disabled={qty <= 1}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{qty}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => setQty(product.slug, qty + 1)}
                            disabled={qty >= 99}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => remove(product.slug)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="space-y-3 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatZAR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VAT (15%)</span>
                <span className="font-medium">{formatZAR(vat)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : formatZAR(shipping)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-display text-xl font-bold text-primary">
                  {formatZAR(total)}
                </span>
              </div>
            </div>

            <SheetFooter className="gap-2 sm:gap-2">
              <SheetClose asChild>
                <Button variant="outline" className="flex-1">
                  Continue Shopping
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="flex-1 bg-emerald-gradient shadow-glow">
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Confetti effect for add to cart
export function triggerCartConfetti(element?: HTMLElement) {
  const rect = element?.getBoundingClientRect();
  const x = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
  const y = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.3;

  // Burst from button
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { x, y },
    colors: ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa"],
    ticks: 120,
  });

  // Small delayed burst
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x, y },
      colors: ["#ea580c", "#fb923c", "#fed7aa"],
      ticks: 100,
    });
  }, 150);
}
