import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

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
  .handler(async (ctx) => {
    const rawData = await ctx.request.json();
    console.log("[Products] Raw data received:", JSON.stringify(rawData, null, 2));
    
    // Extract data from wrapper if present
    const data = rawData.data || rawData;
    console.log("[Products] Extracted data:", JSON.stringify(data, null, 2));

    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ensure specs and useCases are arrays
    let specs = data.specs || [];
    let useCases = data.useCases || [];
    
    // If specs is an object, convert to empty array
    if (specs && !Array.isArray(specs)) {
      console.log("[Products] Converting specs from object to array");
      specs = [];
    }
    
    // If useCases is an object, convert to empty array
    if (useCases && !Array.isArray(useCases)) {
      console.log("[Products] Converting useCases from object to array");
      useCases = [];
    }

    // Create database object with snake_case field names manually
    const dbData = {
      slug: data.slug,
      name: data.name,
      model: data.model,
      category: data.category,
      tagline: data.tagline,
      description: data.description,
      price: Number(data.price),
      compare_at: data.compareAt ? Number(data.compareAt) : null,
      stock: Number(data.stock),
      rating: Number(data.rating),
      reviews: Number(data.reviews),
      badge: data.badge || null,
      image: data.image || null,
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      specs: specs,
      use_cases: useCases,
    };

    console.log("[Products] DB data to insert:", JSON.stringify(dbData, null, 2));

    const { data: product, error } = await supabase
      .from("products")
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error("[Products] Create error:", error);
      throw new Error("Failed to create product: " + error.message);
    }

    console.log("[Products] Product created successfully:", product);
    return toCamelCase(product);
  });

/**
 * Update an existing product (admin only)
 */
export const updateProduct = createServerFn({ method: "POST" })
  .handler(async (ctx) => {
    const rawData = await ctx.request.json();
    const { id, updates } = rawData.data || rawData;

    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create database object with snake_case field names manually
    const dbUpdates: any = {};
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.model !== undefined) dbUpdates.model = updates.model;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.tagline !== undefined) dbUpdates.tagline = updates.tagline;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.compareAt !== undefined) dbUpdates.compare_at = updates.compareAt;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
    if (updates.reviews !== undefined) dbUpdates.reviews = updates.reviews;
    if (updates.badge !== undefined) dbUpdates.badge = updates.badge;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.highlights !== undefined) dbUpdates.highlights = Array.isArray(updates.highlights) ? updates.highlights : [];
    if (updates.specs !== undefined) dbUpdates.specs = Array.isArray(updates.specs) ? updates.specs : [];
    if (updates.useCases !== undefined) dbUpdates.use_cases = Array.isArray(updates.useCases) ? updates.useCases : [];

    const { data: product, error } = await supabase
      .from("products")
      .update(dbUpdates)
      .eq("id", id)
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
  .handler(async (ctx) => {
    const rawData = await ctx.request.json();
    const { id } = rawData.data || rawData;

    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[Products] Delete error:", error);
      throw new Error("Failed to delete product");
    }

    return { success: true };
  });
