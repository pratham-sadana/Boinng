// ─── Collection ─────────────────────────────────────────────────────────────

export const COLLECTION_QUERY = `
  query Collection($handle: String!, $first: Int = 24) {
    collection(handle: $handle) {
      title
      description
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            vendor
            options { name values }
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount currencyCode }
            }
            featuredImage { url altText width height }
            images(first: 10) { edges { node { url altText width height } } }
            tags
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                  selectedOptions { name value }
                  image { url altText width height }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Single Product (PDP) ────────────────────────────────────────────────────
// ─── Single Product (PDP) ────────────────────────────────────────────────────
// Fetches metafields from both "custom" namespace (user-created)
// and "descriptors" namespace (Shopify built-in product metafields).
// If fields still don't appear, check Shopify Admin → Settings → Custom Data
// and verify the exact namespace + key for each metafield.

// Shopify category metafields (fabric, activity etc.) are stored as
// metaobject references — the `value` field returns a raw GID string.
// Adding `reference { ... on Metaobject { fields { key value } } }`
// resolves the GID inline so you get actual data back.
 
// Replace PRODUCT_QUERY in queries.ts with this.
// Shopify category metafields (fabric, activity etc.) are stored as
// metaobject references — the `value` field returns a raw GID string.
// Adding `reference { ... on Metaobject { fields { key value } } }`
// resolves the GID inline so you get actual data back.

export const PRODUCT_QUERY = `
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      availableForSale
      tags
      options { name values }
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      compareAtPriceRange {
        minVariantPrice { amount currencyCode }
      }
      featuredImage { url altText width height }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
            image { url altText width height }
          }
        }
      }
      images(first: 10) {
        edges { node { url altText width height } }
      }
      metafields(identifiers: [
        { namespace: "shopify", key: "fabric" }
        { namespace: "shopify", key: "activity" }
        { namespace: "shopify", key: "accessory-size" }
        { namespace: "shopify", key: "clothing-features" }
        { namespace: "shopify", key: "target-gender" }
        { namespace: "shopify", key: "color-pattern" }
      ]) {
        key
        namespace
        value
        type
        reference {
          ... on Metaobject {
            fields {
              key
              value
            }
          }
        }
        references(first: 10) {
          nodes {
            ... on Metaobject {
              fields {
                key
                value
              }
            }
          }
        }
      }
    }
  }
`;
 
// ─── Featured Products (Homepage) ───────────────────────────────────────────

export const FEATURED_PRODUCTS_QUERY = `
  query FeaturedProducts($first: Int = 8) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          id
          title
          handle
          description
          availableForSale
          options { name values }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount currencyCode }
          }
          featuredImage { url altText width height }
          images(first: 10) { edges { node { url altText width height } } }
          tags
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                selectedOptions { name value }
                image { url altText width height }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Featured Collections (Homepage) ────────────────────────────────────────

export const FEATURED_COLLECTIONS_QUERY = `
  query FeaturedCollections($first: Int = 6) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image { url altText width height }
        }
      }
    }
  }
`;

// ─── All Collections ────────────────────────────────────────────────────────

export const ALL_COLLECTIONS_QUERY = `
  query AllCollections($first: Int = 50) {
    collections(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          title
          handle
          description
          image { url altText width height }
          products(first: 1) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;

// ─── All Products (Shop Page) ───────────────────────────────────────────────

export const ALL_PRODUCTS_QUERY = `
  query AllProducts($first: Int = 100) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          availableForSale
          options { name values }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount currencyCode }
          }
          featuredImage { url altText width height }
          images(first: 10) { edges { node { url altText width height } } }
          tags
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                selectedOptions { name value }
                image { url altText width height }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Cart Mutations ──────────────────────────────────────────────────────────

export const CREATE_CART = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    title
                    featuredImage { url altText width height }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

export const ADD_TO_CART = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    title
                    featuredImage { url altText width height }
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount { amount currencyCode }
        }
      }
      userErrors { field message }
    }
  }
`;

export const REMOVE_FROM_CART = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    title
                    featuredImage { url altText width height }
                  }
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

export const UPDATE_CART_LINE = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount { amount currencyCode }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product {
                    title
                    featuredImage { url altText width height }
                  }
                }
              }
            }
          }
        }
      }
      userErrors { field message }
    }
  }
`;

// ─── Fetch Cart (rehydration) ────────────────────────────────────────────────

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount currencyCode }
                product {
                  title
                  featuredImage { url altText width height }
                }
              }
            }
          }
        }
      }
      cost {
        totalAmount { amount currencyCode }
      }
    }
  }
`;

// ─── Product Search ─────────────────────────────────────────────────────────

export const SEARCH_PRODUCTS = `
  query SearchProducts($query: String!, $first: Int = 10) {
    search(first: $first, query: $query, types: PRODUCT) {
      edges {
        node {
          ... on Product {
            id
            title
            handle
            availableForSale
            vendor
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount currencyCode }
            }
            featuredImage { url altText width height }
            tags
            variants(first: 1) {
              edges {
                node {
                  id
                  price { amount currencyCode }
                  compareAtPrice { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Navigation Menu ────────────────────────────────────────────────────────

export const NAVIGATION_MENU_QUERY = `
  query NavigationMenu($handle: String!) {
    menu(handle: $handle) {
      title
      items {
        title
        url
        items {
          title
          url
        }
      }
    }
  }
`;
