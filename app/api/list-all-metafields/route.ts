import { NextResponse, NextRequest } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';

// List EVERY metafield on a product (no filtering)
// This shows actual namespace/key pairs with Storefront access
export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get('handle');

  if (!handle) {
    return NextResponse.json(
      { error: 'Missing handle parameter' },
      { status: 400 }
    );
  }

  try {
    // Query with pagination but NO identifiers filter
    // This will return all metafields the Storefront API can see
    const response = await shopifyFetch<any>({
      query: `
        query ListAllMetafields($handle: String!, $first: Int = 250) {
          product(handle: $handle) {
            id
            title
            metafields(first: $first) {
              pageInfo {
                hasNextPage
                endCursor
              }
              edges {
                node {
                  key
                  namespace
                  value
                  type
                }
              }
            }
          }
        }
      `,
      variables: { handle, first: 250 },
    });

    if (!response?.product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const edges = response.product.metafields?.edges || [];
    const allMetafields = edges.map((e: any) => e.node);

    // Group by namespace
    const byNamespace: Record<string, any[]> = {};
    allMetafields.forEach((mf: any) => {
      if (!byNamespace[mf.namespace]) byNamespace[mf.namespace] = [];
      byNamespace[mf.namespace].push({
        key: mf.key,
        type: mf.type,
        value: mf.value?.slice(0, 150),
      });
    });

    return NextResponse.json({
      productId: response.product.id,
      productTitle: response.product.title,
      totalMetafields: allMetafields.length,
      metafieldsByNamespace: byNamespace,
      allMetafields: allMetafields,
      message: `All ${allMetafields.length} accessible metafields listed. Check namespaces to find your missing 3.`,
    });
  } catch (error) {
    console.error('[list-all-metafields] Error:', error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
