
import React, { useState } from 'react';
import { Eye, ShoppingBag, AlertTriangle } from 'lucide-react';
import { ProductItem } from '../data/products';

interface ProductCardProps {
    product: ProductItem;
    onSelect: (p: ProductItem) => void;
    onAddToCart: (p: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isLowStock = product.totalInventory > 0 && product.totalInventory < 10;
    const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0;

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onSelect(product)}
            className="group relative bg-[#151926]/60 backdrop-blur-md rounded-2xl md:rounded-[2.5rem] border border-white/10 overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1 hover:border-cyan-400 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] cursor-pointer flex flex-col h-full ring-1 ring-white/5 hover:ring-cyan-400/20"
        >
            {/* Top Badges */}
            <div className="absolute top-3 left-3 md:top-6 md:left-6 z-30 flex flex-col gap-1 md:gap-2">
                {product.compareAtPrice && (
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-[#F50DB4] text-white rounded-md text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-sm w-fit">
                        -{discount}% OFF
                    </span>
                )}
                {isLowStock && (
                    <span className="px-2 py-0.5 md:px-3 md:py-1 bg-red-500/20 border border-red-500/40 rounded-md text-[8px] md:text-[9px] font-black text-red-400 uppercase tracking-wider flex items-center gap-1 w-fit">
                        <AlertTriangle size={8} className="md:w-[10px] md:h-[10px]" /> LOW STOCK
                    </span>
                )}
            </div>

            {/* Main Image Section */}
            <div className="aspect-[4/5] relative overflow-hidden bg-[#151926]/50">
                <img 
                    src={product.image} 
                    className={`w-full h-full object-cover transition-transform duration-500 ease-out ${isHovered ? 'scale-105' : 'scale-100'}`} 
                    alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D101B] via-transparent to-transparent opacity-60" />
                
                {/* Center Hover Action */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <div className="p-2 md:p-4 bg-cyan-400/90 backdrop-blur-sm rounded-full text-black shadow-lg border border-white/20">
                        <Eye size={20} className="md:w-6 md:h-6" />
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="p-4 md:p-8 flex flex-col flex-1">
                <div className="mb-2 md:mb-4">
                    <h3 className="text-sm md:text-xl font-display font-black tracking-tight text-white mb-1 md:mb-2 leading-none">
                        {product.name}
                    </h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2 text-[8px] md:text-[10px] text-white/40 font-mono uppercase tracking-widest">
                        <span>{product.category} Series</span>
                        <span className="hidden md:inline">/</span>
                        <span>SKU: {product.sku}</span>
                    </div>
                </div>

                <div className="mt-auto flex flex-col md:flex-row md:items-end justify-between gap-1">
                    <div className="flex flex-col">
                        {product.compareAtPrice && (
                            <span className="text-[10px] md:text-xs text-white/30 line-through font-mono decoration-white/30">${product.compareAtPrice}</span>
                        )}
                        <span className="text-lg md:text-3xl font-display font-black text-cyan-400 drop-shadow-sm">
                            ${product.price}
                        </span>
                    </div>
                    
                    {/* Rating Stars (Static for card) */}
                    <div className="flex gap-0.5 mb-1">
                         {[1,2,3,4,5].map(i => <div key={i} className={`w-0.5 h-0.5 md:w-1 md:h-1 rounded-full ${i <= 4 ? 'bg-yellow-400' : 'bg-white/20'}`} />)}
                         <span className="text-[8px] md:text-[9px] text-white/40 ml-1 font-mono">(247)</span>
                    </div>
                </div>

                {/* Primary Action */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="mt-3 md:mt-6 w-full py-3 md:py-4 bg-white/5 hover:bg-cyan-400 text-white hover:text-black font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-lg md:rounded-xl transition-all duration-300 border border-white/10 hover:border-transparent hover:shadow-lg"
                >
                    ADD TO CART
                </button>
            </div>
        </div>
    );
};
