
import React, { useEffect, useState } from 'react';
import { SECTIONS, SCROLL_TO_DEPTH_RATIO } from '../constants';
import { SectionConfig, ShopifyProduct } from '../types';
import { fetchCollectionProducts } from '../services/shopifyService';
import { ShoppingBag, ChevronRight, Zap } from 'lucide-react';

const ProductStrip: React.FC<{ product: ShopifyProduct }> = ({ product }) => (
  <div className="group relative w-full bg-[#050A18]/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
    <div className="aspect-[3/4] overflow-hidden bg-[#0F1729]/50">
      <img 
        src={product.images.edges[0]?.node.url} 
        alt={product.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
    </div>
    <div className="p-4 flex justify-between items-end bg-gradient-to-t from-[#050A18] to-transparent">
      <div>
        <h4 className="text-white font-display text-sm font-bold tracking-widest">{product.title}</h4>
        <p className="text-cyan-400 text-xs mt-1 font-mono">
          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
        </p>
      </div>
      <button className="p-2 bg-cyan-400/10 rounded-full text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors border border-cyan-400/20">
        <ShoppingBag size={16} />
      </button>
    </div>
  </div>
);

const OrbitalSection: React.FC<{ section: SectionConfig, isActive: boolean, distance: number }> = ({ section, isActive, distance }) => {
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
      className="absolute inset-0 flex flex-col items-center justify-center p-6"
      style={{ opacity, transform: `translateY(${distance * 3}px)` }}
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-6xl md:text-9xl font-display font-black text-white leading-none mb-6 tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {section.title}
          </h2>
          <p className="text-blue-100/70 text-lg leading-relaxed max-w-md mb-10 font-light">
            {section.description}
          </p>
          
          {/* Styled Button matching the reference */}
          <button className="group flex items-center gap-4 px-8 py-4 bg-transparent border border-cyan-500/30 text-white font-display font-bold text-xs tracking-[0.2em] hover:bg-cyan-500/10 hover:border-cyan-400/60 transition-all shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] rounded-sm">
            SCAN COLLECTION <ChevronRight size={16} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map(p => <ProductStrip key={p.id} product={p} />)}
          {products.length === 0 && (
             <div className="col-span-2 flex flex-col items-center justify-center py-20 bg-[#050A18]/40 border border-white/10 rounded-xl border-dashed backdrop-blur-sm">
                <div className="animate-spin mb-4 text-cyan-400"><Zap size={24} /></div>
                <span className="text-xs font-mono text-white/40 tracking-widest uppercase">Initializing Inventory Feed...</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ContentLayer: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Intro Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${scrollY > 150 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-center">
          <h1 className="text-[12vw] font-display font-black text-white leading-none opacity-10 select-none tracking-tighter">ONES4</h1>
          <p className="text-cyan-400 tracking-[1.5em] text-xs font-bold uppercase mt-8 animate-pulse drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">Orbital Camp</p>
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
          />
        );
      })}
    </div>
  );
};
