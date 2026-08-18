const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log("[Direct] Raw product data:", JSON.stringify(data, null, 2));

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Ensure arrays are arrays, handle form data
    let specs = [];
    let useCases = [];
    let highlights = [];

    if (data.specs && Array.isArray(data.specs)) {
      specs = data.specs.filter(s => s && s.label && s.value);
    }
    
    if (data.useCases && Array.isArray(data.useCases)) {
      useCases = data.useCases.filter(u => u && u.trim());
    }
    
    if (data.highlights && Array.isArray(data.highlights)) {
      highlights = data.highlights.filter(h => h && h.trim());
    }

    // Create database object with snake_case
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
        body: JSON.stringify({ error: `Database error: ${error.message}` })
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
      highlights: product.highlights,
      specs: product.specs,
      useCases: product.use_cases,
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
      body: JSON.stringify({ error: error.message })
    };
  }
};