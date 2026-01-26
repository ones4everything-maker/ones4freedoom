
import { Shield, Box, Wind, Zap, Droplets, Activity, Maximize } from 'lucide-react';

export type ThemeColor = 'purple' | 'cyan' | 'orange';

export interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
    verified?: boolean;
}

export interface Feature {
    title: string;
    desc: string;
    icon: any;
}

export interface Spec {
    label: string;
    value: string;
}

export interface CustomizationOptions {
    method: 'vinyl' | 'sublimation';
    isPremium: boolean;
    size: 'small' | 'medium';
    text: string;
    price: number;
}

export interface ProductItem {
    id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    image: string;
    additionalImages?: string[];
    theme: ThemeColor;
    tags: string[];
    category: string;
    sku: string;
    description: string;
    sizes: string[];
    colors: { name: string, hex: string }[];
    specs: Spec[];
    features: Feature[];
    reviews: Review[];
    availableForSale: boolean;
    totalInventory: number;
    customize?: boolean;
    subli?: boolean;
    selectedCustomization?: CustomizationOptions;
}

const MOCK_REVIEWS: Review[] = [
    { id: 'r1', user: 'OPERATOR_42', rating: 5, date: '2025.05.12', comment: 'Exceptional build quality. The fabric withstands high-intensity movement without restricting mobility.', verified: true },
    { id: 'r2', user: 'GHOST_PULSE', rating: 4, date: '2025.05.10', comment: 'Fit is perfect. Minimal design but maximum impact.', verified: true }
];

export const PRODUCTS: ProductItem[] = [
    {
        id: 't1',
        name: 'CAMO TANK TOP',
        price: 16.99,
        compareAtPrice: 24.99,
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
        additionalImages: [
             'https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?auto=format&fit=crop&q=80&w=800'
        ],
        theme: 'cyan',
        tags: ['Tactical', 'Training', 'Breathable', 'customize'],
        category: 'tops',
        sku: 'CT-2024-001',
        description: 'Premium tactical camo tank top designed for maximum mobility and style. Features advanced moisture-wicking fabric and reinforced stitching. Perfect for intense workouts or casual streetwear.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
            { name: 'BLACK', hex: '#000000' },
            { name: 'BEIGE', hex: '#dcbfa6' },
            { name: 'GRAY', hex: '#9aa6b2' },
            { name: 'GREEN', hex: '#2a3b2a' }
        ],
        specs: [
            { label: 'Material', value: '85% Polyester, 15% Spandex' },
            { label: 'Fit', value: 'Athletic Fit' },
            { label: 'Care', value: 'Machine Wash Cold' }
        ],
        features: [
            { title: 'Durable Construction', desc: 'Reinforced seams for long-lasting wear', icon: Shield },
            { title: 'Moisture Wicking', desc: 'Keeps you dry during intense activity', icon: Droplets },
            { title: 'Lightweight', desc: 'Featherlight fabric for speed', icon: Wind }
        ],
        reviews: MOCK_REVIEWS,
        availableForSale: true,
        totalInventory: 42,
        customize: true,
        subli: true
    },
    {
        id: 'h1',
        name: 'UNISEX OVERSIZED HOODIE',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1551488852-080175b21631?auto=format&fit=crop&q=80&w=800',
        theme: 'purple',
        tags: ['Streetwear', 'Heavyweight', 'Cotton', 'customize'],
        category: 'hoodies',
        sku: 'UH-2025-X',
        description: 'Premium heavyweight cotton blend with a relaxed drop-shoulder fit. Engineered for comfort and style in high-density urban environments.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'BLACK', hex: '#000000' }],
        specs: [
            { label: 'Weight', value: '500 GSM French Terry' },
            { label: 'Fit', value: 'Oversized Boxy' },
            { label: 'Origin', value: 'Fabricated in Sector 7' }
        ],
        features: [
            { title: 'Heavy Duty', desc: 'Built to withstand zero-G environments', icon: Box },
            { title: 'Thermal Lock', desc: 'Retains body heat in stasis', icon: Activity }
        ],
        reviews: [],
        availableForSale: true,
        totalInventory: 15,
        customize: true,
        subli: false
    },
    {
        id: 'j1',
        name: 'TECH ZIPPER JACKET',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
        theme: 'cyan',
        tags: ['Outerwear', 'Waterproof', 'Modular'],
        category: 'outerwear',
        sku: 'TJ-2025-ARC',
        description: 'Engineered for the elements. Features waterproof ballistic nylon and concealed magnetic pockets for your tech essentials.',
        sizes: ['M', 'L', 'XL'],
        colors: [{ name: 'SIENNA', hex: '#a0522d' }],
        specs: [
            { label: 'Rating', value: '10,000mm Waterproof' },
            { label: 'Pockets', value: '6 Magnetic Closures' },
            { label: 'Lining', value: 'Mesh Breathable' }
        ],
        features: [
            { title: 'Storm Proof', desc: 'Durable Water Repellent Coating', icon: Wind },
            { title: 'Modular', desc: 'Compatible with Vest Attachments', icon: Maximize }
        ],
        reviews: [],
        availableForSale: true,
        totalInventory: 8,
        customize: false
    }
];
