import { createClient } from '@supabase/supabase-js';
import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    // Get Supabase credentials
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase credentials not found' }),
        { status: 500, headers }
      );
    }

    // Fetch all products from Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No products to migrate', count: 0 }),
        { status: 200, headers }
      );
    }

    // Migrate to Netlify Blobs
    const store = getStore('products');
    const migrated = [];
    const index = [];

    for (const product of products) {
      const productId = product.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const blobProduct = {
        id: productId,
        slug: product.slug,
        name: product.name,
        model: product.model,
        category: product.category,
        tagline: product.tagline || '',
        description: product.description || '',
        price: product.price,
        compareAt: product.compare_at,
        stock: product.stock,
        rating: product.rating || 4.5,
        reviews: product.reviews || 0,
        badge: product.badge,
        image: product.image,
        highlights: product.highlights || [],
        specs: product.specs || [],
        useCases: product.use_cases || [],
        createdAt: product.created_at || new Date().toISOString(),
        updatedAt: product.updated_at || new Date().toISOString(),
      };

      await store.setJSON(productId, blobProduct);
      index.push(productId);
      migrated.push(blobProduct);
    }

    // Save the index
    await store.setJSON('product_index', index);

    console.log(`[Migration] Migrated ${migrated.length} products to Netlify Blobs`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully migrated ${migrated.length} products`,
        count: migrated.length,
        products: migrated
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[Migration] Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack
      }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/migrate-to-blobs',
};
