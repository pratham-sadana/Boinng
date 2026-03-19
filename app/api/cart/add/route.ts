import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';
import { ADD_TO_CART } from '@/lib/shopify/queries';

export async function POST(request: NextRequest) {
  const { cartId, merchandiseId, quantity } = await request.json();

  if (!cartId || !merchandiseId || !quantity) {
    return NextResponse.json(
      { error: 'Missing required fields: cartId, merchandiseId, quantity' },
      { status: 400 }
    );
  }

  try {
    const response = await shopifyFetch<{
      cartLinesAdd: {
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
      query: ADD_TO_CART,
      variables: {
        cartId,
        lines: [{ merchandiseId, quantity }],
      },
    });

    if (response.cartLinesAdd.userErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Failed to add to cart',
          userErrors: response.cartLinesAdd.userErrors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        cart: response.cartLinesAdd.cart,
        lines: response.cartLinesAdd.cart.lines.edges.map(edge => edge.node),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      {
        error: 'Failed to add item to cart',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
