
import { ShopifyProduct } from '../types';
import { ProductItem, ThemeColor } from '../features/shop/data/products';
import { Shield, Wind, Zap, Activity, Box, Maximize } from 'lucide-react';

// Replace these with your actual store values if different
const DOMAIN = 'ones4ever.myshopify.com';
const TOKEN = '6c18e49b3facd7b3f8cb2340803cebb5';

export const fetchAllShopifyProducts = async (): Promise<ProductItem[]> => {
  const query = `
    query getProducts {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            productType
            tags
            availableForSale
            totalInventory
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                }
              }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  sku
                  compareAtPrice {
                    amount
                  }
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
  `;

  try {
    const response = await fetch(`https://${DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (result.errors) {
      console.error('[ShopifyService] API Error:', result.errors);
      return [];
    }

    return result.data.products.edges.map(({ node }: any) => {
        // Map Theme from tags (default to cyan)
        let theme: ThemeColor = 'cyan';
        if (node.tags.includes('theme:purple')) theme = 'purple';
        if (node.tags.includes('theme:orange')) theme = 'orange';

        // Customization Logic
        const customize = node.tags.includes('customize');
        const subli = node.tags.includes('subli');

        // Map Colors from variant options
        const colors = new Set<string>();
        node.variants.edges.forEach((v: any) => {
            const colorOpt = v.node.selectedOptions.find((o: any) => o.name === 'Color' || o.name === 'Colour');
            if (colorOpt) colors.add(colorOpt.value);
        });
        
        const colorArray = Array.from(colors).map(c => {
             const lower = c.toLowerCase();
             let hex = '#5F84C6';
             if (lower === 'black') hex = '#000000';
             else if (lower === 'white') hex = '#ffffff';
             else if (lower === 'beige') hex = '#dcbfa6';
             else if (lower === 'green' || lower === 'olive') hex = '#2a3b2a';
             else if (lower === 'gray' || lower === 'grey') hex = '#9aa6b2';
             else if (lower === 'navy') hex = '#0a1a2a';
             
             return { name: c, hex };
        });
        
        if (colorArray.length === 0) colorArray.push({ name: 'Standard', hex: '#000000' });

        // Map Sizes from variant options
        const sizes = new Set<string>();
         node.variants.edges.forEach((v: any) => {
            const sizeOpt = v.node.selectedOptions.find((o: any) => o.name === 'Size');
            if (sizeOpt) sizes.add(sizeOpt.value);
        });
        const sizeArray = Array.from(sizes);
        if (sizeArray.length === 0) sizeArray.push('ONESIZE');

        // Price
        const price = parseFloat(node.priceRange.minVariantPrice.amount);
        const firstVariant = node.variants.edges[0]?.node;
        const compareAt = firstVariant?.compareAtPrice?.amount 
            ? parseFloat(firstVariant.compareAtPrice.amount) 
            : undefined;

        // Features (Mock generation based on tags/type as Shopify doesn't have native structured features)
        const features = [
            { title: 'Premium Material', desc: 'High-grade tactical fabric', icon: Shield },
            { title: 'Breathable', desc: 'Active ventilation', icon: Wind },
            { title: 'Durable', desc: 'Reinforced construction', icon: Box },
        ];

        return {
            id: firstVariant?.id || node.id, // Use first variant ID for simple add-to-cart
            name: node.title,
            price: price,
            compareAtPrice: compareAt,
            image: node.images.edges[0]?.node.url || '',
            additionalImages: node.images.edges.slice(1).map((e: any) => e.node.url),
            theme,
            tags: node.tags,
            category: node.productType ? node.productType.toLowerCase() : 'featured',
            sku: firstVariant?.sku || 'N/A',
            description: node.description || 'No detailed description available for this unit.',
            sizes: sizeArray,
            colors: colorArray,
            specs: [
                { label: 'Origin', value: 'Imported' },
                { label: 'Type', value: node.productType || 'Apparel' }
            ], 
            features,
            reviews: [], // Shopify Storefront API doesn't support reviews natively without extensions
            availableForSale: node.availableForSale,
            totalInventory: node.totalInventory || 10,
            customize,
            subli
        };
    });

  } catch (error) {
    console.error('[ShopifyService] Fetch All Failed:', error);
    return [];
  }
};

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

export const createCheckout = async (items: { variantId: string; quantity: number }[]): Promise<string | null> => {
  const query = `
    mutation cartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart {
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const lines = items.map(item => ({
    merchandiseId: item.variantId,
    quantity: item.quantity
  }));

  try {
    const response = await fetch(`https://${DOMAIN}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query, variables: { lines } }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('[ShopifyService] Cart Create API Error:', result.errors);
      throw new Error('Failed to create cart');
    }

    if (result.data?.cartCreate?.userErrors?.length > 0) {
      console.error('[ShopifyService] Cart User Errors:', result.data.cartCreate.userErrors);
      // Fallback for mock IDs or invalid variants: alert the user
      throw new Error(result.data.cartCreate.userErrors[0].message);
    }

    return result.data?.cartCreate?.cart?.checkoutUrl || null;
  } catch (error) {
    console.error('[ShopifyService] Checkout Error:', error);
    return null;
  }
};
