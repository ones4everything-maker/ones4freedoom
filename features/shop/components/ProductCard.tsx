
import React, { useState } from 'react';
import { ShoppingCart, Check, Plus } from 'lucide-react';
import { ProductItem } from '../data/products';

interface ProductCardProps {
    product: ProductItem;
    onSelect: (p: ProductItem) => void;
    onAddToCart: (p: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddToCart }) => {
    const [isAdded, setIsAdded] = useState(false);
    
    // Design Tokens from prompt
    const colors = {
        accent: '#00FFD1',        // Cyan
        bgTop: '#021959',         // Card Top
        bgBot: '#07163D',         // Card Bottom (Updated)
        textPrimary: '#FFFFFF',
        textSecondary: '#9AA4B2'
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div 
            onClick={() => onSelect(product)}
            className="group relative flex flex-col rounded-[32px] overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
            style={{
                background: `linear-gradient(180deg, ${colors.bgTop} 0%, ${colors.bgBot} 100%)`,
                boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.05), 0 10px 30px -10px rgba(0, 0, 0, 0.5)' // Base subtle stroke + shadow
            }}
        >
            {/* Hover Glow Effects */}
            <div className="absolute inset-0 rounded-[32px] transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none z-0"
                 style={{
                     boxShadow: `inset 0 0 0 1px ${colors.accent}40, 0 0 25px ${colors.accent}20` // Inner cyan stroke + outer bloom
                 }}
            />

            {/* Image Container */}
            <div className="p-3 pb-0 relative z-10">
                <div className="relative aspect-square w-full rounded-[24px] overflow-hidden bg-[#07163D] shadow-inner group-hover:shadow-[0_0_20px_rgba(0,255,209,0.1)] transition-all duration-500">
                    <img 
                        src={product.image} 
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                        alt={product.name}
                        loading="lazy"
                    />
                    
                    {/* Featured Badge (Top Left) */}
                    <div className="absolute top-3 left-3 z-20">
                        <div className="px-3 py-1 bg-[#021959]/90 backdrop-blur-md rounded-full border border-[#00FFD1]/30 shadow-[0_0_15px_rgba(0,255,209,0.2)]">
                             <span className="text-[9px] font-black text-[#00FFD1] uppercase tracking-widest block leading-none drop-shadow-[0_0_5px_rgba(0,255,209,0.5)]">
                                FEATURED
                             </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow relative z-10">
                {/* Title */}
                <h3 className="text-base font-bold text-white leading-tight mb-2 line-clamp-2 min-h-[2.5em] tracking-wide group-hover:text-[#00FFD1] transition-colors drop-shadow-sm">
                    {product.name}
                </h3>
                
                {/* Price (Cyan + Glow) */}
                <div className="mb-5 flex flex-col">
                    <span className="text-xl font-black tracking-tight drop-shadow-[0_0_8px_rgba(0,255,209,0.4)]" style={{ color: colors.accent }}>
                        ${product.price}
                    </span>
                    {product.compareAtPrice && (
                        <span className="text-xs line-through decoration-white/20 opacity-60 font-mono mt-0.5" style={{ color: colors.textSecondary }}>
                            ${product.compareAtPrice}
                        </span>
                    )}
                </div>

                <div className="mt-auto flex items-end justify-between">
                    {/* Series Tag (Bottom Left) */}
                    <div className="flex flex-col justify-end pb-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-widest opacity-80" style={{ color: colors.textSecondary }}>
                            FEATURED SERIES
                        </span>
                    </div>

                    {/* CTA Button (Gradient Cyan Pill) */}
                    <button 
                        onClick={handleAddToCart}
                        className={`
                            relative h-10 pl-4 pr-5 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg overflow-hidden
                            ${isAdded ? 'bg-white' : 'bg-gradient-to-r from-[#00FFD1] to-[#008F75] hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,255,209,0.5)]'}
                        `}
                    >
                        {isAdded ? (
                            <div className="flex items-center gap-1.5 animate-in zoom-in duration-300">
                                <Check size={16} className="text-[#07163D]" strokeWidth={4} />
                                <span className="text-[11px] font-black text-[#07163D] uppercase tracking-wider">Added</span>
                            </div>
                        ) : (
                            <>
                                <Plus size={16} className="text-[#07163D] stroke-[3px]" />
                                <span className="text-[12px] font-black text-[#07163D] uppercase tracking-wider">Add</span>
                                <ShoppingCart size={16} className="text-[#07163D] fill-[#07163D]/20 ml-0.5" />
                            </>
                        )}
                        
                        {/* Internal Button Glow */}
                        {!isAdded && <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </button>
                </div>
            </div>
        </div>
    );
};
