import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const store = getStore('products');
    
    // Get the index of all products
    const indexKey = 'product_index';
    let index = [];
    try {
      index = await store.get(indexKey, { type: 'json' }) || [];
    } catch (e) {
      console.log('[Blobs] No products found, returning empty array');
      return new Response(
        JSON.stringify([]),
        { status: 200, headers }
      );
    }

    // Fetch all products
    const products = [];
    for (const productId of index) {
      try {
        const product = await store.get(productId, { type: 'json' });
        if (product) {
          products.push(product);
        }
      } catch (e) {
        console.error(`[Blobs] Failed to fetch product ${productId}:`, e);
      }
    }

    console.log(`[Blobs] Retrieved ${products.length} products`);

    return new Response(
      JSON.stringify(products),
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
  path: '/api/products/list',
};
