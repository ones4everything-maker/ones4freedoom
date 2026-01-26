
import React from 'react';
import { Layers, Shirt, Scissors, ShoppingBag, Tag, Sparkles, Star } from 'lucide-react';

export const CATEGORIES = [
    { id: 'all', label: 'All', icon: Star },
    { id: 'new-arrivals', label: 'New', icon: Sparkles },
    { id: 'hoodies', label: 'Hoodies', icon: Layers },
    { id: 'tops', label: 'Tops', icon: Shirt },
    { id: 'bottoms', label: 'Pants', icon: Scissors },
    { id: 'accessories', label: 'Gear', icon: ShoppingBag }
];

interface CategoryTabsProps {
    activeCategory: string;
    onSelect: (id: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onSelect }) => {
    return (
        <div className="flex gap-2">
            {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelect(cat.id)}
                        className={`px-4 py-2 rounded-full border text-xs font-bold transition-all whitespace-nowrap
                            ${isActive 
                                ? 'bg-[#00FFD1] border-[#00FFD1] text-[#07163D] shadow-[0_0_15px_rgba(0,255,209,0.4)]' 
                                : 'bg-[#021959]/40 backdrop-blur-md border-[#00FFD1]/10 text-[#9AA4B2] hover:text-[#00FFD1] hover:border-[#00FFD1]/40 hover:bg-[#00FFD1]/5'}`}
                    >
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
};
