
import { Shield, Box, Wind, Zap } from 'lucide-react';
import React from 'react';

export type ThemeColor = 'purple' | 'cyan' | 'orange';

export interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
    verified?: boolean;
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
    description: string;
    sku: string;
    sizes: string[];
    colors: { name: string, hex: string }[];
    specs: { label: string, value: string }[];
    features: { title: string, desc: string, icon: any }[];
    reviews: Review[];
    availableForSale: boolean;
    totalInventory: number;
}

const MOCK_REVIEWS: Review[] = [
    { id: 'r1', user: 'OPERATOR_42', rating: 5, date: '2025.05.12', comment: 'Exceptional build quality. The fabric withstands high-intensity movement without restricting mobility.', verified: true },
    { id: 'r2', user: 'GHOST_PULSE', rating: 4, date: '2025.05.10', comment: 'Fit is perfect. Minimal design but maximum impact. Shipping was tactical-grade speed.', verified: true },
    { id: 'r3', user: 'CYBER_Viper', rating: 5, date: '2025.05.08', comment: 'The camo pattern is more subtle in person, which I prefer. Very breathable for summer ops.', verified: true }
];

export const PRODUCTS: ProductItem[] = [
    {
        id: 't1',
        name: 'CAMO TANK TOP',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=800',
        theme: 'cyan',
        tags: ['Apparel', 'Tank Tops', 'Summer'],
        category: 'shirts',
        sku: 'CT-2025-MIN',
        description: 'Premium tactical camo tank top designed for maximum mobility and style. Features advanced moisture-wicking fabric and reinforced stitching.',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
            { name: 'BLACK', hex: '#000000' },
            { name: 'BEIGE', hex: '#dcbfa6' },
            { name: 'GRAY', hex: '#9aa6b2' },
            { name: 'GREEN', hex: '#2a3b2a' }
        ],
        specs: [{ label: 'Material', value: '85% Poly' }, { label: 'Fit', value: 'Minimal' }],
        features: [{ title: 'Durability', desc: 'Reinforced seams', icon: Shield }],
        reviews: MOCK_REVIEWS,
        availableForSale: true,
        totalInventory: 42
    },
    {
        id: '1',
        name: 'Unisex Oversized Hoodie',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1551488852-080175b21631?auto=format&fit=crop&q=80&w=800',
        additionalImages: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
        ],
        theme: 'purple',
        tags: ['streetwear', 'cotton', 'unisex', 'hoodies'],
        category: 'hoodies',
        sku: 'UH-2025-X',
        description: 'Premium heavyweight cotton blend with a relaxed drop-shoulder fit. Engineered for comfort and style in high-density urban environments. Features reinforced stitching and a deep double-lined hood.',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'BLACK', hex: '#000000' }],
        specs: [{ label: 'Weight', value: '500 GSM' }],
        features: [{ title: 'Structure', desc: 'Heavy fabric', icon: Box }],
        reviews: [
            { id: 'r1', user: 'Alex K.', rating: 5, comment: 'Incredible quality. The fit is exactly what I was looking for.', date: '2023-11-15', verified: true }
        ],
        availableForSale: true,
        totalInventory: 15
    },
    {
        id: '2',
        name: 'Tech Zipper Jacket',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
        theme: 'cyan',
        tags: ['outerwear', 'waterproof', 'tech', 'jacket'],
        category: 'outerwear',
        sku: 'TJ-2025-ARC',
        description: 'Engineered for the elements. Features waterproof ballistic nylon and concealed magnetic pockets for your tech essentials. Designed with a modular zipper system.',
        sizes: ['M', 'L', 'XL'],
        colors: [{ name: 'SIENNA', hex: '#a0522d' }],
        specs: [{ label: 'Waterproof', value: '10,000mm' }],
        features: [{ title: 'Weatherproof', desc: 'Durable water repellent', icon: Wind }],
        reviews: [],
        availableForSale: true,
        totalInventory: 8
    }
];
