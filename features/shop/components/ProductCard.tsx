
import React, { useState } from 'react';
import { Eye, ShoppingBag, Zap, Shield, AlertTriangle } from 'lucide-react';
import { ProductItem } from '../data/products';

interface ProductCardProps {
    product: ProductItem;
    onSelect: (p: ProductItem) => void;
    onAddToCart: (p: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddToCart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isLowStock = product.totalInventory > 0 && product.totalInventory < 10;

    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onSelect(product)}
            className="group relative bg-[#050A18]/60 rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 hover:border-cyan-400/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] cursor-pointer flex flex-col h-full"
        >
            {/* HUD Corner Accents */}
            <div className={`absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 transition-all duration-500 z-20 ${isHovered ? 'border-cyan-400 w-6 h-6' : 'border-white/10'}`} />
            <div className={`absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 transition-all duration-500 z-20 ${isHovered ? 'border-cyan-400 w-6 h-6' : 'border-white/10'}`} />
            <div className={`absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 transition-all duration-500 z-20 ${isHovered ? 'border-cyan-400 w-6 h-6' : 'border-white/10'}`} />
            <div className={`absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 transition-all duration-500 z-20 ${isHovered ? 'border-cyan-400 w-6 h-6' : 'border-white/10'}`} />

            {/* Top Badges */}
            <div className="absolute top-8 left-8 z-30 flex flex-col gap-2">
                <span className="px-3 py-1 bg-[#050A18]/80 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black text-white/40 tracking-[0.3em] uppercase group-hover:text-cyan-400 transition-colors">
                    CLASS_{product.category === 'hoodies' ? 'HEAVY' : 'LITE'}
                </span>
                {isLowStock && (
                    <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[8px] font-black text-red-400 tracking-[0.2em] uppercase flex items-center gap-2 animate-pulse">
                        <AlertTriangle size={8} /> CRITICAL_STOCK
                    </span>
                )}
            </div>

            {/* Main Image Section */}
            <div className="aspect-[4/5] relative overflow-hidden bg-[#0F1729]/50">
                <img 
                    src={product.image} 
                    className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`} 
                    alt={product.name}
                />
                
                {/* Overlay Gradients */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#050A18] via-transparent to-[#050A18]/20 transition-opacity duration-500 ${isHovered ? 'opacity-90' : 'opacity-60'}`} />
                
                {/* Center Action Overlay */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-cyan-400 text-black rounded-full shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-pulse-slow">
                            <Eye size={24} />
                        </div>
                        <span className="text-[10px] font-display font-black tracking-[0.5em] text-cyan-400 uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                            SCAN_INTEL
                        </span>
                    </div>
                </div>
                
                {/* Color Palette HUD */}
                <div className={`absolute bottom-8 right-8 flex flex-col gap-2 transition-all duration-500 delay-100 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                    {product.colors.map((c, i) => (
                        <div 
                            key={i}
                            className="w-3 h-3 rounded-full border border-white/20 shadow-lg"
                            style={{ backgroundColor: c.hex }}
                        />
                    ))}
                </div>
            </div>

            {/* Info Section */}
            <div className="p-8 md:p-10 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-display font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors duration-300">
                            {product.name}
                        </h3>
                        <div className="flex gap-4">
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em] transition-colors duration-300 group-hover:text-cyan-400/50">SKU_{product.sku}</span>
                            <div className="h-3 w-[1px] bg-white/10" />
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">{product.category}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                            ${product.price}
                        </span>
                    </div>
                </div>

                {/* Technical Features Strip */}
                <div className="flex gap-2 mb-8 overflow-hidden h-6">
                    {product.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[8px] font-black text-white/30 border border-white/5 px-2 py-1 rounded bg-white/[0.02] tracking-widest uppercase whitespace-nowrap group-hover:border-cyan-400/20 group-hover:text-cyan-400/60 transition-colors duration-500">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Primary Action */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="mt-auto group/btn relative w-full py-5 bg-white/5 hover:bg-cyan-400 text-white hover:text-black font-black text-[10px] uppercase tracking-[0.5em] rounded-2xl transition-all duration-500 border border-white/10 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        <ShoppingBag size={14} className="group-hover/btn:animate-bounce" />
                        DEPLOY_UNIT
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                </button>
            </div>

            {/* Bottom Tech Bar */}
            <div className="h-1 bg-white/5 relative overflow-hidden">
                <div 
                    className={`absolute inset-y-0 left-0 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-1000 ease-out`}
                    style={{ width: isHovered ? '100%' : '15%' }}
                />
            </div>
        </div>
    );
};
