
import React from 'react';
import { Layers, Shirt, Scissors, ShoppingBag, Tag, Sparkles, Star } from 'lucide-react';

export const CATEGORIES = [
    { id: 'all', label: 'Featured', icon: Star },
    { id: 'new-arrivals', label: 'New Arrivals', icon: Sparkles },
    { id: 'hoodies', label: 'Hoodies', icon: Layers },
    { id: 'shirts', label: 'Shirts', icon: Shirt },
    { id: 'tops', label: 'Tops', icon: Shirt },
    { id: 'bottoms', label: 'Bottoms', icon: Scissors },
    { id: 'outerwear', label: 'Outerwear', icon: Layers },
    { id: 'accessories', label: 'Accessories', icon: ShoppingBag },
    { id: 'archive', label: 'Archive', icon: Tag }
];

interface CategoryTabsProps {
    activeCategory: string;
    onSelect: (id: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onSelect }) => {
    return (
        <div className="w-full overflow-x-auto no-scrollbar py-6 flex gap-4 px-2">
            {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelect(cat.id)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all border font-display font-bold text-[10px] uppercase tracking-[0.2em] group
                            ${isActive 
                                ? 'bg-cyan-400 border-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                                : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                    >
                        <Icon size={16} className={isActive ? 'text-black' : 'text-cyan-400/50 group-hover:text-cyan-400'} />
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
};
