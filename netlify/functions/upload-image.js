import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

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
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No image file provided' }),
        { status: 400, headers }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only JPG, PNG, WebP and GIF are allowed.' }),
        { status: 400, headers }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 5MB.' }),
        { status: 400, headers }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const ext = file.name.split('.').pop();
    const filename = `product_${timestamp}_${randomStr}.${ext}`;

    // Store in Netlify Blobs
    const store = getStore('product-images');
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await store.set(filename, buffer, {
      metadata: {
        contentType: file.type,
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      }
    });

    // Return the blob URL
    const imageUrl = `/api/images/${filename}`;

    console.log(`[Upload] Image uploaded: ${filename}`);

    return new Response(
      JSON.stringify({ 
        success: true,
        filename,
        url: imageUrl,
        size: file.size,
        type: file.type
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[Upload] Error:', error);
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
  path: '/api/upload-image',
};
