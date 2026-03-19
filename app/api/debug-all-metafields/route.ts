import { NextResponse, NextRequest } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';

// Show ALL metafields on a product with actual namespaces and keys
// Usage: GET /api/debug-all-metafields?handle=YOUR_PRODUCT_HANDLE

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get('handle');

  if (!handle) {
    return NextResponse.json(
      { error: 'Missing handle parameter. Usage: /api/debug-all-metafields?handle=product-handle' },
      { status: 400 }
    );
  }

  try {
    const response = await shopifyFetch<any>({
      query: `
        query DebugAllMetafields($handle: String!) {
          product(handle: $handle) {
            id
            title
            metafields(identifiers: [
              { namespace: "shopify", key: "fabric" }
              { namespace: "shopify", key: "activity" }
              { namespace: "shopify", key: "accessory-size" }
              { namespace: "shopify", key: "clothing-features" }
              { namespace: "shopify", key: "target-gender" }
              { namespace: "shopify", key: "color-pattern" }
            ]) {
              key
              namespace
              value
              type
            }
          }
        }
      `,
      variables: { handle },
    });

    console.log('[debug-all-metafields] Full response:', JSON.stringify(response, null, 2));

    if (!response?.product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const metafields = (response.product.metafields || []).filter((m: any) => m !== null);

    // Group by namespace
    const byNamespace: Record<string, any[]> = {};
    metafields.forEach((mf: any) => {
      if (!byNamespace[mf.namespace]) byNamespace[mf.namespace] = [];
      byNamespace[mf.namespace].push({
        key: mf.key,
        type: mf.type,
        value: mf.value?.slice(0, 100),
      });
    });

    return NextResponse.json({
      productId: response.product.id,
      productTitle: response.product.title,
      totalFound: metafields.length,
      metafieldsByNamespace: byNamespace,
      allMetafields: metafields,
      namespaces: Object.keys(byNamespace),
      message: `Found in namespaces: ${Object.keys(byNamespace).join(', ') || 'NONE'}`,
    });
  } catch (error) {
    console.error('[debug-all-metafields] Error:', error);
    return NextResponse.json(
      { error: String(error), stack: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    );
  }
}
