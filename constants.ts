
import { SectionConfig } from './types';

export const SCROLL_TO_DEPTH_RATIO = 0.02;
export const TOTAL_SCROLL_HEIGHT = 10000;

export const SECTIONS: SectionConfig[] = [
  {
    id: 'origin',
    depth: 0,
    title: 'Hibernal Midnight',
    subtitle: 'Envelop in Timeless Warmth Where warmth meets Design',
    color: 0x00b4ff,
    accent: '#00b4ff',
    collectionHandle: 'hoodies',
    description: 'Engineered for winter under the ONES4 doctrine—reinforced layers, deep hues, and controlled structure without excess',
    planetSize: 1.2
  },
  {
    id: 'outerwear',
    depth: -40,
    title: 'Vernal Awakening',
    subtitle: 'Where elegance blooms anew.',
    color: 0xffffff,
    accent: '#ffffff',
    collectionHandle: 'outerwear',
    description: 'A seasonal reset. Fluid layers and organic materials introduce softness without losing structure—an ONES4 approach to spring',
    planetSize: 5
  },
  {
    id: 'modular',
    depth: -80,
    title: 'Reactive Sunlit',
    subtitle: 'Where summer journeys begin',
    color: 0x94a3b8,
    accent: '#94a3b8',
    collectionHandle: 'hnew-arrivals',
    description: 'Reactive Sunlit captures the brilliance of summer in motion—an invitation to wander, explore, and glow under open skies. Inspired by sun-drenched escapes and effortless luxury, the collection blends relaxed adventure with refined style',
    planetSize: 4
  },
  {
    id: 'archive',
    depth: -120,
    title: 'The Textural Harvest',
    subtitle: 'Foundational Pieces',
    color: 0xFCD34D, // Gold (Matches Planet Theme) - Was Orange
    accent: '#FCD34D', // Gold - Was Orange
    collectionHandle: 'archive',
    description: 'reflects a thoughtful assemblage of materials, from soft cashmeres to supple leathers and structured wools. Aligned with the sensory branding movement, it encourages an emotional connection by engaging the sense of touch as much as sight..',
    planetSize: 6
  }
];

export const SEASON_METADATA: Record<string, { label: string; alert: string; color: string }> = {
  origin: { label: 'DROP', alert: 'ORBITAL STABILITY', color: '#00b4ff' },
  outerwear: { label: 'ACTIVE', alert: 'CLIMATE SHIFT: CRYOGENIC', color: '#ffffff' },
  modular: { label: 'CORE', alert: 'ENVIRONMENT: DATA STREAM', color: '#94a3b8' },
  archive: { label: 'LEGACY', alert: 'THERMAL ANOMALY DETECTED', color: '#FCD34D' } // Gold
};
