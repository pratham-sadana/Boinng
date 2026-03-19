// Get Shopify config - only validated at runtime, not at build time
function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error(
      'Missing Shopify environment variables. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.'
    );
  }

  return {
    domain,
    token,
    apiUrl: `https://${domain}/api/2024-01/graphql.json`,
  };
}

// Storefront API — used for all public product/collection queries
export async function shopifyFetch<T>({
  query,
  variables,
  cache,
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<T> {
  const { apiUrl, token } = getShopifyConfig();

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
    ...(cache ? { cache } : {}),
  });

  if (!res.ok) {
    throw new Error(`Shopify fetch failed: ${res.status} ${res.statusText}`);
  }

  const json: { data?: T; errors?: { message: string }[] } = await res.json();

  if (json.errors) {
    throw new Error(`Shopify API error: ${json.errors[0].message}`);
  }

  if (!json.data) {
    throw new Error('Shopify API returned no data');
  }

  return json.data;
}

// Admin API — server-side only, never called from client components
// Used for operations that require admin access (e.g. metafield management)
export async function shopifyAdminFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token  = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error(
      'Missing Shopify Admin API env vars. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN.'
    );
  }

  const res = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token, // Admin token header (different from Storefront)
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store', // Admin data should never be cached
  });

  if (!res.ok) {
    throw new Error(`Shopify Admin fetch failed: ${res.status} ${res.statusText}`);
  }

  const json: { data?: T; errors?: { message: string }[] } = await res.json();

  if (json.errors) {
    throw new Error(`Shopify Admin API error: ${json.errors[0].message}`);
  }

  if (!json.data) {
    throw new Error('Shopify Admin API returned no data');
  }

  return json.data;
}