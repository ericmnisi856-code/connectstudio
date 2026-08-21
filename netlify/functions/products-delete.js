import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'DELETE, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const store = getStore('products');
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'Product ID is required' }),
        { status: 400, headers }
      );
    }

    // Delete the product
    await store.delete(id);

    // Update the index
    const indexKey = 'product_index';
    let index = [];
    try {
      index = await store.get(indexKey, { type: 'json' }) || [];
    } catch (e) {
      console.log('[Blobs] Index not found');
    }

    index = index.filter(productId => productId !== id);
    await store.setJSON(indexKey, index);

    console.log(`[Blobs] Product deleted: ${id}`);

    return new Response(
      JSON.stringify({ success: true, id }),
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
  path: '/api/products/delete',
};
