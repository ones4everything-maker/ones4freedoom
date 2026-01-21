
import React, { useEffect, useState, useRef } from 'react';
import { SECTIONS, SCROLL_TO_DEPTH_RATIO, SEASON_METADATA } from '../constants';
import { SectionConfig, ShopifyProduct } from '../types';
import { fetchCollectionProducts } from '../services/shopifyService';
import { ShoppingBag, ChevronRight, AlertTriangle, Zap } from 'lucide-react';

const ProductStrip: React.FC<{ product: ShopifyProduct }> = ({ product }) => (
  <div className="group relative w-full bg-surface/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-accent/50 transition-all duration-500">
    <div className="aspect-[3/4] overflow-hidden">
      <img 
        src={product.images.edges[0]?.node.url} 
        alt={product.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
    </div>
    <div className="p-4 flex justify-between items-end">
      <div>
        <h4 className="text-white font-display text-sm font-bold tracking-widest">{product.title}</h4>
        <p className="text-accent text-xs mt-1">
          {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
        </p>
      </div>
      <button className="p-2 bg-accent/10 rounded-full text-accent hover:bg-accent hover:text-black transition-colors">
        <ShoppingBag size={16} />
      </button>
    </div>
  </div>
);

const SeasonAlert: React.FC<{ activeId: string }> = ({ activeId }) => {
  const [visible, setVisible] = useState(false);
  const prevId = useRef(activeId);
  const meta = SEASON_METADATA[activeId];

  useEffect(() => {
    if (activeId !== prevId.current) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      prevId.current = activeId;
      return () => clearTimeout(timer);
    }
  }, [activeId]);

  if (!visible || !meta) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none animate-in fade-in zoom-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-4 bg-black/80 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-2 text-yellow-500 animate-pulse">
          <Zap size={18} fill="currentColor" />
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-white/50 tracking-[0.2em] uppercase">Season Transition</span>
          <span className="text-sm font-display font-bold text-white tracking-widest">
            {meta.alert}
          </span>
        </div>
      </div>
    </div>
  );
};

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
          <span className="inline-block px-3 py-1 border border-accent/40 text-accent text-[10px] font-mono tracking-widest mb-4">
            SECTOR: {section.title}
          </span>
          <h2 className="text-5xl md:text-8xl font-display font-black text-white leading-none mb-6">
            {section.title}
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-8">
            {section.description}
          </p>
          <button className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-display font-bold text-xs tracking-widest hover:bg-accent hover:text-white transition-all">
            SCAN COLLECTION <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {products.slice(0, 4).map(p => <ProductStrip key={p.id} product={p} />)}
          {products.length === 0 && (
             <div className="col-span-2 flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-xl border-dashed">
                <div className="animate-spin mb-4 text-accent"><Zap size={24} /></div>
                <span className="text-xs font-mono text-white/40">Initializing Inventory Feed...</span>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ContentLayer: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;
  
  // Identify currently active section for the Alert
  const activeSection = SECTIONS.reduce((prev, curr) => {
    return (Math.abs(currentDepth - curr.depth) < Math.abs(currentDepth - prev.depth)) ? curr : prev;
  });

  return (
    <div className="fixed inset-0 pointer-events-none">
      <SeasonAlert activeId={activeSection.id} />

      {/* Intro Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${scrollY > 150 ? 'opacity-0' : 'opacity-100'}`}>
        <div className="text-center">
          <h1 className="text-[12vw] font-display font-black text-white leading-none opacity-10 select-none">ONES4</h1>
          <p className="text-accent tracking-[1.5em] text-xs font-bold uppercase mt-8 animate-pulse">Initiate Orbital Jump</p>
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

      {/* Orbital HUD */}
      <div className="fixed left-8 bottom-8 z-50 flex items-end gap-6 pointer-events-auto">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-white/40 font-mono tracking-widest">DEPTH</span>
          <span className="text-2xl font-display font-bold text-accent tabular-nums">
            {Math.abs(currentDepth).toFixed(2)}m
          </span>
        </div>
        <div className="h-12 w-[1px] bg-white/20"></div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-white/40 font-mono tracking-widest">SECTOR</span>
          <span className="text-sm font-display font-bold text-white uppercase tracking-widest">
            {SEASON_METADATA[activeSection.id]?.label || 'UNKNOWN'}
          </span>
        </div>
        <div className="h-12 w-[1px] bg-white/20"></div>
        <div className="flex gap-3 mb-1">
          {SECTIONS.map(s => {
             const dist = Math.abs(currentDepth - s.depth);
             const active = dist < 12;
             return (
              <div 
                key={s.id} 
                className={`w-2 h-2 rounded-full transition-all duration-500 ${active ? 'bg-accent scale-150 shadow-[0_0_15px_#00b4ff]' : 'bg-white/10 hover:bg-white/30'}`}
                title={s.title}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-4 text-white/40 font-mono text-[10px] tracking-widest pointer-events-auto">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> FEED: SYNCED</span>
          <span className="hidden sm:inline">2024_DEPLOYMENT_V2.0</span>
      </div>
    </div>
  );
};
