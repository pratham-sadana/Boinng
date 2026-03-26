import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterWelcomeEmail } from '@/lib/email/service';

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
  let email = '';
  
  try {
    const body = await request.json();
    email = body.email;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email is required',
        },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email address',
        },
        { status: 400 }
      );
    }

    console.log(`[/api/newsletter/subscribe] Processing email: ${trimmedEmail}`);

    // Create customer in Shopify with marketing consent
    const customerData = {
      email: email.toLowerCase().trim(),
      acceptsMarketing: true,
    };

    console.log(`📧 Creating customer for newsletter: ${email}`);

    let customerCreated = false;
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      const customerResponse = await fetch(
        `${baseUrl}/api/customers/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerData),
        }
      );

      // Check response status first
      if (!customerResponse.ok) {
        const responseText = await customerResponse.text();
        console.error(`⚠️ Customer creation failed with status ${customerResponse.status}:`, responseText.substring(0, 500));
      } else {
        const result = await customerResponse.json();

        if (result.success) {
          console.log(`✅ Customer created: ${result.customer.id}`);
          customerCreated = true;
        } else {
          console.warn(`⚠️ Customer creation skipped: ${result.message}`, result.errors ? JSON.stringify(result.errors) : '');
        }
      }
    } catch (customerError) {
      console.error(`❌ Customer creation error:`, customerError);
      // Continue with email even if customer creation fails
    }

    // Send welcome email via email service (mandatory)
    if (!process.env.RESEND_API_KEY) {
      console.error(`❌ RESEND_API_KEY not configured. Email service unavailable.`);
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 }
      );
    }

    console.log(`📬 Sending welcome email to: ${email}`);
    const emailResult = await sendNewsletterWelcomeEmail(email);
    
    if (!emailResult.success) {
      console.error(`❌ Email send failed for ${email}: ${emailResult.error}`);
      return NextResponse.json(
        { error: 'Failed to send confirmation email. Please try again.' },
        { status: 500 }
      );
    }

    console.log(`✅ Welcome email sent successfully to ${email}`);

    console.log(`[Newsletter Signup] Email: ${email}, Time: ${new Date().toISOString()}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed to newsletter! Check your email for updates.',
        email,
        customerCreated,
      },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('[/api/newsletter/subscribe] Error:', {
      message: errorMessage,
      stack: errorStack,
      email,
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to subscribe. Please try again later.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
