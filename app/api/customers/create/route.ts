import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/customers/create
 * 
 * Creates a new Shopify customer via Storefront API
 * (Uses unauthenticated_write_customers scope for headless apps)
 * 
 * Request body:
 * {
 *   email: string (required)
 *   firstName?: string
 *   lastName?: string
 *   phone?: string
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   customer?: { id, email, firstName, lastName, phone }
 *   errors?: string[]
 *   message?: string
 * }
 */

const CREATE_CUSTOMER_MUTATION = `
  mutation CreateCustomer($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        phone
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

interface CustomerCreateInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface StorefrontCreateCustomerResponse {
  data?: {
    customerCreate: {
      customer: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
      } | null;
      customerUserErrors: Array<{ code: string; field: string[]; message: string }>;
    };
  };
  errors?: Array<{ message: string }>;
}

async function shopifyStorefrontFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const url = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Storefront API error: ${response.statusText}`);
  }

  return response.json();
}

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Missing Shopify Storefront API configuration' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { email, firstName, lastName, phone } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Trim and validate email format
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Build customer input
    const customerInput: CustomerCreateInput = {
      email: trimmedEmail,
    };

    if (firstName) customerInput.firstName = firstName.trim();
    if (lastName) customerInput.lastName = lastName.trim();
    if (phone) customerInput.phone = phone.trim();

    // Call Shopify Storefront API
    const response = await shopifyStorefrontFetch<StorefrontCreateCustomerResponse>(CREATE_CUSTOMER_MUTATION, {
      input: customerInput,
    });

    console.log('[/api/customers/create] Shopify response:', JSON.stringify(response, null, 2));

    // Handle GraphQL errors
    if (response.errors) {
      console.error('[/api/customers/create] GraphQL errors:', response.errors);
      return NextResponse.json(
        {
          success: false,
          message: response.errors[0]?.message || 'GraphQL error',
        },
        { status: 400 }
      );
    }

    // Handle errors from Shopify
    const errors = response.data?.customerCreate?.customerUserErrors;
    if (errors && errors.length > 0) {
      console.error('[/api/customers/create] Customer user errors:', errors);
      return NextResponse.json(
        {
          success: false,
          errors: errors.map(e => e.message),
          message: errors[0]?.message || 'Failed to create customer',
        },
        { status: 400 }
      );
    }

    const customer = response.data?.customerCreate?.customer;
    if (!customer) {
      console.error('[/api/customers/create] No customer returned, full response:', JSON.stringify(response, null, 2));
      return NextResponse.json(
        { success: false, message: 'Failed to create customer' },
        { status: 400 }
      );
    }

    console.log(`[/api/customers/create] Customer created successfully: ${customer.id}`);

    return NextResponse.json(
      {
        success: true,
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
        },
        message: `Customer ${customer.email} created successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[/api/customers/create] Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
