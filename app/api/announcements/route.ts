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
const FALLBACK_ANNOUNCEMENTS = [
  'Free shipping over Rs 799',
  'New drops every Friday',
  'Proudly made in India',
  'Easy returns within 7 days',
];

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
          announcements: FALLBACK_ANNOUNCEMENTS,
          source: 'fallback',
          message: `Menu "${MENU_HANDLE}" not found. Using fallback announcements.`,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
          },
        }
      );
    }

    // Only extract titles — URLs are intentionally ignored
    const announcements = response.menu.items.map((item) => item.title);

    return NextResponse.json(
      { announcements },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Announcements fetch error:', error);
    return NextResponse.json(
      {
        announcements: FALLBACK_ANNOUNCEMENTS,
        source: 'fallback',
        error: 'Shopify unavailable, using fallback announcements',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=120, stale-while-revalidate=60',
        },
      }
    );
  }
}