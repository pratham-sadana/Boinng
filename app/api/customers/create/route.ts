import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/customers/create
 * 
 * Creates a new Shopify customer via Admin API
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
 *   customer?: { id, email, firstName, lastName, phone, createdAt }
 *   errors?: [{ field, message }]
 *   message?: string
 * }
 */

const CREATE_CUSTOMER_MUTATION = `
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

interface CustomerInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface CreateCustomerResponse {
  data?: {
    customerCreate: {
      customer: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        createdAt: string;
        updatedAt: string;
      } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  };
  errors?: Array<{ message: string }>;
}

async function shopifyAdminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const url = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Admin API error: ${response.statusText}`);
  }

  return response.json();
}

export async function POST(req: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.SHOPIFY_STORE_DOMAIN || !process.env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
      return NextResponse.json(
        { success: false, message: 'Missing Shopify Admin API configuration' },
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
    const customerInput: CustomerInput = {
      email: trimmedEmail,
    };

    if (firstName) customerInput.firstName = firstName.trim();
    if (lastName) customerInput.lastName = lastName.trim();
    if (phone) customerInput.phone = phone.trim();

    // Call Shopify Admin API
    const response = await shopifyAdminFetch<CreateCustomerResponse>(CREATE_CUSTOMER_MUTATION, {
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
    const errors = response.data?.customerCreate?.userErrors;
    if (errors && errors.length > 0) {
      console.error('[/api/customers/create] User errors:', errors);
      return NextResponse.json(
        {
          success: false,
          errors,
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

    return NextResponse.json(
      {
        success: true,
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          createdAt: customer.createdAt,
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
