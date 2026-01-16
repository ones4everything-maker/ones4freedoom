import React from 'react';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { WooProduct } from '../types';

interface ProductCardProps {
  product: WooProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-surface/40 border border-white/5 hover:border-accent/50 rounded-lg overflow-hidden backdrop-blur-sm transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10 opacity-60"></div>
        <img 
          src={product.images[0]?.src} 
          alt={product.images[0]?.alt}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Floating Tag */}
        {product.on_sale && (
          <div className="absolute top-2 right-2 z-20 bg-accent text-black text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            Sale
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 relative z-20">
        <h3 className="text-white font-medium text-lg tracking-wide truncate group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col">
            <span className="text-gray-400 text-xs uppercase tracking-widest">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white font-display">${product.price}</span>
              {product.regular_price !== product.price && (
                <span className="text-xs text-gray-500 line-through">${product.regular_price}</span>
              )}
            </div>
          </div>
          
          <button className="bg-white/5 hover:bg-accent hover:text-black text-white p-2 rounded-full transition-all duration-300 border border-white/10 hover:border-accent">
            <ShoppingBag size={18} />
          </button>
        </div>
        
        {/* Hover Reveal Description */}
        <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
            <p className="pt-3 text-xs text-gray-400 line-clamp-2">
                {product.short_description.replace(/<[^>]*>?/gm, '')}
            </p>
            <div className="flex items-center gap-1 text-accent text-xs mt-2 uppercase tracking-wider font-bold cursor-pointer hover:underline">
                View Specs <ChevronRight size={12} />
            </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 border-2 border-accent/0 group-hover:border-accent/20 rounded-lg pointer-events-none transition-colors duration-500"></div>
    </div>
  );
};
