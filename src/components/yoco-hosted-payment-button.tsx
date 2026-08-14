import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createYocoCheckout } from "@/lib/yoco-hosted-checkout.functions";

interface YocoHostedPaymentButtonProps {
  amount: number; // Amount in ZAR
  description?: string;
  metadata?: Record<string, string | number>;
  onInitiated?: () => Promise<boolean> | boolean;
  disabled?: boolean;
  className?: string;
}

export function YocoHostedPaymentButton({
  amount,
  description,
  metadata,
  onInitiated,
  disabled,
  className,
}: YocoHostedPaymentButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const createCheckout = useServerFn(createYocoCheckout);

  async function handlePayment() {
    try {
      // Call onInitiated callback if provided (for form validation, etc.)
      if (onInitiated) {
        const canProceed = await onInitiated();
        if (!canProceed) {
          return;
        }
      }

      setIsLoading(true);

      const amountInCents = Math.round(amount * 100);
      
      console.log("[Yoco Hosted] Initiating payment:", {
        amount,
        amountInCents,
        description,
        metadata,
      });

      const result = await createCheckout({
        data: {
          amountInCents,
          metadata: {
            ...metadata,
            description: description || "Payment",
          },
        },
      });

      if (!result.redirectUrl) {
        throw new Error("No redirect URL received from Yoco");
      }

      console.log("[Yoco Hosted] Redirecting to:", result.redirectUrl);
      
      // Redirect to Yoco hosted checkout page
      window.location.href = result.redirectUrl;
    } catch (error) {
      console.error("[Yoco Hosted] Payment error:", error);
      setIsLoading(false);
      toast.error(
        error instanceof Error 
          ? error.message 
          : "Failed to initiate payment. Please try again."
      );
    }
  }

  return (
    <Button
      type="button"
      size="lg"
      onClick={handlePayment}
      disabled={disabled || isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Redirecting to payment...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 size-4" />
          Pay with Card
        </>
      )}
    </Button>
  );
}
