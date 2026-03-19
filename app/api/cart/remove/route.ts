import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';
import { REMOVE_FROM_CART } from '@/lib/shopify/queries';

export async function POST(request: NextRequest) {
  const { cartId, lineIds } = await request.json();

  if (!cartId || !lineIds || !Array.isArray(lineIds) || lineIds.length === 0) {
    return NextResponse.json(
      { error: 'Missing required fields: cartId, lineIds (array)' },
      { status: 400 }
    );
  }

  try {
    const response = await shopifyFetch<{
      cartLinesRemove: {
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
      query: REMOVE_FROM_CART,
      variables: {
        cartId,
        lineIds,
      },
    });

    if (response.cartLinesRemove.userErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Failed to remove from cart',
          userErrors: response.cartLinesRemove.userErrors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        cart: response.cartLinesRemove.cart,
        lines: response.cartLinesRemove.cart.lines.edges.map(edge => edge.node),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      {
        error: 'Failed to remove item from cart',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
