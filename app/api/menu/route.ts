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
 * Fetch navigation menu from Shopify
 * 
 * Set up in Shopify Admin:
 * 1. Go to Settings > Menus
 * 2. Create a menu named "main-nav" or similar
 * 3. Add collection/custom links to the menu
 * 4. Update the MENU_HANDLE constant below
 */

const MENU_HANDLE = 'main-nav'; // Set this to your Shopify menu handle
const FALLBACK_MENU_ITEMS = [
  { label: 'New Arrivals', href: '/categories/new-arrivals', submenu: [] },
  { label: 'Best Sellers', href: '/categories/best-sellers', submenu: [] },
  { label: 'Sale', href: '/categories/sale', submenu: [] },
  { label: 'All Categories', href: '/categories', submenu: [] },
];

export async function GET(request: NextRequest) {
  try {
    const response = await shopifyFetch<MenuResponse>({
      query: NAVIGATION_MENU_QUERY,
      variables: {
        handle: MENU_HANDLE,
      },
      cache: 'force-cache', // Cache for 1 hour
    });

    if (!response.menu) {
      return NextResponse.json(
        {
          menu: {
            title: 'Fallback Menu',
            items: FALLBACK_MENU_ITEMS,
          },
          source: 'fallback',
          message: `Menu "${MENU_HANDLE}" not found. Using fallback navigation.`,
        },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
          },
        }
      );
    }

    // Transform Shopify URLs to relative paths
    const transformedItems = response.menu.items.map(item => ({
      label: item.title,
      href: transformUrl(item.url),
      submenu: item.items?.map(subitem => ({
        label: subitem.title,
        href: transformUrl(subitem.url),
      })) || [],
    }));

    return NextResponse.json(
      {
        menu: {
          title: response.menu.title,
          items: transformedItems,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json(
      {
        menu: {
          title: 'Fallback Menu',
          items: FALLBACK_MENU_ITEMS,
        },
        source: 'fallback',
        error: 'Shopify unavailable, using fallback menu',
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

/**
 * Transform Shopify store URLs to relative paths
 * Examples:
 * - https://yourstore.myshopify.com/collections/new-arrivals -> /categories/new-arrivals
 * - https://yourstore.myshopify.com/pages/about → /pages/about
 */
function transformUrl(url: string): string {
  if (!url) return '#';

  try {
    const urlObj = new URL(url);
    // Keep relative path and remap Shopify collections URLs to app categories URLs.
    return urlObj.pathname.replace(/^\/collections(?=\/|$)/, '/categories');
  } catch {
    // If URL parsing fails, assume it's already a relative path
    return url.replace(/^\/collections(?=\/|$)/, '/categories');
  }
}
