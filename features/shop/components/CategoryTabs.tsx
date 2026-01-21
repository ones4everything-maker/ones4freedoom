
import React from 'react';
import { Layers, Shirt, Scissors, User, ShoppingBag, Tag } from 'lucide-react';

export const CATEGORIES = [
    { id: 'all', label: 'All Units', icon: Layers },
    { id: 'hoodies', label: 'Hoodies', icon: Layers },
    { id: 'shirts', label: 'Shirts', icon: Shirt },
    { id: 'shorts', label: 'Shorts', icon: Scissors },
    { id: 'hats', label: 'Hats', icon: User },
    { id: 'bags', label: 'Bags', icon: ShoppingBag },
    { id: 'sale', label: 'Archive', icon: Tag }
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
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl whitespace-nowrap transition-all border font-display font-bold text-[10px] uppercase tracking-[0.2em]
                            ${isActive 
                                ? 'bg-cyan-400 border-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                                : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                    >
                        <Icon size={16} />
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
};
