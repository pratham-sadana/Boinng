#!/usr/bin/env node
/**
 * Shopify Connection Test
 * Run this to verify your Shopify API credentials are configured correctly
 * Usage: node scripts/test-shopify.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

async function testShopifyConnection() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  console.log('🧪 Testing Shopify Storefront API Connection...\n');

  // Check environment variables
  if (!domain) {
    console.error('❌ SHOPIFY_STORE_DOMAIN is not set');
    console.error('   Add to .env.local: SHOPIFY_STORE_DOMAIN=your-store.myshopify.com\n');
    process.exit(1);
  }

  if (!token) {
    console.error('❌ SHOPIFY_STOREFRONT_ACCESS_TOKEN is not set');
    console.error('   Add to .env.local: SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token\n');
    process.exit(1);
  }

  console.log(`✓ Store Domain: ${domain}`);
  console.log(`✓ Token Present: ${token.substring(0, 10)}...${token.substring(token.length - 4)}\n`);

  // Test GraphQL query
  try {
    const apiUrl = `https://${domain}/api/2024-01/graphql.json`;
    console.log(`📡 Testing API endpoint: ${apiUrl}\n`);

      const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({
        query: `
          query {
            shop {
              name
            }
            collections(first: 3) {
              edges {
                node {
                  handle
                  title
                }
              }
            }
          }
        `,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error('❌ GraphQL Error:');
      data.errors.forEach((err) => {
        console.error(`   ${err.message}`);
      });
      process.exit(1);
    }

    if (!data.data) {
      console.error('❌ No data returned from API');
      console.error(data);
      process.exit(1);
    }

    console.log('✅ Connection Successful!\n');
    console.log(`📦 Store: ${data.data.shop.name}`);
    console.log(`\n📂 Available Collections:`);

    if (data.data.collections.edges.length === 0) {
      console.log('   ⚠️  No collections found. Create some in Shopify Admin.');
    } else {
      data.data.collections.edges.forEach((edge) => {
        console.log(`   • ${edge.node.title} (${edge.node.handle})`);
      });
    }

    console.log('\n✨ Everything looks good! Your storefront is ready.\n');
    console.log('📝 Next steps:');
    console.log('   1. Create "best-sellers" and "new-arrivals" collections in Shopify');
    console.log('   2. Add products to these collections');
    console.log('   3. Run: npm run dev\n');
  } catch (error) {
    console.error('❌ Connection Failed:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error(error);
    }
    console.error('\n💡 Troubleshooting:');
    console.error('   • Check your internet connection');
    console.error('   • Verify domain format (no https://, no trailing slash)');
    console.error('   • Confirm token has correct scopes');
    console.error('   • Visit: https://shopify.dev/api/storefront\n');
    process.exit(1);
  }
}

testShopifyConnection();
