import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  // Allow CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const store = getStore('products');
    const product = await req.json();

    // Generate ID if not provided
    const productId = product.id || `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate slug if not provided
    const slug = product.slug || product.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Create product object with defaults
    const newProduct = {
      id: productId,
      slug,
      name: product.name || 'Unnamed Product',
      model: product.model || '',
      category: product.category || 'uncategorized',
      tagline: product.tagline || '',
      description: product.description || '',
      price: Number(product.price) || 0,
      compareAt: product.compareAt ? Number(product.compareAt) : null,
      stock: Number(product.stock) || 0,
      rating: Number(product.rating) || 4.5,
      reviews: Number(product.reviews) || 0,
      badge: product.badge || null,
      image: product.image || null,
      highlights: product.highlights || [],
      specs: product.specs || [],
      useCases: product.useCases || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to blob storage
    await store.setJSON(productId, newProduct);

    // Also update the index (list of all product IDs)
    const indexKey = 'product_index';
    let index = [];
    try {
      index = await store.get(indexKey, { type: 'json' }) || [];
    } catch (e) {
      console.log('Creating new index');
    }
    
    if (!index.includes(productId)) {
      index.push(productId);
      await store.setJSON(indexKey, index);
    }

    console.log(`[Blobs] Product created: ${productId}`);

    return new Response(
      JSON.stringify(newProduct),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[Blobs] Error:', error);
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
  path: '/api/products/add',
};
