import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const productSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  model: z.string().min(1),
  category: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().int().min(0),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  specs: z.record(z.string()).optional(),
});

type Product = z.infer<typeof productSchema> & { id?: string };

/**
 * Get all products from Supabase
 */
export const getProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Products] Fetch error:", error);
      throw new Error("Failed to fetch products");
    }

    return data || [];
  });

/**
 * Create a new product (admin only)
 */
export const createProduct = createServerFn({ method: "POST" })
  .validator(productSchema)
  .handler(async ({ data }) => {
    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: product, error } = await supabase
      .from("products")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("[Products] Create error:", error);
      throw new Error("Failed to create product");
    }

    return product;
  });

/**
 * Update an existing product (admin only)
 */
export const updateProduct = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string().uuid(),
    updates: productSchema.partial(),
  }))
  .handler(async ({ data }) => {
    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: product, error } = await supabase
      .from("products")
      .update(data.updates)
      .eq("id", data.id)
      .select()
      .single();

    if (error) {
      console.error("[Products] Update error:", error);
      throw new Error("Failed to update product");
    }

    return product;
  });

/**
 * Delete a product (admin only)
 */
export const deleteProduct = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", data.id);

    if (error) {
      console.error("[Products] Delete error:", error);
      throw new Error("Failed to delete product");
    }

    return { success: true };
  });
