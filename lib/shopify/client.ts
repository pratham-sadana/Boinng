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
    next: { revalidate: 60 }, // ISR — revalidate every 60s
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
