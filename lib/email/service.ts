/**
 * Email service utilities
 * Supports: Resend
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send email via Resend
 * Requires: npm install resend ✅
 * Env: RESEND_API_KEY ✅
 */
export async function sendEmailViaResend(options: EmailOptions): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    // Dynamically load resend
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const response = await resend.emails.send({
      from: options.from || 'noreply@boinng.in',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (response.error) {
      console.error('[Resend] API Error:', response.error);
      return { success: false, error: response.error.message };
    }

    console.log(`[Resend] Email sent successfully. ID: ${response.data?.id}`);
    return { success: true, id: response.data?.id };
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      return { success: false, error: 'Resend not installed. Run: npm install resend' };
    }
    console.error('[Resend] Email send error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send newsletter welcome email
 */
export async function sendNewsletterWelcomeEmail(email: string): Promise<{ success: boolean; error?: string; id?: string }> {
  const html = `
    <html>
      <body style="font-family: Gilroy, sans-serif; background: #FFFEFA;">
        <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">🎉 Welcome to BOINNG! Club</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #000; margin-bottom: 20px;">
            Hey there! Thanks for joining the club. You're now part of an exclusive community getting early access to limited drops, special discounts, and insider updates.
          </p>

          <p style="font-size: 16px; line-height: 1.6; color: #000; margin-bottom: 30px;">
            Stay tuned for what's coming next. Bold moves only. 🚀
          </p>

          <div style="text-align: center; padding-top: 30px; border-top: 1px solid #f0f0f0;">
            <p style="font-size: 12px; color: #999;">
              BOINNG! — Bold Streetwear<br>
              <a href="https://boinng.com" style="color: #0066FF; text-decoration: none;">Visit our store</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const result = await sendEmailViaResend({
      to: email,
      subject: '🎉 Welcome to BOINNG! Club',
      html,
      from: 'hello@boinng.in',
    });

    if (result.success) {
      console.log(`✅ Welcome email sent to ${email}. Message ID: ${result.id}`);
    } else {
      console.error(`❌ Failed to send welcome email to ${email}: ${result.error}`);
    }

    return result;
  } catch (error) {
    console.error('[sendNewsletterWelcomeEmail] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}
