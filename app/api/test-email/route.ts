import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterWelcomeEmail } from '@/lib/email/service';

/**
 * POST /api/test-email
 * Test email sending via Resend
 * 
 * Request body:
 * {
 *   email: string (required)
 * }
 */

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Test email send
    console.log(`[Test Email] Sending test email to: ${email}`);
    
    const result = await sendNewsletterWelcomeEmail(email);

    return NextResponse.json(
      {
        success: true,
        message: `Test email sent successfully to ${email}`,
        email,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[/api/test-email] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
