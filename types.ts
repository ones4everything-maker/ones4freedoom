export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  on_sale: boolean;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  short_description: string;
}

export interface SectionConfig {
  id: string;
  depth: number; // The Z-depth in 3D space
  title: string;
  subtitle: string;
  color: string; // Hex string for UI
  wireframeColor: number; // Hex number for Three.js
  categorySlug: string; // Matches WooCommerce Category Slug
  description?: string;
}

export interface ScrollState {
  progress: number; // 0 to 1
  depth: number; // Current Z depth
  activeSectionId: string;
}
