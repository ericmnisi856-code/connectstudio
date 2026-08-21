import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'PUT, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'PUT' && req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const store = getStore('products');
    const updates = await req.json();

    if (!updates.id) {
      return new Response(
        JSON.stringify({ error: 'Product ID is required' }),
        { status: 400, headers }
      );
    }

    // Get existing product
    let existingProduct;
    try {
      existingProduct = await store.get(updates.id, { type: 'json' });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 404, headers }
      );
    }

    // Merge updates with existing product
    const updatedProduct = {
      ...existingProduct,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Save updated product
    await store.setJSON(updates.id, updatedProduct);

    console.log(`[Blobs] Product updated: ${updates.id}`);

    return new Response(
      JSON.stringify(updatedProduct),
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
  path: '/api/products/update',
};
