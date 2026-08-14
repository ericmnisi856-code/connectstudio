import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { placeOrder } from "@/lib/orders.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({
    meta: [
      { title: "Payment Successful | Studio Connect" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { clear } = useCart();
  const submitOrder = useServerFn(placeOrder);
  const [processing, setProcessing] = React.useState(true);
  const [orderNumber, setOrderNumber] = React.useState<string>("");

  React.useEffect(() => {
    async function processOrder() {
      try {
        const pendingOrderData = sessionStorage.getItem("pendingOrder");
        
        if (!pendingOrderData) {
          toast.error("No order data found");
          navigate({ to: "/checkout" });
          return;
        }

        const orderData = JSON.parse(pendingOrderData);
        
        await submitOrder({
          data: {
            orderNumber: orderData.orderId,
            fullName: orderData.customer.fullName,
            email: orderData.customer.email,
            phone: orderData.customer.phone,
            ...(orderData.customer.company ? { company: orderData.customer.company } : {}),
            address: orderData.customer.address,
            city: orderData.customer.city,
            province: orderData.customer.province,
            postalCode: orderData.customer.postalCode,
            ...(orderData.customer.notes ? { notes: orderData.customer.notes } : {}),
            items: orderData.items,
            subtotal: orderData.subtotal,
            vat: orderData.vat,
            shipping: orderData.shipping,
            total: orderData.total,
            paymentId: "yoco_hosted",
          },
        });

        setOrderNumber(orderData.orderId);
        clear();
        sessionStorage.removeItem("pendingOrder");
        setProcessing(false);
        toast.success("Order placed successfully!");
      } catch (error) {
        console.error("Error:", error);
        setProcessing(false);
      }
    }

    processOrder();
  }, [clear, submitOrder, navigate]);

  if (processing) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <p className="mt-6 text-lg">Processing...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <div className="rounded-2xl border bg-card p-8 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="size-10 text-green-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Payment Successful!</h1>
        <p className="mt-3 text-lg">Order #{orderNumber}</p>
        <Button asChild className="mt-8">
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    </div>
  );
}
