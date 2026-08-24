import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Yoco Hosted Checkout API Integration
 * Uses Yoco's secure hosted checkout flow (no SDK required)
 */

const createCheckoutSchema = z.object({
  amountInCents: z.number().int().positive(),
  metadata: z.record(z.union([z.string(), z.number()])).optional(),
});

/**
 * Create a Yoco checkout session and return the redirect URL
 */
export const createYocoCheckout = createServerFn({ method: "POST" })
  .validator((input: unknown) => createCheckoutSchema.parse(input))
  .handler(async ({ data }) => {
    const secretKey = process.env["YOCO_SECRET_KEY"];
    
    if (!secretKey) {
      throw new Error("Yoco secret key not configured on server");
    }

    const baseUrl = process.env["VITE_APP_URL"] || "http://localhost:8081";

    try {
      console.log("[Yoco] Creating checkout session:", {
        amount: data.amountInCents,
        currency: "ZAR",
      });

      const response = await fetch("https://payments.yoco.com/api/checkouts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: data.amountInCents,
          currency: "ZAR",
          successUrl: `${baseUrl}/checkout/success`,
          cancelUrl: `${baseUrl}/checkout`,
          failureUrl: `${baseUrl}/checkout`,
          metadata: {
            ...data.metadata,
            source: "studio-connect-shop",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Yoco] API Error:", response.status, errorText);
        throw new Error(`Yoco API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log("[Yoco] Checkout session created:", {
        id: result.id,
        redirectUrl: result.redirectUrl,
      });

      return {
        success: true,
        checkoutId: result.id,
        redirectUrl: result.redirectUrl,
      };
    } catch (error) {
      console.error("[Yoco] Checkout creation failed:", error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : "Failed to create Yoco checkout session"
      );
    }
  });

/**
 * Webhook handler for Yoco payment notifications
 * This endpoint should be registered in Yoco dashboard
 */
export const handleYocoWebhook = createServerFn({ method: "POST" })
  .handler(async ({ request }) => {
    const secretKey = process.env["YOCO_SECRET_KEY"];
    
    if (!secretKey) {
      throw new Error("Yoco secret key not configured");
    }

    try {
      const payload = await request.json();
      
      console.log("[Yoco Webhook] Received:", {
        type: payload.type,
        id: payload.id,
      });

      // Verify webhook signature (if Yoco provides one)
      // TODO: Implement signature verification when available

      // Handle different webhook events
      switch (payload.type) {
        case "checkout.succeeded":
        case "payment.succeeded":
          console.log("[Yoco Webhook] Payment successful:", payload.id);
          // TODO: Update order status in database
          // await updateOrderStatus(payload.metadata.orderId, "paid");
          break;
          
        case "checkout.failed":
        case "payment.failed":
          console.log("[Yoco Webhook] Payment failed:", payload.id);
          // TODO: Update order status in database
          // await updateOrderStatus(payload.metadata.orderId, "failed");
          break;
          
        default:
          console.log("[Yoco Webhook] Unknown event type:", payload.type);
      }

      return { received: true };
    } catch (error) {
      console.error("[Yoco Webhook] Error:", error);
      throw error;
    }
  });
