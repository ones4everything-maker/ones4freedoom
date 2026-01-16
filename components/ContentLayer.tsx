import React, { useEffect, useState } from 'react';
import { SECTIONS, SCROLL_TO_DEPTH_RATIO } from '../constants';
import { SectionConfig, WooProduct } from '../types';
import { fetchProductsByCategory } from '../services/wooService';
import { ProductCard } from './ProductCard';
import { ArrowDown } from 'lucide-react';

interface ContentLayerProps {
  scrollY: number;
}

const SectionContent: React.FC<{ section: SectionConfig; isActive: boolean }> = ({ section, isActive }) => {
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only fetch when section becomes roughly visible to save bandwidth
    if (isActive && products.length === 0 && !loading) {
      setLoading(true);
      fetchProductsByCategory(section.categorySlug)
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isActive, section.categorySlug, products.length, loading]);

  // Determine opacity based on active state (simple fade with slight blur and lift)
  const opacityClass = isActive ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-12 blur-sm pointer-events-none';

  return (
    <div 
      className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${opacityClass}`}
      style={{ zIndex: 10 }}
    >
      <div className="max-w-7xl w-full px-4 md:px-8 pt-20">
        
        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <span className="h-[1px] w-12 bg-accent"></span>
                <span className="text-accent tracking-[0.5em] text-xs uppercase font-bold">{section.subtitle}</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                {section.title}
            </h2>
            <p className="max-w-xl text-gray-400 text-lg leading-relaxed mx-auto md:mx-0">
                {section.description}
            </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="w-full h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border border-white/10 rounded-lg bg-surface/50 backdrop-blur-md">
            <p className="text-gray-400">No signals detected in this sector.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const ContentLayer: React.FC<ContentLayerProps> = ({ scrollY }) => {
  // Current virtual depth based on scroll
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;

  // Find the next approaching section (deeper than current depth + buffer)
  // SECTIONS are typically ordered 0, -40, -80...
  const nextSection = SECTIONS.find(s => s.depth < currentDepth - 10);
  
  // Also find if we are currently "in" a section
  const activeSection = SECTIONS.find(s => Math.abs(currentDepth - s.depth) < 20);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Scroll Indicators - Enhanced */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 transition-all duration-500 ${nextSection || activeSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em]">
                {activeSection ? 'Signal Established' : 'Approaching'}
            </span>
            <span className="text-xs uppercase tracking-widest text-accent font-bold drop-shadow-md">
                {activeSection ? activeSection.title : (nextSection?.title || 'Unknown Sector')}
            </span>
        </div>
        <ArrowDown size={16} className={`text-white animate-bounce ${activeSection ? 'opacity-50' : 'opacity-100'}`} />
      </div>

      {/* Depth Gauge (Sticky Sidebar) */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-8 z-40">
        {SECTIONS.map((s) => {
            // Check if we are "close" to this section to highlight the gauge
            const distance = Math.abs(currentDepth - s.depth);
            const isNear = distance < 20; // 20 units tolerance
            
            return (
                <div key={s.id} className="flex items-center gap-4 transition-all duration-300">
                    <div className={`h-16 w-[2px] transition-colors duration-300 ${isNear ? 'bg-accent shadow-[0_0_10px_#00b4ff]' : 'bg-white/10'}`}></div>
                    <div className={`text-xs uppercase tracking-widest transition-all duration-300 ${isNear ? 'text-white translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                        {s.title}
                    </div>
                </div>
            )
        })}
      </div>

      {/* Render All Sections (They manage their own visibility) */}
      {SECTIONS.map((section) => {
        // A section is active if the current depth is close to its defined depth
        // We use a "window" of visibility. E.g. +/- 20 units.
        const distance = Math.abs(currentDepth - section.depth);
        const isActive = distance < 20;

        return (
          <div key={section.id} className={`${isActive ? 'pointer-events-auto' : ''}`}>
             <SectionContent section={section} isActive={isActive} />
          </div>
        );
      })}
    </div>
  );
};