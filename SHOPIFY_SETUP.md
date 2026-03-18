# Shopify Headless Storefront Setup Guide

## Overview

BOINNG! is configured as a **Shopify Headless Storefront** using the **Storefront GraphQL API**. This allows the Next.js frontend to directly fetch product, collection, and cart data from Shopify without needing a custom backend.

## Prerequisites

- Active Shopify store
- Admin access to your Shopify store
- Node.js 18+ and npm

## Step 1: Get Your Shopify Credentials

### 1.1 Find Your Store Domain
1. Go to your Shopify Admin
2. Settings → General
3. Look for "Store domain" (e.g., `my-store.myshopify.com`)

### 1.2 Create a Storefront API Access Token

1. In Shopify Admin, go to **Settings → Apps and integrations**
2. Click **Develop apps** (or **App and sales channel settings**)
3. Click **Create an app** (or use an existing development app)
4. Set app name: "BOINNG Storefront"
5. Under **Admin API access scopes**, search for and enable:
   - `storefront-api/read_products`
   - `storefront-api/read_collections`
   - `storefront-api/read_carts`
   - `storefront-api/write_carts`

6. Save and Install the app
7. Go to the app's **Configuration** tab
8. Under **Storefront API**, click **Reveal token** and copy it
9. This is your `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

## Step 2: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your credentials:
   ```env
   SHOPIFY_STORE_DOMAIN=my-store.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
   ```

3. **Never commit `.env.local` to git** — it contains sensitive tokens

## Step 3: Create Collections in Shopify

The homepage displays two collections with handles:
- `best-sellers` — For your best performing products
- `new-arrivals` — For newly released products

### To create a collection:

1. In Shopify Admin, go to **Products → Collections**
2. Click **Create collection**
3. Set the name (e.g., "Best Sellers")
4. Set the handle (e.g., `best-sellers`) in the URL section
   - Handles must be lowercase with hyphens, no spaces
5. Add products to the collection
6. Publish the collection

**Note**: You can use any handles you want — just update the `collectionHandle` prop in `page.tsx` to match.

## Step 4: Add Product Tags (Optional)

Product tags are used for badges in the product grid:

- Tag with `new` → Shows "NEW" badge (blue)
- Tag with `hot` → Shows "HOT" badge (yellow)
- Tag with `sale` → Shows "SALE" badge (yellow)

To add tags:
1. Go to **Products** in Shopify Admin
2. Click on a product
3. Scroll to **Organization → Tags**
4. Type tags separated by commas (e.g., `new, streetwear, sale`)

## Step 5: Start Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see your storefront with real Shopify data!

## File Structure

```
lib/shopify/
├── client.ts       → GraphQL fetch wrapper with authentication
├── api.ts          → Server-side API functions (NEW)
│   ├── getCollectionProducts()
│   ├── getFeaturedProducts()
│   ├── getProduct()
│   └── transformProduct()
├── queries.ts      → GraphQL query strings
├── types.ts        → TypeScript types for Shopify data
└── 

components/
├── home/
│   └── FeaturedProducts.tsx  → Server component using new API
```

## API Functions

### getCollectionProducts(handle, limit)
Fetch products from a specific collection.
```typescript
const products = await getCollectionProducts('best-sellers', 8);
```

### getProduct(handle)
Fetch a single product by handle (for product detail pages).
```typescript
const product = await getProduct('logo-tee');
```

### transformProduct(product)
Transform raw Shopify data to frontend format.
```typescript
const transformed = transformProduct(shopifyProduct);
// Returns: { id, title, price, image, variants, ... }
```

## Testing the Setup

1. **Check Errors**: If you see errors in the console, verify:
   - Environment variables are set correctly
   - Storefront API token is valid
   - Collections exist with the correct handles

2. **Check Products Load**:
   - Homepage should display products from "Best Sellers" and "New Arrivals"
   - Product images should load from `cdn.shopify.com`
   - Prices should display in INR (₹)

3. **Debug API Calls**:
   - Check browser DevTools Network tab
   - Look at terminal output for API errors
   - Shopify API responses include `errors` field — check console logs

## Common Issues

### "Collection not found" error

- Verify collection handle matches exactly in Shopify (case-sensitive)
- Make sure collection is published
- Check that products are added to the collection

### No products displaying

- Check that your Shopify API token has the correct scopes
- Verify `SHOPIFY_STORE_DOMAIN` format (no `https://`, no trailing slash)
- Run `npm run dev` with `DEBUG=* npm run dev` for detailed logs

### Images not loading

- Images are served from `cdn.shopify.com` via Next.js Image Optimization
- Check that products have featured images in Shopify
- Verify `next.config.mjs` includes Shopify CDN permissions

## Next Steps

1. **Create Product Detail Pages** — Build `/products/[handle].tsx` route
2. **Implement Cart** — Use `CREATE_CART` and `ADD_TO_CART` mutations
3. **Build Collection Pages** — Dynamic collection routes
4. **Add Search** — Implement product search using GraphQL
5. **Customer Accounts** — Integrate Shopify customer API

## Shopify GraphQL API Docs

- [Storefront API Reference](https://shopify.dev/api/storefront)
- [GraphQL Explorer](https://shopify.dev/api/admin-graphql)
- [API Changelog](https://shopify.dev/api/admin-rest/changelog)

## Support

- Check terminal logs during `npm run dev`
- Review Shopify Admin > Settings > Apps and integrations > API credentials
- Ensure network requests to `https://{STORE_DOMAIN}/api/{VERSION}/graphql.json` are successful
