import { NextResponse } from 'next/server';
import { enableMetafieldStorefrontAccess } from '@/lib/shopify/api';

// Call this once from your browser: GET /api/setup-metafields
// It enables storefront access for all category metafields via the Admin API.
// Safe to call multiple times — already-enabled definitions are skipped.
// Shows all available metafield definitions so you can debug what's missing.

export async function GET() {
  const result = await enableMetafieldStorefrontAccess();

  console.log('[setup-metafields] Result:', result);

  // Group all definitions by namespace for easy debugging
  const defsByNamespace = result.allDefinitions.reduce(
    (acc, def) => {
      if (!acc[def.namespace]) acc[def.namespace] = [];
      acc[def.namespace].push({ key: def.key, access: def.access });
      return acc;
    },
    {} as Record<string, Array<{ key: string; access: string | null }>>
  );

  return NextResponse.json({
    success: result.errors.length === 0,
    summary: {
      enabled: result.enabled.length,
      skipped: result.skipped.length,
      errors: result.errors.length,
    },
    enabled: result.enabled,
    skipped: result.skipped,
    errors: result.errors,
    allDefinitionsByNamespace: defsByNamespace,
    totalDefinitions: result.allDefinitions.length,
  });
}