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

// ─── Single Product (PDP) ────────────────────────────────────────────────────

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
        { namespace: "custom",      key: "size_guide" }
        { namespace: "descriptors", key: "care_guide" }
      ]) {
        key namespace value
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
          availableForSale
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
