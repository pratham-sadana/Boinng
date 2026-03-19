import { NextResponse, NextRequest } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';

// Check what metafields actually exist on a real product with full resolution
// Usage: GET /api/debug-product-metafields?handle=YOUR_PRODUCT_HANDLE

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get('handle');

  if (!handle) {
    return NextResponse.json(
      { error: 'Missing handle parameter. Usage: /api/debug-product-metafields?handle=product-handle' },
      { status: 400 }
    );
  }

  try {
    const response = await shopifyFetch<{
      product: {
        id: string;
        title: string;
        metafields: Array<{
          key: string;
          namespace: string;
          value: string;
          type?: string;
          reference?: { fields: Array<{ key: string; value: string }> } | null;
          references?: {
            nodes: Array<{ fields: Array<{ key: string; value: string }> }>;
          } | null;
        }> | null;
      } | null;
    }>({
      query: `
        query DebugMetafields($handle: String!) {
          product(handle: $handle) {
            id
            title
            metafields(identifiers: [
              { namespace: "shopify", key: "fabric" }
              { namespace: "shopify", key: "activity" }
              { namespace: "shopify", key: "accessory_size" }
              { namespace: "shopify", key: "clothing_features" }
              { namespace: "shopify", key: "target_gender" }
              { namespace: "custom", key: "fabric" }
              { namespace: "custom", key: "activity" }
              { namespace: "custom", key: "accessory_size" }
              { namespace: "custom", key: "clothing_features" }
              { namespace: "custom", key: "target_gender" }
            ]) {
              key
              namespace
              value
              type
              reference {
                ... on Metaobject {
                  fields {
                    key
                    value
                  }
                }
              }
              references(first: 10) {
                nodes {
                  ... on Metaobject {
                    fields {
                      key
                      value
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { handle },
    });

    if (!response.product) {
      return NextResponse.json(
        { error: `Product with handle "${handle}" not found` },
        { status: 404 }
      );
    }

    const metafields = response.product.metafields || [];
    const withValues = metafields.filter((m: any) => m && m.value);

    // Process each metafield to show resolved values
    const processed = withValues.map((mf: any) => {
      let resolvedValue = '';
      
      // Try single reference (for non-list metaobject references)
      if (mf.reference?.fields?.length) {
        const fields = mf.reference.fields;
        const displayField = fields.find((f: any) => ['label', 'name', 'value', 'title'].includes(f.key));
        resolvedValue = displayField?.value || fields.map((f: any) => f.value).filter(Boolean).join(', ');
      }
      // Try list references (for list.metaobject_reference type)
      else if (mf.references?.nodes?.length) {
        resolvedValue = mf.references.nodes
          .map((node: any) => {
            const displayField = node.fields.find((f: any) => ['label', 'name', 'value', 'title'].includes(f.key));
            return displayField?.value || node.fields.map((f: any) => f.value).filter(Boolean).join(', ');
          })
          .filter(Boolean)
          .join(', ');
      }
      // Fallback to raw value if not a reference
      else if (mf.value && !mf.value.startsWith('[') && !mf.value.startsWith('gid://')) {
        resolvedValue = mf.value;
      }

      return {
        key: mf.key,
        namespace: mf.namespace,
        type: mf.type,
        rawValue: mf.value?.slice(0, 100),
        resolvedValue: resolvedValue || '(unresolved)',
        hasReference: !!mf.reference,
        hasReferences: !!mf.references?.nodes?.length,
      };
    });

    return NextResponse.json({
      productId: response.product.id,
      productTitle: response.product.title,
      metafieldCount: withValues.length,
      metafields: processed,
      rawMetafields: withValues,
      message: withValues.length === 0 
        ? 'No metafield values found. Create metafields in Shopify Admin: Settings → Metafields → Products'
        : `Found ${withValues.length} metafield(s). Check if they're properly resolved below.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

