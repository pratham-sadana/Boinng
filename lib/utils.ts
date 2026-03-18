import type { Product, ProductVariant } from './shopify/types';

/**
 * Format a Shopify money amount (string) to INR currency string.
 * e.g. "1999.00" → "₹1,999"
 */
export function formatMoney(amount: string, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
}

/**
 * Extract flat variant list from a product's edges/nodes.
 */
export function getVariants(product: Product): ProductVariant[] {
  return product.variants.edges.map((e) => e.node);
}

/**
 * Find the first available variant, or fall back to first variant.
 */
export function getDefaultVariant(product: Product): ProductVariant | undefined {
  const variants = getVariants(product);
  return variants.find((v) => v.availableForSale) ?? variants[0];
}

/**
 * Given a map of option name → selected value, find the matching variant.
 */
export function findVariantByOptions(
  product: Product,
  selected: Record<string, string>
): ProductVariant | undefined {
  return getVariants(product).find((v) =>
    v.selectedOptions.every((o) => selected[o.name] === o.value)
  );
}

/**
 * Check if a specific option value is available given current selections.
 */
export function isOptionAvailable(
  product: Product,
  selected: Record<string, string>,
  optionName: string,
  value: string
): boolean {
  const test = { ...selected, [optionName]: value };
  return getVariants(product).some(
    (v) =>
      v.availableForSale &&
      v.selectedOptions.every((o) => test[o.name] === o.value)
  );
}
