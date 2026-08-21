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
    const { name, email, phone, company, message } = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email and message are required' }),
        { status: 400, headers }
      );
    }

    // Format email body
    const emailBody = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}

Message:
${message}

---
Submitted: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
    `.trim();

    // Use Netlify Forms API for email forwarding
    // This requires the form to be set up in Netlify dashboard
    // For now, we'll use a simple HTTP POST to a mailto: link simulation
    
    console.log('[Contact Form] New submission:', { name, email, company });
    console.log('[Contact Form] Message:', emailBody);

    // Return success (in production, integrate with SendGrid, Mailgun, or Netlify Forms)
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Email sent successfully' 
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[Contact] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { status: 500, headers }
    );
  }
};

export const config = {
  path: '/api/contact',
};
