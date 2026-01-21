
import { ShopifyProduct } from '../types';

const DOMAIN = 'ones4ever.myshopify.com';
const TOKEN = '6c18e49b3facd7b3f8cb2340803cebb5';

export const fetchCollectionProducts = async (handle: string): Promise<ShopifyProduct[]> => {
  const query = `
    query getCollectionByHandle($handle: String!) {
      collectionByHandle(handle: $handle) {
        products(first: 12) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    availableForSale
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
      body: JSON.stringify({ query, variables: { handle } }),
    });

    const result = await response.json();
    if (result.errors) throw new Error(result.errors[0].message);
    
    return result.data?.collectionByHandle?.products.edges.map((e: any) => e.node) || [];
  } catch (error) {
    console.error(`[ShopifyService] Error fetching ${handle}:`, error);
    return [];
  }
};
