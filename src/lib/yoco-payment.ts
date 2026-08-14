/**
 * Yoco Payment Gateway Integration
 * Documentation: https://developer.yoco.com/online/
 */

export interface YocoPaymentOptions {
  amountInCents: number;
  currency: string;
  metadata?: Record<string, string | number>;
}

export interface YocoCheckoutOptions {
  publicKey: string;
  amountInCents: number;
  currency: string;
  name: string;
  description: string;
  metadata?: Record<string, string | number>;
  callback: (result: YocoPaymentResult) => void;
}

export interface YocoPaymentResult {
  id: string;
  status: "successful" | "failed" | "cancelled";
  createdDate?: string;
  currency?: string;
  amount?: number;
  metadata?: Record<string, string | number>;
}

declare global {
  interface Window {
    YocoSDK?: {
      popup: (options: YocoCheckoutOptions) => void;
    };
  }
}

/**
 * Load Yoco SDK script - Robust version with extended timeouts
 */
export function loadYocoSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log('[Yoco] Starting SDK load...');
    
    // Check if already loaded
    if (window.YocoSDK) {
      console.log('[Yoco] SDK already available');
      resolve();
      return;
    }

    // Check if script is already in DOM
    let existingScript = document.querySelector('script[src*="yoco-sdk-web"]') as HTMLScriptElement;
    
    if (!existingScript) {
      // Create and load the script
      console.log('[Yoco] Creating script tag...');
      const script = document.createElement("script");
      script.src = "https://js.yoco.com/sdk/v1/yoco-sdk-web.js";
      script.async = false; // Load synchronously to avoid timing issues
      script.crossOrigin = "anonymous";
      
      script.onerror = () => {
        console.error('[Yoco] Script failed to load from CDN');
        reject(new Error('Failed to load Yoco SDK script from CDN'));
      };
      
      document.head.appendChild(script);
      existingScript = script;
      console.log('[Yoco] Script tag added to DOM');
    } else {
      console.log('[Yoco] Script tag already exists in DOM');
    }

    // Wait for SDK to become available with extended timeout
    const startTime = Date.now();
    const maxWait = 30000; // 30 seconds
    const checkInterval = 100; // Check every 100ms
    
    const checker = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      if (window.YocoSDK) {
        console.log(`[Yoco] SDK loaded successfully after ${elapsed}ms`);
        clearInterval(checker);
        // Give it an extra moment to fully initialize
        setTimeout(() => resolve(), 200);
        return;
      }
      
      if (elapsed > maxWait) {
        console.error(`[Yoco] SDK not available after ${elapsed}ms`);
        clearInterval(checker);
        reject(new Error(`Yoco SDK timeout after ${maxWait}ms. Check your internet connection.`));
      } else if (elapsed % 2000 === 0) {
        // Log progress every 2 seconds
        console.log(`[Yoco] Still waiting for SDK... (${elapsed}ms)`);
      }
    }, checkInterval);
  });
}

/**
 * Initialize Yoco checkout popup
 */
export async function initializeYocoCheckout(options: {
  amountInCents: number;
  description: string;
  metadata?: Record<string, string | number>;
  onSuccess: (result: YocoPaymentResult) => void;
  onError: (error: Error) => void;
  onCancel?: () => void;
}): Promise<void> {
  try {
    console.log('[Yoco] Initializing checkout...');
    console.log('[Yoco] Amount:', options.amountInCents, 'cents (R' + (options.amountInCents / 100) + ')');
    
    // Load SDK with extended timeout
    console.log('[Yoco] Loading SDK...');
    await loadYocoSDK();
    console.log('[Yoco] SDK load complete');

    if (!window.YocoSDK) {
      throw new Error("Yoco SDK is not available after loading. Please refresh the page and try again.");
    }

    const publicKey = import.meta.env['VITE_YOCO_PUBLIC_KEY'];
    console.log('[Yoco] Public key present:', !!publicKey);
    console.log('[Yoco] Public key starts with:', publicKey?.substring(0, 10));
    
    if (!publicKey) {
      throw new Error("Yoco payment gateway is not configured. Please contact support.");
    }

    console.log('[Yoco] Opening payment popup...');
    console.log('[Yoco] Details:', {
      amountInCents: options.amountInCents,
      currency: 'ZAR',
      description: options.description,
    });

    // Open Yoco payment popup
    window.YocoSDK.popup({
      publicKey,
      amountInCents: options.amountInCents,
      currency: "ZAR",
      name: "Studio Connect",
      description: options.description,
      ...(options.metadata ? { metadata: options.metadata } : {}),
      callback: (result: YocoPaymentResult) => {
        console.log('[Yoco] Payment callback received:', result.status);
        
        if (result.status === "successful") {
          console.log('[Yoco] Payment successful!');
          options.onSuccess(result);
        } else if (result.status === "failed") {
          console.error('[Yoco] Payment failed');
          options.onError(new Error("Payment failed. Please try again or use a different card."));
        } else if (result.status === "cancelled") {
          console.log('[Yoco] Payment cancelled by user');
          options.onCancel?.();
        }
      },
    });
    
    console.log('[Yoco] Popup opened successfully');
  } catch (error) {
    console.error('[Yoco] Initialization error:', error);
    options.onError(error as Error);
  }
}

/**
 * Format amount to cents for Yoco (R1.00 = 100 cents)
 */
export function toCents(amountInRands: number): number {
  return Math.round(amountInRands * 100);
}

/**
 * Format cents to rands
 */
export function toRands(amountInCents: number): number {
  return amountInCents / 100;
}

/**
 * Server-side function to create a Yoco charge
 * This should be called from your server function
 */
export async function createYocoCharge(options: {
  token: string;
  amountInCents: number;
  currency: string;
  metadata?: Record<string, string | number>;
}): Promise<{ id: string; status: string }> {
  const secretKey = process.env['YOCO_SECRET_KEY'];
  
  if (!secretKey) {
    throw new Error("Yoco secret key not configured");
  }

  const response = await fetch("https://online.yoco.com/v1/charges/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      token: options.token,
      amountInCents: options.amountInCents,
      currency: options.currency,
      metadata: options.metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Payment charge failed");
  }

  return response.json();
}
