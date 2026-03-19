import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify/client';
import { NAVIGATION_MENU_QUERY } from '@/lib/shopify/queries';

interface MenuItem {
  title: string;
  url: string;
  items?: MenuItem[];
}

interface MenuResponse {
  menu: {
    title: string;
    items: MenuItem[];
  };
}

/**
 * Fetch announcements from a Shopify menu (labels only — URLs are ignored)
 *
 * Set up in Shopify Admin:
 * 1. Go to Online Store > Navigation
 * 2. Create a menu with handle "announcements"
 * 3. Add items — only the Title matters (e.g. "🎉 Free shipping over ₹799")
 *    Set URL to anything (e.g. /)
 */

const MENU_HANDLE = 'announcements';

export async function GET(request: NextRequest) {
  try {
    const response = await shopifyFetch<MenuResponse>({
      query: NAVIGATION_MENU_QUERY,
      variables: {
        handle: MENU_HANDLE,
      },
      cache: 'force-cache',
    });

    if (!response.menu) {
      return NextResponse.json(
        {
          announcements: null,
          message: `Menu "${MENU_HANDLE}" not found. Create it in Shopify Admin → Online Store → Navigation`,
        },
        { status: 404 }
      );
    }

    // Only extract titles — URLs are intentionally ignored
    const announcements = response.menu.items.map((item) => item.title);

    return NextResponse.json(
      { announcements },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('Announcements fetch error:', error);
    return NextResponse.json(
      {
        announcements: null,
        error: 'Failed to fetch announcements',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}