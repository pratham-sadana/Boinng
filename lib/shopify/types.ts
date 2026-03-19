// ─── Primitives ──────────────────────────────────────────────────────────────

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

// ─── Product ─────────────────────────────────────────────────────────────────

export type ProductOption = {
  name: string;
  values: string[];
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
  image?: ShopifyImage;
};

// ─── Metafield ───────────────────────────────────────────────────────────────

export type MetaobjectField = {
  key: string;
  value: string;
};

export type MetaobjectReference = {
  fields: MetaobjectField[];
};

export type Metafield = {
  key: string;
  namespace: string;
  value: string;
  type?: string;
  // Single metaobject reference (e.g. shopify.fabric)
  reference?: MetaobjectReference | null;
  // List of metaobject references
  references?: {
    nodes: MetaobjectReference[];
  } | null;
};

// ─── Product ─────────────────────────────────────────────────────────────────

export type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  tags: string[];
  options: ProductOption[];
  variants: { edges: { node: ProductVariant }[] };
  images: { edges: { node: ShopifyImage }[] };
  featuredImage?: ShopifyImage;
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange?: { minVariantPrice: Money };
  metafields?: (Metafield | null)[];
};

// ─── Transformed Product ─────────────────────────────────────────────────────

export type TransformedProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  price: string;
  comparePrice: string | null;
  currency: string;
  image: { url: string; alt: string; width: number; height: number } | null;
  images: { url: string; alt: string; width: number; height: number }[];
  variants: ProductVariant[];
  tags: string[];
  accessorySize?: string;
  fabric?: string;
  activity?: string;
  clothingFeatures?: string;
  targetGender?: string;
};

// ─── Collection ──────────────────────────────────────────────────────────────

export type Collection = {
  title: string;
  description: string;
  products: { edges: { node: Product }[] };
};

export type CollectionPreview = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: ShopifyImage;
  products?: { edges: { node: { id: string; title: string } }[] };
};

// ─── Cart ────────────────────────────────────────────────────────────────────

export type CartLineMerchandise = {
  id: string;
  title: string;
  price: Money;
  product: {
    title: string;
    featuredImage: ShopifyImage;
  };
};

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: CartLineMerchandise;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: { edges: { node: CartLine }[] };
  cost: { totalAmount: Money };
};

// ─── API Response Wrappers ───────────────────────────────────────────────────

export type UserError = {
  field: string | null;
  message: string;
};

export type CartCreateResponse = {
  cartCreate: {
    cart: Cart;
    userErrors: UserError[];
  };
};

export type CartLinesAddResponse = {
  cartLinesAdd: {
    cart: Cart;
    userErrors: UserError[];
  };
};

export type CartLinesRemoveResponse = {
  cartLinesRemove: {
    cart: Cart;
    userErrors: UserError[];
  };
};

export type CartLinesUpdateResponse = {
  cartLinesUpdate: {
    cart: Cart;
    userErrors: UserError[];
  };
};

export type GetCartResponse = {
  cart: Cart | null;
};

export type CollectionResponse = {
  collection: Collection | null;
};

export type FeaturedCollectionsResponse = {
  collections: { edges: { node: CollectionPreview }[] };
};

export type AllCollectionsResponse = {
  collections: { edges: { node: CollectionPreview }[] };
};

export type ProductResponse = {
  product: Product | null;
};

export type FeaturedProductsResponse = {
  products: { edges: { node: Product }[] };
};