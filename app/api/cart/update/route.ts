import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';
import { UPDATE_CART_LINE } from '@/lib/shopify/queries';

export async function POST(request: NextRequest) {
  const { cartId, lineId, quantity } = await request.json();

  if (!cartId || !lineId || quantity === undefined) {
    return NextResponse.json(
      { error: 'Missing required fields: cartId, lineId, quantity' },
      { status: 400 }
    );
  }

  try {
    const response = await shopifyFetch<{
      cartLinesUpdate: {
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
      query: UPDATE_CART_LINE,
      variables: {
        cartId,
        lines: [{ id: lineId, quantity }],
      },
    });

    if (response.cartLinesUpdate.userErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Failed to update cart',
          userErrors: response.cartLinesUpdate.userErrors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        cart: response.cartLinesUpdate.cart,
        lines: response.cartLinesUpdate.cart.lines.edges.map(edge => edge.node),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update cart',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
