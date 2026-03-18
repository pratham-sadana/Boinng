import { shopifyFetch } from '@/lib/shopify/client';
import { CREATE_CART } from '@/lib/shopify/queries';
import type { CartCreateResponse } from '@/lib/shopify/types';

export async function POST(request: Request) {
  try {
    const { lines } = await request.json();

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return Response.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    // Call Shopify API server-side (environment variables are available here)
    const response = await shopifyFetch<CartCreateResponse>({
      query: CREATE_CART,
      variables: {
        input: {
          lines,
        },
      },
    });

    if (response?.cartCreate?.cart?.checkoutUrl) {
      return Response.json({
        success: true,
        checkoutUrl: response.cartCreate.cart.checkoutUrl,
        cart: response.cartCreate.cart,
      });
    }

    return Response.json(
      { error: 'Failed to create checkout URL' },
      { status: 500 }
    );
  } catch (error) {
    console.error('❌ Checkout API error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
