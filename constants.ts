import { SectionConfig } from './types';

// Multiplier to convert scroll pixels to 3D depth units
// e.g. 1000px scroll = 10 units of depth
export const SCROLL_TO_DEPTH_RATIO = 0.015;

// Total height of the scrollable area (virtual height)
export const TOTAL_SCROLL_HEIGHT = 8000;

export const SECTIONS: SectionConfig[] = [
  {
    id: 'origin',
    depth: 0,
    title: 'ORIGIN',
    subtitle: 'Core Systems',
    color: '#00b4ff',
    wireframeColor: 0x00b4ff,
    categorySlug: 'featured', // Matches a "Featured" category in Woo
    description: 'Essential gear for the modern explorer. The foundation of the ONES4 ecosystem.'
  },
  {
    id: 'cryo',
    depth: -40,
    title: 'CRYO STASIS',
    subtitle: 'Zero Degree Protection',
    color: '#a5f3fc', // Cyan-200
    wireframeColor: 0xa5f3fc,
    categorySlug: 'winter',
    description: 'For zero-degree environments. Aerogel insulation derived from aerospace tech.'
  },
  {
    id: 'horizon',
    depth: -80,
    title: 'HORIZON',
    subtitle: 'Urban Mobility',
    color: '#fbbf24', // Amber-400
    wireframeColor: 0xfbbf24,
    categorySlug: 'tech',
    description: 'High-performance tech wear designed for the concrete jungle and beyond.'
  },
  {
    id: 'void',
    depth: -120,
    title: 'THE VOID',
    subtitle: 'Limited Editions',
    color: '#a855f7', // Purple-500
    wireframeColor: 0xa855f7,
    categorySlug: 'limited',
    description: 'Experimental fabrics and prototypes. Available for a limited time only.'
  }
];
