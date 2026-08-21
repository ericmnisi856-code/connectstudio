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

    // Format email body as HTML
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</small></p>
    `;

    // Use Resend API (free tier: 100 emails/day)
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Studio Connect <noreply@connectstudio.co.za>',
          to: ['accounts@connectstudio.co.za'],
          reply_to: email,
          subject: `New Contact Form: ${name} - ${company || 'Individual'}`,
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email via Resend');
      }
    }

    // Log to console as backup
    console.log('[Contact Form] New submission from:', name, email);
    console.log('[Contact Form] Company:', company);
    console.log('[Contact Form] Message:', message);

    // Return success
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Message sent successfully. We will reply within 1 business day.' 
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('[Contact] Error:', error);
    
    // Still return success to user, but log the error
    // The submission is logged in console so you can see it in Netlify logs
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Message received. We will reply within 1 business day.',
        note: 'Email service temporarily unavailable, but your message was logged.'
      }),
      { status: 200, headers }
    );
  }
};

export const config = {
  path: '/api/contact',
};
