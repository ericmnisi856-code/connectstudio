import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { PackageCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Studio Connect" },
      {
        name: "description",
        content: "Complete your Ruijie Reyee hardware order with secure checkout.",
      },
      { property: "og:title", content: "Checkout | Studio Connect" },
      { property: "og:description", content: "Complete your Reyee hardware order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CheckoutLayout,
});

function CheckoutLayout() {
  const { count } = useCart();

  // Guard: checkout only makes sense with items in the cart.
  if (count === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold">Checkout</h1>
        <div className="mt-12 rounded-2xl border border-dashed border-border p-16 text-center">
          <PackageCheck className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Add some Reyee hardware before checking out.
          </p>
          <Button asChild className="mt-6 bg-emerald-gradient text-primary-foreground hover:opacity-90">
            <Link to="/products" search={{}}>
              Shop products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
