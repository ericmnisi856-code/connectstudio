import { getStore } from '@netlify/blobs';

export default async (req, context) => {
  const url = new URL(req.url);
  const filename = url.pathname.split('/').pop();

  if (!filename) {
    return new Response('Not found', { status: 404 });
  }

  try {
    const store = getStore('product-images');
    const imageData = await store.get(filename, { type: 'arrayBuffer' });

    if (!imageData) {
      return new Response('Image not found', { status: 404 });
    }

    // Get metadata to determine content type
    const metadata = await store.getMetadata(filename);
    const contentType = metadata?.contentType || 'image/jpeg';

    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('[GetImage] Error:', error);
    return new Response('Error retrieving image', { status: 500 });
  }
};

export const config = {
  path: '/api/images/*',
};
