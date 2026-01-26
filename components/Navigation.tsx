
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ShoppingCart, Menu, User, Search, Mic, X } from 'lucide-react';
import { TOTAL_SCROLL_HEIGHT } from '../constants';

interface NavigationProps {
  onNavigate?: (view: 'immersive' | 'shop') => void;
  scrollY?: number;
}

// --- Color Interpolation Utilities ---
const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

const lerpColor = (c1: number[], c2: number[], t: number) => {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t))
  ];
};

// Seasonal Theme Configuration - Updated for ONES4 New Brand
const SEASONAL_THEMES = [
  // Winter/Default -> Deep Midnight (#07163D) with Cyan Accent (#00FFD1)
  { pos: 0.00, bg: 'rgba(7, 22, 61, 0.95)', border: 'rgba(0, 255, 209, 0.3)', accent: '#00FFD1' },
  
  // Spring -> slightly warmer navy/purple mix
  { pos: 0.25, bg: 'rgba(24, 46, 111, 0.95)', border: 'rgba(232, 121, 249, 0.3)', accent: '#e879f9' },

  // Summer -> Deep Blue
  { pos: 0.50, bg: 'rgba(2, 25, 89, 0.95)', border: 'rgba(56, 189, 248, 0.3)', accent: '#38bdf8' },

  // Fall -> Darker
  { pos: 0.75, bg: 'rgba(7, 22, 61, 0.95)', border: 'rgba(251, 191, 36, 0.3)', accent: '#fbbf24' },

  // Loop back
  { pos: 1.00, bg: 'rgba(7, 22, 61, 0.95)', border: 'rgba(0, 255, 209, 0.3)', accent: '#00FFD1' }
];

const useSeasonalStyles = (scrollY: number) => {
  return useMemo(() => {
    const progress = Math.min(Math.max(scrollY / TOTAL_SCROLL_HEIGHT, 0), 0.99);
    
    let activeTheme = SEASONAL_THEMES[0];

    for (let i = 0; i < SEASONAL_THEMES.length - 1; i++) {
      if (progress >= SEASONAL_THEMES[i].pos && progress <= SEASONAL_THEMES[i+1].pos) {
        const t = (progress - SEASONAL_THEMES[i].pos) / (SEASONAL_THEMES[i+1].pos - SEASONAL_THEMES[i].pos);
        
        const parseRgba = (str: string) => {
            const parts = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            return parts ? [parseInt(parts[1]), parseInt(parts[2]), parseInt(parts[3])] : [0,0,0];
        };

        const bg1 = parseRgba(SEASONAL_THEMES[i].bg);
        const bg2 = parseRgba(SEASONAL_THEMES[i+1].bg);
        const acc1 = hexToRgb(SEASONAL_THEMES[i].accent);
        const acc2 = hexToRgb(SEASONAL_THEMES[i+1].accent);
        const bord1 = parseRgba(SEASONAL_THEMES[i].border);
        const bord2 = parseRgba(SEASONAL_THEMES[i+1].border);

        const bg = lerpColor(bg1, bg2, t);
        const acc = lerpColor(acc1, acc2, t);
        const bord = lerpColor(bord1, bord2, t);

        activeTheme = {
          bg: `rgba(${bg[0]}, ${bg[1]}, ${bg[2]}, 0.95)`,
          accent: `rgb(${acc[0]}, ${acc[1]}, ${acc[2]})`,
          border: `rgba(${bord[0]}, ${bord[1]}, ${bord[2]}, 0.3)`,
          pos: 0 // dummy
        };
        break;
      }
    }
    return activeTheme;
  }, [scrollY]);
};

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, scrollY = 0 }) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const theme = useSeasonalStyles(scrollY);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
        setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  }, [isMobileSearchOpen]);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            if (onNavigate && transcript.trim().length > 0) {
                 onNavigate('shop');
            }
        };
    } else {
        alert("Voice search requires a compatible browser.");
    }
  };

  return (
    <nav className="fixed top-4 md:top-6 left-0 right-0 z-[150] px-4 md:px-6 pointer-events-none flex justify-center">
        <div 
            className="w-full max-w-7xl rounded-full border backdrop-blur-xl transition-all duration-700 pointer-events-auto shadow-2xl relative overflow-hidden"
            style={{ 
              backgroundColor: theme.bg,
              borderColor: theme.border,
              boxShadow: `0 8px 40px -4px ${theme.border}`,
              '--nav-accent': theme.accent,
              '--nav-border': theme.border
            } as React.CSSProperties}
        >
            <div className="h-20 md:h-24 relative flex items-center justify-between px-2 md:px-8">
                
                {/* Mobile Search Overlay */}
                <div className={`absolute inset-0 z-20 flex items-center px-4 md:hidden transition-all duration-300 ${isMobileSearchOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-full pointer-events-none'}`} style={{ backgroundColor: theme.bg }}>
                     <div className="w-full relative flex items-center gap-2 bg-black/20 rounded-full border border-white/10 px-4 h-12">
                         <Search size={18} className="text-[var(--nav-accent)] shrink-0" />
                         <input 
                            ref={mobileInputRef}
                            type="text" 
                            placeholder="SEARCH DATABASE..." 
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40 font-bold uppercase tracking-widest h-full"
                            onKeyDown={(e) => { if (e.key === 'Enter') { setIsMobileSearchOpen(false); onNavigate?.('shop'); } }}
                         />
                         <button onClick={handleVoiceSearch} className="p-2 text-white/40 hover:text-[var(--nav-accent)] active:scale-90 transition-transform">
                             <Mic size={18} />
                         </button>
                         <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                         <button 
                            onClick={() => setIsMobileSearchOpen(false)} 
                            className="p-2 -mr-2 text-white/60 hover:text-white active:scale-95 transition-transform"
                         >
                            <X size={20} />
                         </button>
                     </div>
                </div>

                {/* Main Content */}
                <div className={`flex items-center justify-between w-full h-full transition-opacity duration-300 ${isMobileSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    
                    {/* Left: Hamburger + Brand */}
                    <div className="flex items-center gap-2 md:gap-6 shrink-0">
                        <button 
                            onClick={() => onNavigate?.('shop')} 
                            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 text-white hover:text-[var(--nav-accent)] transition-all active:scale-95"
                            aria-label="Menu"
                        >
                            <Menu size={24} className="md:w-6 md:h-6" />
                        </button>
                        <button onClick={() => onNavigate?.('immersive')} className="outline-none py-2 px-1">
                            <span className="font-display font-bold text-lg md:text-xl tracking-[0.2em] text-white hover:text-[var(--nav-accent)] transition-colors">ONES4</span>
                        </button>
                    </div>

                    {/* Center: Search Pill (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-6">
                        <div className="w-full relative group">
                            <div className="absolute inset-0 bg-black/20 rounded-full border border-white/10 group-focus-within:border-[var(--nav-accent)] transition-all duration-300" />
                            <input 
                                type="text" 
                                placeholder="SEARCH DATABASE..." 
                                className="w-full bg-transparent relative z-10 rounded-full py-2 pl-10 pr-10 text-[10px] font-bold uppercase tracking-[0.15em] text-white placeholder:text-white/40 outline-none h-10"
                                onKeyDown={(e) => { if (e.key === 'Enter') onNavigate?.('shop'); }}
                            />
                            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[var(--nav-accent)] transition-colors z-20" />
                            <button onClick={handleVoiceSearch} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-[var(--nav-accent)] transition-colors z-20 active:scale-90">
                                <Mic size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex items-center gap-1 md:gap-4 shrink-0">
                         {/* Mobile Search Pill */}
                         <button 
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="md:hidden flex items-center gap-2.5 pl-4 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 active:scale-95 transition-all mr-1 group backdrop-blur-md"
                            aria-label="Search"
                         >
                            <Search size={16} className="text-[var(--nav-accent)]" />
                            <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Search</span>
                            <div className="w-[1px] h-3 bg-white/10"></div>
                            <Mic size={14} className="opacity-60 group-hover:opacity-100" />
                         </button>

                         <button className="hidden md:flex w-12 h-12 items-center justify-center rounded-full hover:bg-white/10 text-white hover:text-[var(--nav-accent)] transition-all active:scale-95">
                            <User size={22} className="md:w-[22px] md:h-[22px]" />
                        </button>
                        
                        <button 
                            onClick={() => onNavigate?.('shop')} 
                            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 text-white hover:text-[var(--nav-accent)] transition-all relative active:scale-95"
                        >
                            <ShoppingCart size={22} className="md:w-[22px] md:h-[22px]" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
  );
};
