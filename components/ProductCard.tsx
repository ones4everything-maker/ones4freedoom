import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, Check } from 'lucide-react';
import { WooProduct } from '../types';

interface ProductCardProps {
  product: WooProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isAdded) return; 
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative bg-surface/80 md:bg-surface/40 border border-white/5 hover:border-accent/50 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,180,255,0.25)] sm:hover:shadow-[0_0_40px_rgba(0,180,255,0.3)] flex flex-col h-full">
      {/* Image Container */}
      <div className="aspect-square relative overflow-hidden bg-surface/50">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10 opacity-60"></div>
        <img 
          src={product.images[0]?.src} 
          alt={product.images[0]?.alt || product.name}
          loading="lazy"
          width="400"
          height="400"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
        />
        
        {/* Floating Tag */}
        {product.on_sale && (
          <div className="absolute top-2 right-2 z-20 bg-accent text-black text-[10px] sm:text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-lg">
            Sale
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 relative z-20 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-white font-medium text-sm sm:text-lg tracking-wide truncate group-hover:text-accent transition-colors duration-300" title={product.name}>
            {product.name}
          </h3>
          
          {/* Mobile-visible description */}
          <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500 line-clamp-2 block md:hidden">
             {product.short_description.replace(/<[^>]*>?/gm, '')}
          </p>
        </div>
        
        <div className="flex justify-between items-end mt-3 sm:mt-4">
          <div className="flex flex-col">
            <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">Price</span>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-base sm:text-xl font-bold text-white font-display">${product.price}</span>
              {product.regular_price !== product.price && (
                <span className="text-[10px] sm:text-xs text-gray-500 line-through">${product.regular_price}</span>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className={`
                relative p-3 sm:p-2 rounded-full transition-all duration-300 border overflow-hidden
                focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black
                ${isAdded 
                    ? 'bg-accent border-accent text-black scale-105 shadow-[0_0_15px_rgba(0,180,255,0.5)]' 
                    : 'bg-white/10 border-white/10 text-white hover:bg-accent hover:text-black hover:border-accent active:scale-95'
                }
            `}
            aria-label={`Add ${product.name} to cart`}
          >
            <div className={`relative z-10 transition-transform duration-300 flex items-center justify-center ${isAdded ? 'scale-110' : ''}`}>
                {isAdded ? <Check size={18} className="animate-in zoom-in duration-300" /> : <ShoppingBag size={18} />}
            </div>
            
            {/* Subtle Burst Animation */}
            {isAdded && (
              <>
                <span className="absolute inset-0 bg-white/40 rounded-full animate-ping opacity-75 duration-500"></span>
                <span className="absolute inset-[-4px] border border-white/30 rounded-full animate-[ping_0.7s_ease-out_1] opacity-0"></span>
              </>
            )}
          </button>
        </div>
        
        {/* Desktop Hover Reveal Description */}
        <div className="hidden md:block h-0 group-hover:h-auto overflow-hidden transition-all duration-500">
            <p className="pt-3 text-xs text-gray-400 line-clamp-2">
                {product.short_description.replace(/<[^>]*>?/gm, '')}
            </p>
            <div className="flex items-center gap-1 text-accent text-xs mt-2 uppercase tracking-wider font-bold cursor-pointer hover:underline">
                View Specs <ChevronRight size={12} />
            </div>
        </div>
      </div>

      {/* Glow Effect Overlay */}
      <div className="absolute inset-0 border-2 border-accent/0 group-hover:border-accent/30 rounded-xl pointer-events-none transition-all duration-500"></div>
    </div>
  );
};
