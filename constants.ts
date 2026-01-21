
import { SectionConfig } from './types';

export const SCROLL_TO_DEPTH_RATIO = 0.02;
export const TOTAL_SCROLL_HEIGHT = 10000;

export const SECTIONS: SectionConfig[] = [
  {
    id: 'origin',
    depth: 0,
    title: 'ORIGIN',
    subtitle: 'New Arrivals',
    color: 0x00b4ff,
    accent: '#00b4ff',
    collectionHandle: 'new-arrivals',
    description: 'The latest tactical deployments. Engineered for the first wave of urban exploration.',
    planetSize: 1.2
  },
  {
    id: 'outerwear',
    depth: -40,
    title: 'STASIS',
    subtitle: 'Outerwear',
    color: 0xffffff,
    accent: '#ffffff',
    collectionHandle: 'outerwear',
    description: 'Advanced thermal regulation and ballistic-grade textiles for high-altitude stasis.',
    planetSize: 5
  },
  {
    id: 'modular',
    depth: -80,
    title: 'SYSTEMS',
    subtitle: 'Hoodies & Tops',
    color: 0x94a3b8,
    accent: '#94a3b8',
    collectionHandle: 'hoodies',
    description: 'Modular layering systems for adaptive environments. Comfort meets kinetic energy.',
    planetSize: 4
  },
  {
    id: 'archive',
    depth: -120,
    title: 'LEGACY',
    subtitle: 'The Archive',
    color: 0xff4000,
    accent: '#ff4000',
    collectionHandle: 'archive',
    description: 'Combat-proven relics and foundational units. Re-encrypted for the next generation.',
    planetSize: 6
  }
];

export const SEASON_METADATA: Record<string, { label: string; alert: string; color: string }> = {
  origin: { label: 'DEEP SPACE', alert: 'ORBITAL STABILITY', color: '#00b4ff' },
  outerwear: { label: 'STASIS', alert: 'CLIMATE SHIFT: CRYOGENIC', color: '#ffffff' },
  modular: { label: 'SYSTEMS', alert: 'ENVIRONMENT: DATA STREAM', color: '#94a3b8' },
  archive: { label: 'LEGACY', alert: 'THERMAL ANOMALY DETECTED', color: '#ff4000' }
};
