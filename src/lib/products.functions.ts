import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const productSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  model: z.string().min(1),
  category: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  compareAt: z.number().min(0).optional(),
  stock: z.number().int().min(0),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0),
  badge: z.string().optional(),
  image: z.string().optional(),
  highlights: z.array(z.string()),
  specs: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })),
  useCases: z.array(z.string()),
});

type Product = z.infer<typeof productSchema> & { id?: string };

// Transform camelCase to snake_case for database
function toSnakeCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj;
  if (typeof obj !== 'object') return obj;
  
  const result: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[snakeKey] = obj[key];
  }
  return result;
}

// Transform snake_case to camelCase from database
function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj;
  if (typeof obj !== 'object') return obj;
  
  const result: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
}

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

    // Transform from snake_case to camelCase
    return (data || []).map((product: any) => toCamelCase(product));
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

    // Transform from camelCase to snake_case
    const dbData = toSnakeCase(data);

    const { data: product, error } = await supabase
      .from("products")
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error("[Products] Create error:", error);
      throw new Error("Failed to create product");
    }

    return toCamelCase(product);
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

    // Transform from camelCase to snake_case
    const dbUpdates = toSnakeCase(data.updates);

    const { data: product, error } = await supabase
      .from("products")
      .update(dbUpdates)
      .eq("id", data.id)
      .select()
      .single();

    if (error) {
      console.error("[Products] Update error:", error);
      throw new Error("Failed to update product");
    }

    return toCamelCase(product);
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
