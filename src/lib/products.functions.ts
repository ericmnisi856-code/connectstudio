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
 * Create a new product (admin only) - FIXED VERSION
 */
export const createProductNew = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    try {
      console.log("[Products] Processing product data:", JSON.stringify(data, null, 2));

      const supabaseUrl = process.env["SUPABASE_URL"];
      const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase credentials");
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Ensure arrays are arrays, not objects
      let specs: { label: string; value: string }[] = [];
      let useCases: string[] = [];
      let highlights: string[] = [];

      if (data.specs && Array.isArray(data.specs)) {
        specs = data.specs.filter((s: any) => s && s.label && s.value);
      }
      
      if (data.useCases && Array.isArray(data.useCases)) {
        useCases = data.useCases.filter((u: any) => u && u.trim());
      }
      
      if (data.highlights && Array.isArray(data.highlights)) {
        highlights = data.highlights.filter((h: any) => h && h.trim());
      }

      // Create database object with snake_case field names
      const dbData = {
        slug: String(data.slug || ''),
        name: String(data.name || ''),
        model: String(data.model || ''),
        category: String(data.category || ''),
        tagline: String(data.tagline || ''),
        description: String(data.description || ''),
        price: Number(data.price) || 0,
        compare_at: data.compareAt ? Number(data.compareAt) : null,
        stock: Number(data.stock) || 0,
        rating: Number(data.rating) || 0,
        reviews: Number(data.reviews) || 0,
        badge: data.badge || null,
        image: data.image || null,
        highlights: highlights,
        specs: specs,
        use_cases: useCases,
      };

      console.log("[Products] Final DB data:", JSON.stringify(dbData, null, 2));

      const { data: product, error } = await supabase
        .from("products")
        .insert([dbData])
        .select()
        .single();

      if (error) {
        console.error("[Products] Database error:", error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log("[Products] Success! Created product:", product);
      return toCamelCase(product);
      
    } catch (error) {
      console.error("[Products] Handler error:", error);
      throw error;
    }
  });

/**
 * Update an existing product (admin only) - FIXED VERSION
 */
export const updateProduct = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const { id, updates } = data;

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
 * Delete a product (admin only) - FIXED VERSION
 */
export const deleteProduct = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const { id } = data;

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
