import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, Network } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet, triggerCartConfetti } from "@/components/cart-sheet";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/products", label: "Shop" },
  { to: "/solutions", label: "Solutions" },
  { to: "/services", label: "Services" },
  { to: "/support", label: "Support" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { count, setOnAddToCart } = useCart();
  const [open, setOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const cartButtonRef = React.useRef<HTMLButtonElement>(null);

  // Set up confetti + cart open when items are added
  React.useEffect(() => {
    setOnAddToCart(() => {
      triggerCartConfetti(cartButtonRef.current || undefined);
      setTimeout(() => setCartOpen(true), 300);
    });
  }, [setOnAddToCart]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img 
            src="/images/logo.png" 
            alt="Studio Connect" 
            className="h-20 w-auto object-contain rounded-lg transition-transform hover:scale-105 shadow-sm"
          />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild aria-label="Search products">
            <Link to="/products">
              <Search className="size-5" />
            </Link>
          </Button>
          <Button
            ref={cartButtonRef}
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="View cart"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-emerald-gradient text-[11px] font-semibold text-primary-foreground animate-in zoom-in">
                {count}
              </span>
            )}
          </Button>
          <Button asChild className="hidden bg-emerald-gradient text-primary-foreground shadow-glow hover:opacity-90 sm:inline-flex">
            <Link to="/contact">Get a quote</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-10 flex flex-col gap-1">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
