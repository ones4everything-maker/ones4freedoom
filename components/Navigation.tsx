
import React, { useState, useMemo } from 'react';
import { ShoppingCart, Menu, User, Search, X, Mic } from 'lucide-react';
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

const interpolateColor = (progress: number) => {
  const p = Math.min(Math.max(progress, 0), 1);
  
  // Seasonal mapping: Spring -> Summer -> Fall -> Winter
  const stops = [
    { pos: 0.00, color: '#1E2A3A' }, // Spring Night
    { pos: 0.25, color: '#0F1C2E' }, // Summer Night
    { pos: 0.50, color: '#2A1F2D' }, // Fall Night
    { pos: 0.75, color: '#0A1423' }, // Winter Night
    { pos: 1.00, color: '#0A1423' }  // Winter Continued
  ];

  for (let i = 0; i < stops.length - 1; i++) {
    if (p >= stops[i].pos && p <= stops[i + 1].pos) {
      const t = (p - stops[i].pos) / (stops[i + 1].pos - stops[i].pos);
      const c1 = hexToRgb(stops[i].color);
      const c2 = hexToRgb(stops[i + 1].color);
      
      const r = lerp(c1[0], c2[0], t);
      const g = lerp(c1[1], c2[1], t);
      const b = lerp(c1[2], c2[2], t);
      
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, 0.85)`;
    }
  }
  
  // Fallback to last color
  const c = hexToRgb(stops[stops.length - 1].color);
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.85)`;
};

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, scrollY = 0 }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Calculate dynamic background color based on scroll
  const progress = scrollY / TOTAL_SCROLL_HEIGHT;
  const dynamicBg = interpolateColor(progress);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log("Voice Search:", transcript);
            if (onNavigate && transcript.trim().length > 0) {
                 onNavigate('shop');
            }
        };
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
        };
    } else {
        alert("Voice search requires a compatible browser.");
    }
  };

  return (
    <nav 
        className="fixed top-0 left-0 right-0 z-[150] backdrop-blur-xl border-b border-[#5F84C6]/10 transition-colors duration-700"
        style={{ backgroundColor: dynamicBg }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between gap-3">
        
        {/* Left Side: Branding & Menu */}
        <div className={`items-center gap-4 md:gap-8 ${isSearchVisible ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate?.('shop')}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all group active:scale-95 border border-white/5"
              aria-label="Open Menu"
            >
              <Menu size={20} className="md:w-6 md:h-6 group-hover:text-[#5F84C6]" />
            </button>
            <span className="hidden md:block text-white font-display font-black text-xl tracking-[0.3em] uppercase select-none drop-shadow-lg">
              MENU
            </span>
          </div>

          <div className="hidden lg:block w-[1px] h-6 bg-white/10 mx-2" />

          <button className="flex flex-col group text-left outline-none" onClick={() => onNavigate?.('immersive')}>
            <h1 className="text-2xl md:text-3xl font-display font-black tracking-[0.2em] text-white group-hover:text-[#5F84C6] transition-colors uppercase">
              ONES4
            </h1>
          </button>
        </div>

        {/* Center/Right: Search - Responsive */}
        <div className={`flex-1 flex items-center justify-end gap-3`}>
            {/* Search Input Container */}
            <div className={`relative flex-1 max-w-[280px] md:max-w-md group items-center transition-all duration-300 ${isSearchVisible ? 'flex animate-in fade-in slide-in-from-right-4' : 'hidden lg:flex'}`}>
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#5F84C6] pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="DEEP SCAN..." 
                  className="w-full bg-[#151926]/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-[10px] md:text-xs font-bold uppercase tracking-widest placeholder:text-white/20 focus:border-[#5F84C6]/50 transition-all outline-none text-white focus:bg-[#151926] h-10 md:h-12 shadow-inner" 
                  autoFocus={isSearchVisible}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onNavigate?.('shop');
                  }}
                  onBlur={() => {
                     if(window.innerWidth < 1024) setIsSearchVisible(false);
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button onClick={handleVoiceSearch} className="text-white/20 hover:text-[#5F84C6] transition-colors active:scale-90" title="Voice Search">
                        <Mic size={16} />
                    </button>
                </div>
            </div>

            <div className={`flex items-center gap-2 md:gap-4 ${isSearchVisible ? 'hidden md:flex' : 'flex'}`}>
                {!isSearchVisible && (
                    <button onClick={() => setIsSearchVisible(true)} className="lg:hidden p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all active:scale-95 border border-white/5" aria-label="Search">
                        <Search size={20} />
                    </button>
                )}

                <button className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white hover:text-[#5F84C6] border border-white/5 transition-colors hidden sm:block active:scale-95" aria-label="Account">
                    <User size={20} />
                </button>
                
                <button 
                    onClick={() => onNavigate?.('shop')}
                    className="relative p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all group active:scale-95 border border-white/5 hover:border-[#5F84C6]/30"
                    aria-label="Cart"
                >
                    <ShoppingCart size={20} className="text-white group-hover:text-[#5F84C6]" />
                </button>
            </div>
        </div>
      </div>
    </nav>
  );
};
