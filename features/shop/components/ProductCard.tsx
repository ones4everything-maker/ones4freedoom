
import React from 'react';
import { Eye, ShoppingBag } from 'lucide-react';
import { ProductItem } from '../data/products';

interface ProductCardProps {
    product: ProductItem;
    onSelect: (p: ProductItem) => void;
    onAddToCart: (p: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onAddToCart }) => {
    return (
        <div 
            onClick={() => onSelect(product)}
            className="group relative bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden hover:border-cyan-400/40 transition-all duration-700 hover:-translate-y-4 shadow-2xl cursor-pointer"
        >
            <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                    src={product.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 flex items-center gap-3">
                    <div className="p-3 bg-cyan-400 rounded-full text-black"><Eye size={20} /></div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">EXPAND UNIT INTEL</span>
                </div>
            </div>
            <div className="p-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight mb-2">{product.name}</h3>
                        <div className="flex gap-3">
                            {product.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em]">{tag}</span>
                            ))}
                        </div>
                    </div>
                    <span className="text-2xl font-black text-cyan-400">${product.price}</span>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="w-full py-5 bg-white/5 hover:bg-cyan-400 text-white hover:text-black font-black text-[10px] uppercase tracking-[0.5em] rounded-2xl transition-all border border-white/10"
                >
                    DEPLOY UNIT
                </button>
            </div>
        </div>
    );
};
