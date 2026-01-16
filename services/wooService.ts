import { WooProduct } from '../types';

const API_URL = process.env.VITE_WOO_API_URL || 'https://your-wordpress-site.com/wp-json/wc/v3';
const CONSUMER_KEY = process.env.VITE_WOO_CONSUMER_KEY || '';
const CONSUMER_SECRET = process.env.VITE_WOO_CONSUMER_SECRET || '';

// Mock data generator for fallback
const getMockProducts = (category: string): WooProduct[] => {
  const seeds = [1, 2, 3, 4];
  return seeds.map((i) => ({
    id: Math.random() * 10000 + i,
    name: `${category.toUpperCase()} Unit 0${i}`,
    slug: `${category}-unit-0${i}`,
    price: (Math.random() * 100 + 50).toFixed(2),
    regular_price: (Math.random() * 100 + 100).toFixed(2),
    on_sale: i % 2 === 0,
    images: [
      {
        src: `https://picsum.photos/seed/${category}${i}/400/400`,
        alt: `${category} Product ${i}`,
      },
    ],
    categories: [{ id: 1, name: category, slug: category }],
    short_description: `Advanced unit designed for ${category} environments.`,
  }));
};

/**
 * Fetches products from WooCommerce REST API.
 * Falls back to mock data if credentials are missing or API fails.
 */
export const fetchProductsByCategory = async (categorySlug: string): Promise<WooProduct[]> => {
  // If no keys are configured, return mock data immediately to prevent errors
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.warn(`[WooService] No API keys found. Returning mock data for category: ${categorySlug}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return getMockProducts(categorySlug);
  }

  try {
    const url = new URL(`${API_URL}/products`);
    url.searchParams.append('consumer_key', CONSUMER_KEY);
    url.searchParams.append('consumer_secret', CONSUMER_SECRET);
    url.searchParams.append('category', categorySlug);
    url.searchParams.append('status', 'publish');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`WooCommerce API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // If empty or error, fallback to mock for demo purposes
    if (!Array.isArray(data) || data.length === 0) {
      console.warn(`[WooService] No products found for ${categorySlug}, using fallback.`);
      return getMockProducts(categorySlug);
    }

    return data as WooProduct[];
  } catch (error) {
    console.error('[WooService] Fetch failed', error);
    return getMockProducts(categorySlug);
  }
};
