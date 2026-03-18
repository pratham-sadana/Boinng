# Shopify Headless API Configuration - Quick Start

## ✅ What's Been Configured

### 1. **Shopify GraphQL API Client** (`lib/shopify/client.ts`)
   - Configured to use Shopify Storefront API 2024-01
   - Handles authentication with token
   - Built-in error handling and caching (60s ISR revalidation)

### 2. **Server-Side API Functions** (`lib/shopify/api.ts`) — NEW
   - `getCollectionProducts(handle, limit)` — Fetch products from a collection
   - `getProduct(handle)` — Fetch single product details
   - `getFeaturedProducts(limit)` — Fetch best-selling products
   - `transformProduct()` — Format Shopify data for frontend

### 3. **Updated Components**
   - **FeaturedProducts.tsx** — Now fetches real data from Shopify collections
   - **page.tsx** — Homepage now uses real product data
   - Products display with actual images, prices, and availability

### 4. **Environment Configuration**
   - `.env.local.example` — Full documentation for all env variables
   - Variables for store domain and API token
   - Collection handle configuration

### 5. **Testing Script** (`scripts/test-shopify.js`)
   - Run with: `npm run test:shopify`
   - Verifies API credentials and connection
   - Shows available collections

### 6. **Documentation**
   - `SHOPIFY_SETUP.md` — Complete setup guide
   - Step-by-step instructions for getting credentials
   - Creating collections and products

---

## 🚀 Quick Start (3 Steps)

### Step 1: Configure Environment
```bash
# Copy the example env file
cp .env.local.example .env.local

# Edit .env.local and add your credentials
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
```

### Step 2: Create Collections in Shopify Admin
- Create collection with handle: `best-sellers`
- Create collection with handle: `new-arrivals`
- Add products to each collection

### Step 3: Test & Run
```bash
# Test the connection
npm run test:shopify

# Start development server
npm run dev
```

---

## 📁 File Changes Summary

| File | Change |
|------|--------|
| `lib/shopify/api.ts` | ✨ NEW — Server API functions |
| `lib/shopify/client.ts` | ✅ Already configured |
| `lib/shopify/queries.ts` | ✏️ Updated with vendor field |
| `lib/shopify/types.ts` | ✅ Already configured |
| `components/home/FeaturedProducts.tsx` | ✏️ Now uses real Shopify data |
| `app/page.tsx` | ✏️ Passes collection handles |
| `.env.local.example` | ✏️ Comprehensive documentation |
| `SHOPIFY_SETUP.md` | ✨ NEW — Complete setup guide |
| `scripts/test-shopify.js` | ✨ NEW — Connection test script |
| `package.json` | ✏️ Added test:shopify script |

---

## 🔧 How It Works

```
User visits homepage
  ↓
next.tsx calls FeaturedProducts component (Server Component)
  ↓
FeaturedProducts calls getCollectionProducts()
  ↓
getCollectionProducts() calls shopifyFetch() with GraphQL query
  ↓
Shopify API returns product data
  ↓
transformProduct() formats data for display
  ↓
FeaturedProducts renders product cards with real images & prices
```

---

## 🎯 API Endpoints Used

| Query | Purpose | Cache |
|-------|---------|-------|
| `COLLECTION_QUERY` | Fetch products by collection handle | 60s ISR |
| `PRODUCT_QUERY` | Fetch single product with full details | 60s ISR |
| `FEATURED_PRODUCTS_QUERY` | Fetch best-selling products | 60s ISR |

---

## ⚙️ Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| `SHOPIFY_STORE_DOMAIN` | Yes | `my-store.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Yes | `shpca_abc123...` |

---

## 🐛 Troubleshooting

### Collections not showing products
- Check collection handles match exactly (case-sensitive)
- Verify products are published and added to collection
- Run `npm run test:shopify` to verify API connection

### Images not loading
- Ensure products have featured images in Shopify
- Check that Next.js Image Optimization is working
- Verify `next.config.mjs` includes Shopify CDN

### API errors in console
- Run `npm run test:shopify` first
- Check environment variables are set (use `echo $SHOPIFY_STORE_DOMAIN`)
- Verify API token has correct scopes (read_products, read_collections)

---

## 📚 Resources

- **Shopify Docs**: https://shopify.dev/api/storefront
- **GraphQL Explorer**: https://shopify.dev/api/admin-graphql
- **Setup Guide**: See `SHOPIFY_SETUP.md`

---

## ✨ Next Features to Build

- [ ] Product detail pages (`/products/[handle]`)
- [ ] Cart functionality (mutations)
- [ ] Collections page
- [ ] Search functionality
- [ ] Customer accounts
- [ ] Checkout integration
- [ ] Product filtering & sorting
