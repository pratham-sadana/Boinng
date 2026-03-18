# Getting Shopify Headless API Token from Custom App

## For Your Store: `gnnh16-hf.myshopify.com`

### 🔑 Which Token to Use?

Your Shopify headless app has **TWO tokens**:

| Token | Use | Scope | Security |
|-------|-----|-------|----------|
| **PUBLIC** (Storefront API) | Frontend / Browser | Limited (read-only) | ✅ Safe to expose |
| **PRIVATE** (Admin API) | Server-side only | Full access | 🔒 Keep secret |

**You need the PUBLIC / STOREFRONT token for this project!**

---

## 📍 Location in Shopify Admin

1. **Go to:** Settings → Apps and integrations
2. **Click:** Your headless app (or the app name you created)
3. **Find section:** "Storefront API" or "Public access tokens"
4. **Look for:** Token labeled as "Public" or "Storefront API access token"
   - Token starts with: `shpca_` or `shpua_`
   - Example: `shpca_1234567890abcdefghijklmnopqrst`

---

## 🔑 Getting Your PUBLIC Token

### Option 1: From Storefront API Section
1. **Open your headless app** in Shopify Admin
2. **Look for:** "Storefront API" tab or section
3. **Find:** "Access tokens" or "Public access token"
4. **Click:** "Reveal token" 
5. **Copy the token** (the longer one starting with `shpca_` or `shpua_`)

### Option 2: From API Credentials
1. **In your app**, find: "API credentials" or "Keys and credentials"
2. **Look for** a section labeled "Storefront API"
3. **Copy the public token** (NOT the private one)

---

## ⚠️ Don't Use the PRIVATE Token!

If you see TWO tokens:
- ✅ **Public token** ← This one
- ❌ **Private token** ← NOT this one (use for server code only)

The private token should NOT be in `.env.local` or exposed anywhere on the frontend.

---

## ✅ Add to .env.local

Once you have the PUBLIC token:

```env
SHOPIFY_STORE_DOMAIN=gnnh16-hf.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpca_your_actual_public_token_here
```

Example:
```env
SHOPIFY_STORE_DOMAIN=gnnh16-hf.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpca_1234567890abcdefghijklmnopqrst
```

---

## 🔒 Security Check

✓ PUBLIC token in `.env.local` — OK for frontend  
✓ PUBLIC token exposed in browser — OK, it's designed for that  
✗ PRIVATE token in `.env.local` — Never do this  
✗ PRIVATE token in browser — Major security issue  

---

## 🧪 Test the Token

Once added to `.env.local`:

```bash
npm run test:shopify
```

This will verify:
- ✓ Token is valid
- ✓ Connection to your store works
- ✓ Collections are accessible
- ✓ API version is correct

---

## 📋 Verify Token Scopes

Your PUBLIC token needs these scopes to work:

✓ `storefront-api/read_products`  
✓ `storefront-api/read_collections`  
✓ `storefront-api/read_carts` (for cart operations)  
✓ `storefront-api/write_carts` (for add-to-cart)  

These should already be configured in your headless app.

---

## 🆘 Troubleshooting

### "Multiple tokens" confusion
- Use the **PUBLIC** one (shorter name, limited access)
- Not the PRIVATE one (full admin access)

### "Token not working"
- Make sure you copied the entire token
- Paste it WITHOUT any extra spaces
- Check you're using the PUBLIC token, not PRIVATE
- Regenerate if needed in Shopify Admin

### "Access Denied" error
- Token exists but scopes are wrong
- Check app permissions in Shopify Admin
- May need to regenerate with correct scopes
