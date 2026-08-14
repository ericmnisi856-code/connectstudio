import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductVisual } from "@/components/product-visual";
import { YocoHostedPaymentButton } from "@/components/yoco-hosted-payment-button";
import { YocoLogo } from "@/components/yoco-logo";
import { formatZAR } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { buildOrderItems, generateOrderId } from "@/lib/orders";
import { placeOrder } from "@/lib/orders.functions";


const checkoutSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().optional(),
  address: z.string().min(5, "Please enter your delivery address"),
  city: z.string().min(2, "Please enter your city"),
  province: z.string().min(2, "Please enter your province"),
  postalCode: z.string().min(4, "Please enter a valid postal code"),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export const Route = createFileRoute("/checkout/")({
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
  component: CheckoutFormPage,
});

function CheckoutFormPage() {
  const { items, subtotal, vat, shipping, total, clear } = useCart();
  const navigate = useNavigate();
  const submitOrder = useServerFn(placeOrder);
  const [isProcessingOrder, setIsProcessingOrder] = React.useState(false);

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      notes: "",
    },
  });

  // Save order data to sessionStorage before payment
  async function handlePaymentInitiated() {
    // Validate form first
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fill in all required fields correctly");
      return false;
    }

    setIsProcessingOrder(true);
    const values = form.getValues();

    const orderId = generateOrderId();
    const order = {
      orderId,
      createdAt: new Date().toISOString(),
      status: "pending" as const,
      customer: values,
      items: buildOrderItems(items),
      subtotal,
      vat,
      shipping,
      total,
      paymentMethod: "yoco",
    };

    // Save order to sessionStorage (will be submitted after successful payment)
    sessionStorage.setItem("pendingOrder", JSON.stringify(order));
    
    console.log("[Checkout] Order saved, redirecting to Yoco...", orderId);
    return true;
  }

  const hasFilledRequiredFields = Boolean(
    form.watch("fullName") &&
    form.watch("email") &&
    form.watch("phone") &&
    form.watch("address") &&
    form.watch("city") &&
    form.watch("province") &&
    form.watch("postalCode")
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link to="/cart">
            <ArrowLeft className="size-5" />
            <span className="sr-only">Back to cart</span>
          </Link>
        </Button>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">Checkout</h1>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <Form {...form}>
          <form className="space-y-8">
            <section className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold">Contact details</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@company.co.za" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+27 82 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Company name (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Networks (Pty) Ltd" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold">Delivery address</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Street address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="123 Main Street, Building 4" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Johannesburg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input placeholder="Gauteng" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal code</FormLabel>
                      <FormControl>
                        <Input placeholder="2194" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-border/70 bg-card p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold">Additional information</h2>
              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Installation deadline, preferred courier, or any special requirements..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    <span className="text-sm font-medium">Secure payment by</span>
                  </div>
                  <YocoLogo className="h-8 w-auto text-primary" />
                </div>
                
                <YocoHostedPaymentButton
                  amount={total}
                  description={`Studio Connect Order - ${items.length} item(s)`}
                  metadata={{
                    orderType: "network-hardware",
                    itemCount: items.length,
                    customerEmail: form.watch("email") || "pending",
                  }}
                  onInitiated={handlePaymentInitiated}
                  disabled={isProcessingOrder || !hasFilledRequiredFields}
                  className="w-full bg-orange-gradient text-primary-foreground hover:opacity-90"
                />
                
                <p className="mt-3 text-xs text-muted-foreground text-center">
                  💳 Complete your details above, then click to securely pay with Yoco
                </p>
                
                {isProcessingOrder && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Preparing your payment...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Button variant="ghost" asChild>
                <Link to="/cart">Return to cart</Link>
              </Button>
            </div>
          </form>
        </Form>

        <aside className="h-fit">
          <OrderSummary />
        </aside>
      </div>
    </div>
  );
}

function OrderSummary() {
  const { items, subtotal, vat, shipping, total } = useCart();

  return (
    <div className="rounded-2xl border border-border/70 bg-surface p-7">
      <h2 className="text-lg font-semibold">Order summary</h2>
      <ul className="mt-6 space-y-4">
        {items.map(({ product, qty }) => (
          <li key={product.slug} className="flex gap-4">
            <div className="relative shrink-0 overflow-hidden rounded-xl bg-card">
              <ProductVisual product={product} className="size-16" />
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-emerald-gradient text-[10px] font-semibold text-primary-foreground">
                {qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.model}</p>
              <p className="mt-1 text-sm font-semibold">{formatZAR(product.price * qty)}</p>
            </div>
          </li>
        ))}
      </ul>
      <Separator className="my-5" />
      <dl className="space-y-3 text-sm">
        <Row label="Subtotal" value={formatZAR(subtotal)} />
        <Row label="VAT (15%)" value={formatZAR(vat)} />
        <Row label="Delivery" value={shipping === 0 ? "Free" : formatZAR(shipping)} />
      </dl>
      <Separator className="my-5" />
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">Total</span>
        <span className="font-display text-2xl font-bold">{formatZAR(total)}</span>
      </div>
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
