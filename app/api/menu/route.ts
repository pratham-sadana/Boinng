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
          menu: null,
          message: `Menu "${MENU_HANDLE}" not found. Create it in Shopify Admin → Settings → Menus`,
        },
        { status: 404 }
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
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json(
      {
        menu: null,
        error: 'Failed to fetch menu',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
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
