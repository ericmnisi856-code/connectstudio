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
  compareAt: z.union([z.number().min(0), z.string()]).optional().nullable().transform(val => {
    if (typeof val === 'string') return val === '' ? undefined : Number(val);
    return val;
  }),
  stock: z.number().int().min(0),
  rating: z.number().min(0).max(5),
  reviews: z.number().int().min(0),
  badge: z.union([z.string(), z.null(), z.undefined()]).optional().transform(val => val === '' ? undefined : val),
  image: z.union([z.string(), z.null(), z.undefined()]).optional().transform(val => val === '' ? undefined : val),
  highlights: z.array(z.string()).default([]),
  specs: z.union([
    z.array(z.object({
      label: z.string(),
      value: z.string(),
    })),
    z.any()
  ]).transform(val => {
    if (Array.isArray(val)) return val;
    return [];
  }).default([]),
  useCases: z.array(z.string()).default([]),
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
  .validator((rawData) => {
    console.log("[Products] Raw data received:", JSON.stringify(rawData, null, 2));
    try {
      const result = productSchema.parse(rawData);
      console.log("[Products] Validation passed:", JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error("[Products] Validation failed:", error);
      throw error;
    }
  })
  .handler(async ({ data }) => {
    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("[Products] Creating product with data:", JSON.stringify(data, null, 2));

    // Create database object with snake_case field names manually
    const dbData = {
      slug: data.slug,
      name: data.name,
      model: data.model,
      category: data.category,
      tagline: data.tagline,
      description: data.description,
      price: data.price,
      compare_at: data.compareAt,
      stock: data.stock,
      rating: data.rating,
      reviews: data.reviews,
      badge: data.badge,
      image: data.image,
      highlights: data.highlights,
      specs: data.specs,
      use_cases: data.useCases,
    };

    console.log("[Products] DB data:", JSON.stringify(dbData, null, 2));

    const { data: product, error } = await supabase
      .from("products")
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error("[Products] Create error:", error);
      throw new Error("Failed to create product: " + error.message);
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

    // Create database object with snake_case field names manually
    const dbUpdates: any = {};
    if (data.updates.slug !== undefined) dbUpdates.slug = data.updates.slug;
    if (data.updates.name !== undefined) dbUpdates.name = data.updates.name;
    if (data.updates.model !== undefined) dbUpdates.model = data.updates.model;
    if (data.updates.category !== undefined) dbUpdates.category = data.updates.category;
    if (data.updates.tagline !== undefined) dbUpdates.tagline = data.updates.tagline;
    if (data.updates.description !== undefined) dbUpdates.description = data.updates.description;
    if (data.updates.price !== undefined) dbUpdates.price = data.updates.price;
    if (data.updates.compareAt !== undefined) dbUpdates.compare_at = data.updates.compareAt;
    if (data.updates.stock !== undefined) dbUpdates.stock = data.updates.stock;
    if (data.updates.rating !== undefined) dbUpdates.rating = data.updates.rating;
    if (data.updates.reviews !== undefined) dbUpdates.reviews = data.updates.reviews;
    if (data.updates.badge !== undefined) dbUpdates.badge = data.updates.badge;
    if (data.updates.image !== undefined) dbUpdates.image = data.updates.image;
    if (data.updates.highlights !== undefined) dbUpdates.highlights = data.updates.highlights;
    if (data.updates.specs !== undefined) dbUpdates.specs = data.updates.specs;
    if (data.updates.useCases !== undefined) dbUpdates.use_cases = data.updates.useCases;

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
