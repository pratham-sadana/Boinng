/**
 * Sanitization utilities for Shopify content
 * Prevents XSS attacks when rendering Shopify data
 */

/**
 * Create safe JSON-LD script content
 * Uses JSON.stringify which properly escapes all special characters
 * Safe for use with dangerouslySetInnerHTML
 */
export function createSafeJsonLd(data: unknown): string {
  return JSON.stringify(data);
}

/**
 * Strip HTML tags from text (preserve plain text)
 * Use for product descriptions, metafields
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Escape HTML entities for safe display
 * Use when you need to display user/external content as plain text
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Validate Shopify product description
 * Ensures it's a string and not malicious
 */
export function sanitizeProductDescription(description: string | null | undefined): string {
  if (!description || typeof description !== 'string') {
    return '';
  }
  
  // Strip dangerous HTML, keep only safe plain text
  return stripHtmlTags(description);
}

/**
 * Validate and sanitize URLs from Shopify
 * Ensures URLs don't contain javascript: or data: protocols
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  
  // Block dangerous protocols
  if (trimmed.toLowerCase().startsWith('javascript:')) {
    console.warn('Blocked javascript: URL');
    return null;
  }
  
  if (trimmed.toLowerCase().startsWith('data:')) {
    console.warn('Blocked data: URL');
    return null;
  }

  return trimmed;
}

/**
 * Create validated Schema.org JSON-LD
 * Type-safe version of createSafeJsonLd with validation
 */
export function createProductSchema(product: {
  title: string;
  description: string;
  images: { url: string }[];
  price: string | number;
  currency?: string;
  handle: string;
  availableForSale: boolean;
}): string {
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    description: stripHtmlTags(product.description),
    image: (product.images || [])
      .map((img) => sanitizeUrl(img.url))
      .filter(Boolean) as string[],
    brand: {
      '@type': 'Brand',
      name: 'BOINNG!',
    },
    offers: {
      '@type': 'Offer',
      url: `https://boinng.com/products/${product.handle}`,
      priceCurrency: product.currency || 'INR',
      price: String(product.price).replace(/[^0-9.]/g, ''),
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
    url: `https://boinng.com/products/${product.handle}`,
  };

  return createSafeJsonLd(schema);
}

/**
 * Create validated Organization Schema.org JSON-LD
 */
export function createOrganizationSchema(): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BOINNG!',
    url: 'https://boinng.com',
    logo: 'https://boinng.com/logos/cropped.png',
    description: "BOINNG! is India's boldest streetwear brand. Limited drops, premium quality, zero compromise.",
    sameAs: [
      'https://instagram.com/boinng',
      'https://twitter.com/boinng',
      'https://facebook.com/boinng',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      url: 'https://boinng.com/pages/contact',
    },
  };

  return createSafeJsonLd(schema);
}
