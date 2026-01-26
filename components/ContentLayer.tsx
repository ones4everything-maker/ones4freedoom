
import React, { useEffect, useState } from 'react';
import { SECTIONS, SCROLL_TO_DEPTH_RATIO } from '../constants';
import { SectionConfig, ShopifyProduct } from '../types';
import { fetchCollectionProducts } from '../services/shopifyService';
import { ShoppingBag, ChevronRight, Zap } from 'lucide-react';

const ProductStrip: React.FC<{ product: ShopifyProduct; onNavigate?: (view: 'immersive' | 'shop') => void }> = ({ product, onNavigate }) => (
  <div 
    onClick={() => onNavigate?.('shop')}
    className="group relative w-full bg-[#151926]/70 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-[#5F84C6]/50 transition-all duration-500 hover:scale-[1.02] shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(72,104,157,0.25)] cursor-pointer pointer-events-auto"
  >
    <div className="aspect-[3/4] overflow-hidden bg-[#151926]/50 relative">
      <img 
        src={product.images.edges[0]?.node.url} 
        alt={product.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
      />
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
    <div className="p-3 md:p-4 flex justify-between items-end bg-gradient-to-t from-[#0D101B] to-transparent">
      <div>
        <h4 className="text-white font-display text-xs md:text-sm font-bold tracking-widest truncate max-w-[100px] md:max-w-[120px]">{product.title}</h4>
        <p className="text-[#9FB3D9] text-[10px] md:text-xs mt-1 font-mono">
          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
        </p>
      </div>
      <button className="p-1.5 md:p-2 bg-[#5F84C6]/10 rounded-full text-[#5F84C6] hover:bg-[#5F84C6] hover:text-black transition-colors border border-[#5F84C6]/20 active:scale-90">
        <ShoppingBag size={14} className="md:w-4 md:h-4" />
      </button>
    </div>
  </div>
);

const OrbitalSection: React.FC<{ section: SectionConfig, isActive: boolean, distance: number, onNavigate?: (view: 'immersive' | 'shop') => void }> = ({ section, isActive, distance, onNavigate }) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const opacity = Math.max(0, 1 - Math.abs(distance) / 25);

  useEffect(() => {
    if (isActive && products.length === 0) {
      fetchCollectionProducts(section.collectionHandle).then(setProducts);
    }
  }, [isActive, section.collectionHandle]);

  if (opacity < 0.01) return null;

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-start md:justify-center p-4 pt-20 md:pt-48 pb-40 md:pb-60 pointer-events-none"
      style={{ opacity, transform: `translateY(${distance * 3}px)` }}
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-12 items-center pointer-events-auto">
        <div className="text-center lg:text-left mb-2 lg:mb-0">
          <h2 className="text-5xl md:text-9xl font-display font-black text-white leading-none mb-2 md:mb-6 tracking-tighter drop-shadow-[0_0_20px_rgba(72,104,157,0.3)]">
            {section.title}
          </h2>
          <p className="text-[#9FB3D9] text-sm md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-4 md:mb-10 font-light">
            {section.description}
          </p>
          
          {/* Luxury 3D Button */}
          <button 
            onClick={() => onNavigate?.('shop')}
            className="group relative px-6 py-4 md:px-8 md:py-5 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md text-white font-display font-bold text-[10px] md:text-xs tracking-[0.25em] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-t border-l border-white/20 border-r border-b border-black/20 rounded-xl overflow-hidden active:translate-y-0 active:shadow-none cursor-pointer inline-flex"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#5F84C6]/0 via-[#5F84C6]/10 to-[#5F84C6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#5F84C6] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            
            <span className="relative z-10 flex items-center gap-4 group-hover:text-[#5F84C6] transition-colors">
                SCAN COLLECTION 
                <div className="p-1 rounded-full bg-white/5 border border-white/10 group-hover:border-[#5F84C6]/50 transition-colors">
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 md:gap-4 w-full">
          {products.slice(0, 4).map(p => <ProductStrip key={p.id} product={p} onNavigate={onNavigate} />)}
          {products.length === 0 && (
             <div className="col-span-2 flex flex-col items-center justify-center py-12 md:py-20 bg-[#0D101B]/40 border border-white/10 rounded-xl border-dashed backdrop-blur-sm pointer-events-auto">
                <div className="animate-spin mb-4 text-[#5F84C6]"><Zap size={24} /></div>
                <span className="text-xs font-mono text-white/40 tracking-widest uppercase">Initializing Inventory Feed...</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ContentLayer: React.FC<{ scrollY: number; onNavigate?: (view: 'immersive' | 'shop') => void }> = ({ scrollY, onNavigate }) => {
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Intro Overlay - Scroll to Explore */}
      <div className={`fixed bottom-0 left-0 right-0 h-20 flex items-end justify-center pb-4 z-50 pointer-events-none transition-all duration-1000 bg-gradient-to-t from-[#001B49] via-[#001B49]/80 to-transparent ${scrollY > 50 ? 'opacity-0 translate-y-[20px]' : 'opacity-100'}`}>
        <div className="text-center flex flex-col items-center gap-2">
          <h1 className="text-xl md:text-7xl font-serif text-white tracking-tight drop-shadow-2xl">
            Scroll to Explore
          </h1>
          <div className="animate-bounce mt-1">
             <svg width="20" height="40" viewBox="0 0 24 64" fill="none" className="text-[#EDEFF5] opacity-80 scale-75 md:scale-100">
                <path d="M12 0V60M12 60L4 50M12 60L20 50" stroke="currentColor" strokeWidth="1" />
             </svg>
          </div>
        </div>
      </div>

      {SECTIONS.map((section) => {
        const distance = currentDepth - section.depth;
        const isActive = Math.abs(distance) < 20;
        return (
          <OrbitalSection 
            key={section.id} 
            section={section} 
            isActive={isActive} 
            distance={distance} 
            onNavigate={onNavigate}
          />
        );
      })}
    </div>
  );
};
