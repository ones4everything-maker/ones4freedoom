import React, { useEffect, useState } from 'react';
import { SECTIONS, SCROLL_TO_DEPTH_RATIO } from '../constants';
import { SectionConfig, WooProduct } from '../types';
import { fetchProductsByCategory } from '../services/wooService';
import { ProductCard } from './ProductCard';
import { ArrowDown } from 'lucide-react';

interface ContentLayerProps {
  scrollY: number;
}

const SectionContent: React.FC<{ section: SectionConfig; isActive: boolean; distance: number }> = ({ section, isActive, distance }) => {
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch when section becomes active or close to active
    if (isActive && products.length === 0 && !loading) {
      setLoading(true);
      fetchProductsByCategory(section.categorySlug)
        .then(setProducts)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isActive, section.categorySlug, products.length, loading]);

  // Calculate dynamic opacity and parallax offsets based on signed distance
  // distance > 0: approaching (content flows up from bottom)
  // distance < 0: leaving (content flows up to top)
  // Range of interest is approx -30 to +30
  
  const fadeRange = 30;
  const opacity = Math.max(0, Math.min(1, 1 - Math.abs(distance) / fadeRange));
  
  // Parallax intensity
  const headerOffset = distance * 1.5;
  const gridOffset = distance * 0.5;

  // If completely invisible, don't render content to save resources, but keep layout
  if (opacity <= 0.01) return <div className="absolute inset-0 pointer-events-none" />;

  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-start md:justify-center transition-opacity duration-[800ms] ease-in-out"
      style={{ 
        zIndex: 10,
        opacity: opacity,
        pointerEvents: opacity > 0.6 ? 'auto' : 'none'
      }}
    >
      <div className="w-full max-w-7xl px-4 sm:px-6 md:px-8 pt-20 pb-20 md:py-0 h-full md:h-auto flex flex-col md:flex-row items-center gap-6 md:gap-8 lg:gap-16 justify-center">
        
        {/* Left Column: Section Header */}
        <div 
            className="w-full md:w-5/12 lg:w-4/12 text-center md:text-left flex-shrink-0"
            style={{ transform: `translateY(${headerOffset}px)` }}
        >
            <div className="flex items-center justify-center md:justify-start gap-4 mb-3 md:mb-4">
                <span className="h-[1px] w-8 md:w-12 bg-accent"></span>
                <span className="text-accent tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs uppercase font-bold">{section.subtitle}</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 md:mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] leading-none">
                {section.title}
            </h2>
            
            <p className="max-w-xl text-gray-400 text-sm md:text-base lg:text-lg leading-relaxed mx-auto md:mx-0 mb-6 md:mb-8 line-clamp-3 md:line-clamp-none">
                {section.description}
            </p>

            <button className="hidden md:inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-accent/50 hover:bg-accent/10 text-accent font-bold tracking-widest uppercase rounded-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,180,255,0.3)] group">
                <span className="group-hover:translate-x-1 transition-transform">Explore Collection</span>
            </button>
        </div>

        {/* Right Column: Product Grid */}
        <div 
            className="w-full md:w-7/12 lg:w-8/12 flex-1 md:flex-none min-h-0 flex flex-col"
            style={{ transform: `translateY(${gridOffset}px)` }}
        >
            <div className="relative bg-surface/10 backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-6 overflow-hidden h-full md:h-auto flex flex-col">
                {/* HUD Decorations */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/30 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/30 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/30 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/30 rounded-br-2xl"></div>

                {loading ? (
                <div className="w-full flex-1 flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
                ) : products.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 md:flex-none md:max-h-[60vh]">
                    {products.map((p, i) => (
                        <div 
                            key={p.id}
                            style={{ 
                                // Staggered parallax effect per item
                                // Items further in the grid move slightly faster/slower relative to scroll
                                transform: `translateY(${distance * (1 + (i % 3) * 0.8)}px)`
                            }}
                        >
                            <ProductCard product={p} />
                        </div>
                    ))}
                </div>
                ) : (
                <div className="text-center p-12 flex-1 flex items-center justify-center">
                    <p className="text-gray-400">No signals detected in this sector.</p>
                </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export const ContentLayer: React.FC<ContentLayerProps> = ({ scrollY }) => {
  // Current virtual depth based on scroll
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;

  // Find the next approaching section (deeper than current depth)
  const nextSection = SECTIONS.find(s => s.depth < currentDepth - 5);
  
  // Find active section for HUD
  const activeSection = SECTIONS.find(s => Math.abs(currentDepth - s.depth) < 20);

  // Calculate progress to next section
  let progress = 0;
  if (nextSection && !activeSection) {
    const previousSectionIndex = SECTIONS.indexOf(nextSection) - 1;
    const previousDepth = previousSectionIndex >= 0 ? SECTIONS[previousSectionIndex].depth : 0;
    const totalDistance = Math.abs(nextSection.depth - previousDepth);
    const traveled = Math.abs(currentDepth - previousDepth);
    progress = Math.min(Math.max((traveled / totalDistance) * 100, 0), 100);
  }

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Scroll Indicators - Responsive positioning */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-50 transition-all duration-500 ${nextSection || activeSection ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex flex-col items-center gap-1 bg-background/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 shadow-xl">
            <span className="text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-[0.2em]">
                {activeSection ? 'Signal Established' : 'Approaching'}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-accent font-bold drop-shadow-md whitespace-nowrap">
                {activeSection ? activeSection.title : (nextSection?.title || 'Unknown Sector')}
            </span>
            
            {!activeSection && nextSection && (
                <div className="w-20 sm:w-24 h-[2px] bg-white/10 mt-1 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-accent shadow-[0_0_10px_#00b4ff] transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
        </div>
        <ArrowDown size={16} className={`text-white animate-bounce ${activeSection ? 'opacity-50' : 'opacity-100'}`} />
      </div>

      {/* Depth Gauge (Sticky Sidebar) - Hidden on Mobile */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 z-40">
        {SECTIONS.map((s) => {
            const absDistance = Math.abs(currentDepth - s.depth);
            const isNear = absDistance < 20;
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

      {SECTIONS.map((section) => {
        // Calculate signed distance for parallax logic
        const signedDistance = currentDepth - section.depth; 
        
        // Widen the active/render range to allow for enter/exit animations
        // Range: +/- 40 units (was 20)
        const isRenderRange = Math.abs(signedDistance) < 40;
        
        // Logic for fetching trigger can remain tighter
        const isActiveForFetch = Math.abs(signedDistance) < 25;

        if (!isRenderRange) return null;

        return (
          <div key={section.id} className="pointer-events-none">
             <SectionContent 
                section={section} 
                isActive={isActiveForFetch} 
                distance={signedDistance}
            />
          </div>
        );
      })}
    </div>
  );
};