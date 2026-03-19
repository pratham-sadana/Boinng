# Fix All Issues — BOINNG! Codebase

## 🔴 High Priority
- [/] Remove debug `console.log` calls from [Hero.tsx](file:///d:/Boinng/tying/Boinng/components/home/Hero.tsx) (logs env vars to console)
- [/] Remove debug `console.log` from [ProductDetails.tsx](file:///d:/Boinng/tying/Boinng/components/product/ProductDetails.tsx) (logs full product object)
- [/] Fix cart count badge in [Navbar](file:///d:/Boinng/tying/Boinng/components/layout/Navbar.tsx#16-190) (show total quantity, not distinct items count)
- [/] Fix [ProductDetails](file:///d:/Boinng/tying/Boinng/components/product/ProductDetails.tsx#9-271) SSR — remove `if (!isClient) return null` → show skeleton instead

## 🟡 Medium Priority
- [/] Fix `any` types in [FeaturedProductsContent](file:///d:/Boinng/tying/Boinng/components/home/FeaturedProductsContent.tsx#108-165) → use [Product](file:///d:/Boinng/tying/Boinng/lib/shopify/types.ts#44-59) type
- [/] Remove `dangerouslySetInnerHTML` from [ProductDetails](file:///d:/Boinng/tying/Boinng/components/product/ProductDetails.tsx#9-271) — sanitize or strip HTML tags
- [/] Delete dead file [ProductDetailsNew.tsx](file:///d:/Boinng/tying/Boinng/components/product/ProductDetailsNew.tsx)
- [/] Clean up commented-out code blocks in [Features.tsx](file:///d:/Boinng/tying/Boinng/components/home/Features.tsx)
- [/] Remove `console.log` from [lib/cart/context.tsx](file:///d:/Boinng/tying/Boinng/lib/cart/context.tsx)

## 🟢 Low Priority
- [/] Switch `sessionStorage` → `localStorage` in cart context
- [/] Remove stale nav comment (commented-out "Shop Now" CTA in Navbar)
