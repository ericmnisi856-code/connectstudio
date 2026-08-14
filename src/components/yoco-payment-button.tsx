import * as React from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { initializeYocoCheckout, toCents, type YocoPaymentResult } from "@/lib/yoco-payment";

interface YocoPaymentButtonProps {
  amount: number; // Amount in ZAR
  description: string;
  metadata?: Record<string, string | number>;
  onSuccess: (result: YocoPaymentResult) => void | Promise<void>;
  onError?: (error: Error) => void;
  disabled?: boolean;
  className?: string;
}

export function YocoPaymentButton({
  amount,
  description,
  metadata,
  onSuccess,
  onError,
  disabled,
  className,
}: YocoPaymentButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handlePayment() {
    setIsLoading(true);

    try {
      console.log('Initializing Yoco payment...', {
        amount,
        amountInCents: toCents(amount),
        description,
      });

      await initializeYocoCheckout({
        amountInCents: toCents(amount),
        description,
        ...(metadata ? { metadata } : {}),
        onSuccess: async (result) => {
          console.log('Payment successful:', result);
          setIsLoading(false);
          toast.success("Payment successful!");
          await onSuccess(result);
        },
        onError: (error) => {
          console.error('Payment error:', error);
          setIsLoading(false);
          toast.error(error.message || "Payment failed. Please try again.");
          onError?.(error);
        },
        onCancel: () => {
          console.log('Payment cancelled');
          setIsLoading(false);
          toast.info("Payment cancelled");
        },
      });
    } catch (error) {
      console.error('Failed to initialize payment:', error);
      setIsLoading(false);
      const err = error as Error;
      toast.error(err.message || "Failed to initialize payment");
      onError?.(err);
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
          Processing...
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
