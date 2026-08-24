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
    // Try multiple environment variable formats
    const secretKey = process.env["YOCO_SECRET_KEY"] || 
                     process.env["VITE_YOCO_SECRET_KEY"] ||
                     import.meta.env?.YOCO_SECRET_KEY;
    
    console.log("[Yoco] Secret key check:", {
      hasKey: !!secretKey,
      keyPrefix: secretKey ? secretKey.substring(0, 8) + '...' : 'missing',
      envVars: {
        YOCO_SECRET_KEY: !!process.env["YOCO_SECRET_KEY"],
        VITE_YOCO_SECRET_KEY: !!process.env["VITE_YOCO_SECRET_KEY"],
      }
    });
    
    if (!secretKey) {
      throw new Error("Yoco secret key not configured on server");
    }

    const baseUrl = process.env["VITE_APP_URL"] || "http://localhost:8081";

    try {
      // Generate a short unique order reference (max 50 chars for Yoco)
      // Format: ORDER-{timestamp}-{random} = ORDER-1234567890123-ABC (max 23 chars)
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
      const orderReference = `ORDER-${timestamp}-${randomSuffix}`;

      console.log("[Yoco] Creating checkout session:", {
        amount: data.amountInCents,
        currency: "ZAR",
        orderReference,
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
          orderReference: orderReference,
          successUrl: `${baseUrl}/checkout/success`,
          cancelUrl: `${baseUrl}/checkout`,
          failureUrl: `${baseUrl}/checkout`,
          metadata: {
            ...data.metadata,
            source: "studio-connect-shop",
            orderRef: orderReference,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Yoco] API Error:", response.status, errorText);
        
        // Parse error details if available
        let errorMessage = `Yoco API error: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.message) {
            errorMessage = errorJson.message;
          }
        } catch {
          errorMessage += ` ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      console.log("[Yoco] Checkout session created:", {
        id: result.id,
        orderReference,
        redirectUrl: result.redirectUrl,
      });

      return {
        success: true,
        checkoutId: result.id,
        orderReference,
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
