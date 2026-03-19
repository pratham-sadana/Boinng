import { NextRequest, NextResponse } from 'next/server';

/**
 * Newsletter subscription endpoint
 * 
 * Integration points for email services:
 * - Resend.com: Email-first, simple API
 * - Mailchimp: Industry standard, free tier
 * - Klaviyo: E-commerce focused, abandoned cart recovery
 * - SendGrid: Transactional + marketing
 */

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  // Validate email
  if (!email || !email.includes('@')) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 }
    );
  }

  try {
    // Option 1: Send to Resend (email service)
    // Uncomment to use Resend: npm install resend
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'noreply@boinng.in',
      to: email,
      subject: '🎉 Welcome to BOINNG! Club',
      html: '<h1>You\'re in the club!</h1><p>Expect early access, exclusive drops, and special offers.</p>',
    });
    */

    // Option 2: Send to Mailchimp
    // Uncomment to use Mailchimp: npm install @mailchimp/mailchimp_marketing
    /*
    const mailchimp = require("@mailchimp/mailchimp_marketing");
    mailchimp.setConfig({
      apiKey: process.env.MAILCHIMP_API_KEY,
      server: process.env.MAILCHIMP_SERVER_PREFIX, // e.g., "us1"
    });
    
    await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
      email_address: email,
      status: 'pending',
    });
    */

    // Option 3: Send to Klaviyo (recommended for e-commerce)
    // Uncomment to use Klaviyo: npm install axios
    /*
    const axios = require('axios');
    
    const klaviyoResponse = await axios.post(
      'https://a.klaviyo.com/api/v2/list/MAILLIST_ID/subscribe',
      {
        api_key: process.env.KLAVIYO_API_KEY,
        profiles: [
          {
            email: email,
            subscribed: true,
          },
        ],
      }
    );

    if (klaviyoResponse.status !== 200) {
      throw new Error('Klaviyo subscription failed');
    }
    */

    // For now: Store email locally (for demo purposes)
    // In production, use one of the services above
    console.log(`✅ Newsletter signup: ${email}`);

    // Log to console for development
    console.log(`[Newsletter Signup] Email: ${email}, Time: ${new Date().toISOString()}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter',
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      {
        error: 'Failed to subscribe. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
