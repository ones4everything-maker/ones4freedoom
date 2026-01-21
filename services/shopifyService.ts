
import { ShopifyProduct } from '../types';

// Replace these with your actual store values if different
const DOMAIN = 'ones4ever.myshopify.com';
const TOKEN = '6c18e49b3facd7b3f8cb2340803cebb5';

export const fetchCollectionProducts = async (handle: string): Promise<ShopifyProduct[]> => {
  // If category is 'all', we might want to fetch a specific 'all-products' collection 
  // or just default to 'frontpage' if you don't have a specific handle.
  const targetHandle = handle === 'all' ? 'frontpage' : handle;

  const query = `
    query getCollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              description
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 4) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query, variables: { handle: targetHandle } }),
    });

    const result = await response.json();
    if (result.errors) {
      console.warn(`[ShopifyService] API Error:`, result.errors);
      return [];
    }
    
    return result.data?.collectionByHandle?.products.edges.map((e: any) => e.node) || [];
  } catch (error) {
    console.error(`[ShopifyService] Error fetching collection '${targetHandle}':`, error);
    return [];
  }
};
