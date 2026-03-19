import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';
import { SEARCH_PRODUCTS } from '@/lib/shopify/queries';
import type { Product } from '@/lib/shopify/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { products: [], error: 'Search query is required' },
      { status: 400 }
    );
  }

  if (query.length < 2) {
    return NextResponse.json(
      { products: [], error: 'Search query must be at least 2 characters' },
      { status: 400 }
    );
  }

  try {
    const response = await shopifyFetch<{
      search: {
        edges: Array<{
          node: Product;
        }>;
      };
    }>({
      query: SEARCH_PRODUCTS,
      variables: {
        query,
        first: 10,
      },
    });

    const products = response.search.edges.map(edge => edge.node);

    return NextResponse.json(
      {
        products,
        query,
        count: products.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      {
        products: [],
        error: 'Failed to search products',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
