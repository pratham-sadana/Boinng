import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';
import { CREATE_CART } from '@/lib/shopify/queries';

export async function POST(request: NextRequest) {
  const { merchandiseId, quantity } = await request.json();

  if (!merchandiseId || !quantity) {
    return NextResponse.json(
      { error: 'Missing required fields: merchandiseId, quantity' },
      { status: 400 }
    );
  }

  try {
    const response = await shopifyFetch<{
      cartCreate: {
        cart: {
          id: string;
          checkoutUrl: string;
          totalQuantity: number;
          lines: {
            edges: Array<{
              node: {
                id: string;
                quantity: number;
                merchandise: {
                  id: string;
                  title: string;
                  price: { amount: string; currencyCode: string };
                  product: {
                    title: string;
                    featuredImage: { url: string; altText: string; width: number; height: number };
                  };
                };
              };
            }>;
          };
        };
        userErrors: Array<{ field: string; message: string }>;
      };
    }>({
      query: CREATE_CART,
      variables: {
        input: {
          lines: [{ merchandiseId, quantity }],
        },
      },
    });

    if (response.cartCreate.userErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Failed to create cart',
          userErrors: response.cartCreate.userErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        cartId: response.cartCreate.cart.id,
        checkoutUrl: response.cartCreate.cart.checkoutUrl,
        cart: response.cartCreate.cart,
        lines: response.cartCreate.cart.lines.edges.map(edge => edge.node),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Create cart error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create cart',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
