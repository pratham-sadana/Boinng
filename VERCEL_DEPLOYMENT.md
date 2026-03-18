# Vercel Deployment - Environment Variables Setup

## Error You're Seeing
```
Shopify API error: Variable $handle of type String! was provided invalid value
```

This means environment variables aren't set on Vercel.

## How to Fix

### 1. Set Environment Variables in Vercel Dashboard

1. Go to **https://vercel.com/dashboard**
2. Select your **BOINNG** project
3. Click **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `gnnh16-hf.myshopify.com` (from your Shopify admin) |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Your Storefront API token (from `.env.local`) |

### 2. Important: Use Storefront API Token (Not Private Token)

⚠️ **DO NOT use the Private Admin API token!**

- **Use**: Storefront API Token (public, for frontend)
- **Don't use**: Private Admin API Token (secret, internal only)

You can find this in Shopify Admin:
- Settings → Apps and integrations → API credentials → Storefront API tokens

### 3. Trigger a New Deployment

After adding the variables:

**Option A:** Push a new commit to trigger auto-deployment
```bash
git add .
git commit -m "chore: update deployment config"
git push
```

**Option B:** Redeploy manually in Vercel Dashboard
- Click **Deployments** → Select latest → Click the **three dots** → **Redeploy**

### 4. Verify It Works

After redeployment:
1. Visit your deployed site: `https://your-boinng-vercel-app.vercel.app`
2. Try adding a product to cart
3. Click "Checkout on Shopify"
4. Should redirect to Shopify checkout ✅

## Troubleshooting

If you still see errors:
1. Double-check the environment variable **names** are exact:
   - `SHOPIFY_STORE_DOMAIN` (not `SHOPIFY_DOMAIN`)
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (not just `TOKEN`)

2. Verify the **values** are correct:
   - Store domain should be like: `your-store.myshopify.com`
   - Token should be a long string starting with letters

3. Check Vercel deployment logs:
   - Go to **Deployments** → Click the deployment → **View Function Logs**
