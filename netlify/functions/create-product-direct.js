import { createClient } from '@supabase/supabase-js';

export async function handler(event, context) {
  console.log("[Direct] Function called, method:", event.httpMethod);
  
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (parseError) {
    console.error("[Direct] Failed to parse request body:", parseError);
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Invalid JSON in request body' })
    };
  }

  console.log("[Direct] Raw product data:", JSON.stringify(data, null, 2));
  
  try {

    // Check environment variables - try both prefixed and non-prefixed
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
    
    console.log("[Direct] Environment check:", {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'missing'
    });

    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: "Missing Supabase credentials",
          debug: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey
          }
        })
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create clean database object
    const dbData = {
      slug: String(data.slug || '').trim(),
      name: String(data.name || '').trim(),
      model: String(data.model || '').trim(),
      category: String(data.category || '').trim(),
      tagline: String(data.tagline || '').trim(),
      description: String(data.description || '').trim(),
      price: Number(data.price) || 0,
      compare_at: data.compareAt ? Number(data.compareAt) : null,
      stock: Number(data.stock) || 0,
      rating: Number(data.rating) || 4.5,
      reviews: Number(data.reviews) || 0,
      badge: data.badge && data.badge.trim() ? data.badge.trim() : null,
      image: data.image && data.image.trim() ? data.image.trim() : null,
      highlights: [], // Always empty for now
      specs: [], // Always empty for now
      use_cases: [], // Always empty for now
    };

    console.log("[Direct] DB insert data:", JSON.stringify(dbData, null, 2));

    const { data: product, error } = await supabase
      .from("products")
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error("[Direct] Database error:", error);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          error: `Database error: ${error.message}`,
          details: error
        })
      };
    }

    console.log("[Direct] Success! Created:", product);

    // Transform back to camelCase
    const result = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      model: product.model,
      category: product.category,
      tagline: product.tagline,
      description: product.description,
      price: product.price,
      compareAt: product.compare_at,
      stock: product.stock,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      image: product.image,
      highlights: product.highlights || [],
      specs: product.specs || [],
      useCases: product.use_cases || [],
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error("[Direct] Handler error:", error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack
      })
    };
  }
}