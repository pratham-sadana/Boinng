/**
 * Utility functions for Shopify customer operations
 */

interface CreateCustomerInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}

interface CreateCustomerResponse {
  success: boolean;
  customer?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    createdAt: string;
  };
  message: string;
  errors?: Array<{ field: string[]; message: string }>;
}

/**
 * Create a new Shopify customer
 * @param input Customer input (email required)
 * @returns Customer creation response
 */
export async function createCustomer(input: CreateCustomerInput): Promise<CreateCustomerResponse> {
  try {
    const response = await fetch('/api/customers/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to create customer',
        errors: data.errors,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format customer name
 */
export function formatCustomerName(firstName?: string, lastName?: string): string {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(' ') || 'Unknown';
}
