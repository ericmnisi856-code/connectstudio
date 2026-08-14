import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const orderItemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  model: z.string().min(1),
  price: z.number().int().nonnegative(),
  qty: z.number().int().positive().max(999),
});

const placeOrderSchema = z.object({
  orderNumber: z.string().min(3).max(40),
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(6).max(40),
  company: z.string().max(160).optional(),
  address: z.string().min(5).max(400),
  city: z.string().min(2).max(120),
  province: z.string().min(2).max(120),
  postalCode: z.string().min(4).max(20),
  notes: z.string().max(2000).optional(),
  items: z.array(orderItemSchema).min(1).max(100),
  subtotal: z.number().int().nonnegative(),
  vat: z.number().int().nonnegative(),
  shipping: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
});

const statusSchema = z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]);

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => placeOrderSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await publicClient()
      .from("orders")
      .insert({
        order_number: data.orderNumber,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        company: data.company ?? null,
        address: data.address,
        city: data.city,
        province: data.province,
        postal_code: data.postalCode,
        notes: data.notes ?? null,
        items: data.items,
        subtotal: data.subtotal,
        vat: data.vat,
        shipping: data.shipping,
        total: data.total,
      });

    if (error) throw new Error("We could not save your order. Please try again.");
    return { ok: true, orderNumber: data.orderNumber };
  });

export const getIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Hardcoded super admin emails - always have admin access
    const SUPER_ADMINS = [
      'ericmnisi856@gmail.com',
      'accounts@connectstudio.co.za'
    ];
    
    // Get user email from context
    const { data: { user } } = await context.supabase.auth.getUser();
    const userEmail = user?.email?.toLowerCase();
    
    // Check if user is a super admin (bypasses database check)
    if (userEmail && SUPER_ADMINS.includes(userEmail)) {
      return { isAdmin: true };
    }
    
    // Otherwise check database role
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: Boolean(data) };
  });

export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), status: statusSchema }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);

    if (error) throw new Error(error.message);
    return { ok: true };
  });
