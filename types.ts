
export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  on_sale: boolean;
  images: {
    src: string;
    alt: string;
  }[];
  categories: { id: number; name: string; slug: string }[];
  short_description: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        availableForSale: boolean;
      };
    }[];
  };
}

export interface SectionConfig {
  id: string;
  depth: number; 
  title: string;
  subtitle: string;
  color: number; // Hex number for 3D
  accent: string; // Hex string for UI
  collectionHandle: string;
  description: string;
  planetSize: number;
}