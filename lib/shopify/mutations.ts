/**
 * Shopify Admin API GraphQL mutations
 */

export const CREATE_CUSTOMER_MUTATION = `
  mutation CreateCustomer($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_CUSTOMER_MUTATION = `
  mutation UpdateCustomer($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
        updatedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const SEND_CUSTOMER_INVITE_MUTATION = `
  mutation SendCustomerInvite($customerId: ID!) {
    customerInviteCreate(input: { customerId: $customerId }) {
      customerInvite {
        id
        email
        createdAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;
